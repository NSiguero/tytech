import { readFile } from 'fs/promises';
import { join } from 'path';
import { performanceMonitor, trackAIAnalysis, trackImageOptimization, trackBatchAnalysis, TrackPerformance } from './performance';

interface ProductDetection {
  product_name: string;
  confirmed_faces: number;
  price: string | null;
}

interface AIAnalysisResult {
  success: boolean;
  products: ProductDetection[];
  error?: string;
  processingTime?: number;
}

// Cache for processed images to avoid re-analyzing
const analysisCache = new Map<string, { result: AIAnalysisResult; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export class AIAnalysisService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1/chat/completions';
  private maxConcurrentRequests: number = 3;
  private activeRequests: number = 0;
  private requestQueue: Array<() => Promise<void>> = [];

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
  }

  private async processQueue(): Promise<void> {
    if (this.activeRequests >= this.maxConcurrentRequests || this.requestQueue.length === 0) {
      return;
    }

    this.activeRequests++;
    const nextRequest = this.requestQueue.shift();
    if (nextRequest) {
      try {
        await nextRequest();
      } finally {
        this.activeRequests--;
        this.processQueue(); // Process next request
      }
    }
  }

  private async queueRequest<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  async analyzeImage(imagePath: string): Promise<AIAnalysisResult> {
    const startTime = Date.now();

    try {
      console.log('🔍 AI Analysis Service: Starting image analysis for:', imagePath);

      // Check cache first
      const cacheKey = `${imagePath}_${await this.getFileHash(imagePath)}`;
      const cached = analysisCache.get(cacheKey);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log('✅ Returning cached result');
        return {
          ...cached.result,
          processingTime: Date.now() - startTime
        };
      }

      // Check if file exists
      try {
        const fs = require('fs');
        if (!fs.existsSync(imagePath)) {
          console.error(`❌ Image file does not exist at path: ${imagePath}`);
          return {
            success: false,
            products: [],
            error: `Image file not found: ${imagePath}`,
            processingTime: Date.now() - startTime
          };
        }
        console.log('✅ Image file exists at path:', imagePath);

      } catch (fsError) {
        console.error('❌ Error checking file existence:', fsError);
      }

      // Read and optimize the image
      console.log('📖 Reading and optimizing image file...');
      const optimizedBuffer = await this.optimizeImageForAnalysis(imagePath);
      const encodedImage = optimizedBuffer.toString('base64');
      console.log('✅ Image optimized and encoded, size:', optimizedBuffer.length, 'bytes');

      // Queue the API request for better concurrency management
      const result = await this.queueRequest(async () => {
        return await this.makeOpenAIRequest(encodedImage);
      });

      // Cache the successful result
      if (result.success) {
        analysisCache.set(cacheKey, {
          result: { ...result, processingTime: Date.now() - startTime },
          timestamp: Date.now()
        });
      }

      const totalTime = Date.now() - startTime;

      // Simple price logging
      this.logProductPrices(result.products, imagePath);

      trackAIAnalysis(totalTime, true, undefined, { imagePath, productsCount: result.products.length });

      console.log('🎉 AI analysis completed successfully!');
      return {
        ...result,
        processingTime: totalTime
      };

    } catch (error) {
      console.error('❌ AI analysis error:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');



      const totalTime = Date.now() - startTime;
      trackAIAnalysis(totalTime, false, error instanceof Error ? error.message : 'Unknown error', { imagePath });

      return {
        success: false,
        products: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTime: totalTime
      };
    }
  }

  private async getFileHash(filePath: string): Promise<string> {
    const fs = require('fs');
    const crypto = require('crypto');
    const stats = fs.statSync(filePath);
    const hash = crypto.createHash('md5');
    hash.update(`${filePath}_${stats.size}_${stats.mtime.getTime()}`);
    return hash.digest('hex');
  }

  private async optimizeImageForAnalysis(imagePath: string): Promise<Buffer> {
    const optimizationStart = Date.now();
    const imageBuffer = await readFile(imagePath);

    // Use Sharp for advanced image optimization
    const sharp = require('sharp');

    // Optimize based on image size and type
    let optimizedBuffer = imageBuffer;

    if (imageBuffer.length > 3 * 1024 * 1024) { // If larger than 3MB
      console.log('🔄 Image is large, applying advanced optimization...');

      // Get image metadata
      const metadata = await sharp(imageBuffer).metadata();

      // Calculate optimal dimensions while maintaining aspect ratio
      const maxDimension = 2048;
      let targetWidth = metadata.width;
      let targetHeight = metadata.height;

      if (metadata.width > maxDimension || metadata.height > maxDimension) {
        if (metadata.width > metadata.height) {
          targetWidth = maxDimension;
          targetHeight = Math.round((metadata.height * maxDimension) / metadata.width);
        } else {
          targetHeight = maxDimension;
          targetWidth = Math.round((metadata.width * maxDimension) / metadata.height);
        }
      }

      // Apply progressive optimization
      optimizedBuffer = await sharp(imageBuffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3 // High quality resizing
        })
        .jpeg({
          quality: 85, // Balanced quality/size
          progressive: true,
          mozjpeg: true, // Better compression
          chromaSubsampling: '4:4:4' // Better color quality
        })
        .toBuffer();

      console.log('✅ Advanced optimization applied, new size:', optimizedBuffer.length, 'bytes');
    }

    const optimizationTime = Date.now() - optimizationStart;
    trackImageOptimization(optimizationTime, true, undefined, {
      originalSize: imageBuffer.length,
      optimizedSize: optimizedBuffer.length,
      compressionRatio: Math.round((1 - optimizedBuffer.length / imageBuffer.length) * 100)
    });

    return optimizedBuffer;
  }

  private async makeOpenAIRequest(encodedImage: string): Promise<AIAnalysisResult> {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const payload = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are a retail-shelf vision assistant. For the image I provide, return a JSON array where each element has:\n\nproduct_name: Exact name from the main front panel, combining brand + variety (e.g., \"Gullón Crème Tropical\"). Use OCR and packaging design for confirmation. If unreadable or uncertain, return \"unrecognized\".\n\nconfirmed_faces: Count of clearly front-facing packs that are unmistakably this product.\n\nprice: Price from the shelf tag directly beneath the largest visible group of the product. Use exact price and currency symbol (e.g., \"1.85 €\"). If none visible, return null.\n\nRules (strictly follow all):\n\nScan the image from top to bottom, left to right.\nOnly include products with their front panel clearly visible.\nExclude or label as \"unrecognized\" any box turned sideways, blurred, cropped, or with an unclear front.\nGroup identical products even if split across different shelves or levels.\nCount only one face per physical unit — ignore duplicates from angled views or sides.\nDo not infer or guess names from unclear packaging — use \"unrecognized\" instead.\n\nOutput:\nReturn only a valid JSON array as response. No text or explanations outside the JSON.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${encodedImage}`,
                detail: 'high'
              }
            },
            {
              type: 'text',
              text: `REMINDER: Fast systematic scan from top-left to bottom-right. IGNORE top prices - look ONLY BELOW/UNDERNEATH each product for the correct price tags.`
            }
          ]
        }
      ],
      max_tokens: 1500, // Reduced for speed
      temperature: 0.1, // Lower temperature for more consistent results
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    };

    console.log('🌐 Making optimized OpenAI API request...');

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      console.log('📡 OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ OpenAI API error:', response.status, errorText);
        return {
          success: false,
          products: [],
          error: `OpenAI API error: ${response.status} - ${errorText}`
        };
      }

      const data = await response.json();
      console.log('📦 OpenAI API response received, choices:', data.choices?.length || 0);

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('❌ Unexpected OpenAI API response structure:', data);
        return {
          success: false,
          products: [],
          error: 'Unexpected API response structure'
        };
      }

      const result = data.choices[0].message.content;
      console.log('📝 OpenAI response content length:', result.length);

      // Parse the JSON response with improved error handling
      let products: ProductDetection[];
      try {
        console.log('🔧 Parsing JSON response...');

        if (!result || result.trim().length < 10) {
          console.error('❌ AI response is empty or too short:', result);
          return {
            success: false,
            products: [],
            error: 'AI returned empty or incomplete response'
          };
        }

        // Clean the response - remove markdown code blocks if present
        let cleanResult = result.trim();
        if (cleanResult.startsWith('```json')) {
          cleanResult = cleanResult.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        console.log('🧹 Cleaned response:', cleanResult.substring(0, 200) + '...');

        if (!cleanResult || cleanResult.trim().length < 10) {
          console.error('❌ Cleaned response is empty or too short:', cleanResult);
          return {
            success: false,
            products: [],
            error: 'AI returned empty response after cleaning'
          };
        }

        products = JSON.parse(cleanResult);
        if (!Array.isArray(products)) {
          throw new Error('Response is not an array');
        }
        console.log('✅ JSON parsed successfully, found', products.length, 'products');

      } catch (parseError) {
        console.error('❌ Failed to parse AI response:', result);
        console.error('❌ Parse error:', parseError);
        return {
          success: false,
          products: [],
          error: `Failed to parse AI response: ${parseError}`
        };
      }

      // Remove duplicate products before returning
      const uniqueProducts = this.removeDuplicateProducts(products);

      if (uniqueProducts.length !== products.length) {
        console.log(`🔄 Removed ${products.length - uniqueProducts.length} duplicate products`);
      }

      return {
        success: true,
        products: uniqueProducts
      };

    } catch (error) {
      throw error;
    }
  }

  // Batch analysis for multiple images
  async analyzeImagesBatch(imagePaths: string[]): Promise<AIAnalysisResult[]> {
    const batchStart = Date.now();
    console.log(`🚀 Starting batch analysis of ${imagePaths.length} images`);

    // Process images in parallel with concurrency limit
    const batchSize = Math.min(this.maxConcurrentRequests, imagePaths.length);
    const results: AIAnalysisResult[] = [];

    for (let i = 0; i < imagePaths.length; i += batchSize) {
      const batch = imagePaths.slice(i, i + batchSize);
      const batchPromises = batch.map(path => this.analyzeImage(path));

      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            products: [],
            error: result.reason?.message || 'Batch analysis failed',
            processingTime: 0
          });
        }
      }
    }

    const batchTime = Date.now() - batchStart;

    // Remove duplicates from batch results
    const deduplicatedResults = results.map(result => {
      if (result.success && result.products) {
        const uniqueProducts = this.removeDuplicateProducts(result.products);
        if (uniqueProducts.length !== result.products.length) {
          console.log(`🔄 Batch: Removed ${result.products.length - uniqueProducts.length} duplicates from image`);
        }
        return { ...result, products: uniqueProducts };
      }
      return result;
    });

    trackBatchAnalysis(batchTime, true, undefined, {
      imageCount: imagePaths.length,
      successfulAnalyses: deduplicatedResults.filter(r => r.success).length
    });

    console.log(`✅ Batch analysis completed for ${imagePaths.length} images in ${batchTime}ms`);
    return deduplicatedResults;
  }

  // Helper method to extract brand from product name
  extractBrand(productName: string): string {
    if (productName === 'unrecognized') return '';

    // Common brand patterns
    const brandPatterns = [
      /^([A-Z][a-z]+)/, // First word starting with capital
      /^([A-Z]+)/, // All caps brand names
      /^([A-Z][a-z]+ [A-Z][a-z]+)/, // Two word brands
    ];

    for (const pattern of brandPatterns) {
      const match = productName.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // Fallback: return first word
    return productName.split(' ')[0] || '';
  }

  // Helper method to determine if product is recognized
  isRecognized(productName: string): boolean {
    return productName !== 'unrecognized' && productName.trim().length > 0;
  }

  // Clear cache (useful for testing or memory management)
  clearCache(): void {
    analysisCache.clear();
    console.log('🧹 AI analysis cache cleared');
  }

  // Get cache statistics
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: analysisCache.size,
      hitRate: 0 // Could be implemented with hit tracking
    };
  }

  // Public method to deduplicate products (can be called externally)
  deduplicateProducts(products: ProductDetection[]): ProductDetection[] {
    return this.removeDuplicateProducts(products);
  }

  // Simple product and price logging
  private logProductPrices(products: ProductDetection[], imagePath: string): void {
    console.log(`📦 Product Analysis for ${products.length} products in ${imagePath}`);
    console.log(`💰 Looking for BOTTOM prices (not top prices) for each product`);

    let totalProducts = 0;
    let productsWithPrices = 0;

    products.forEach(product => {
      totalProducts++;

      if (product.price) {
        productsWithPrices++;
        console.log(`✅ ${product.product_name} - BOTTOM price: ${product.price} (${product.confirmed_faces} units)`);
      } else {
        console.log(`⚠️ ${product.product_name} - No BOTTOM price found (${product.confirmed_faces} units)`);
      }
    });

    // Summary logging
    console.log(`📊 Product Summary:`);
    console.log(`   Total Products: ${totalProducts}`);
    console.log(`   Products with BOTTOM Prices: ${productsWithPrices}`);
    console.log(`   Price Coverage: ${Math.round((productsWithPrices / totalProducts) * 100)}%`);
  }

  // Remove duplicate products based on product name only (not price)
  private removeDuplicateProducts(products: ProductDetection[]): ProductDetection[] {
    const seen = new Map<string, ProductDetection>();

    for (const product of products) {
      // Create a unique key based on product name only (case-insensitive)
      const key = product.product_name.toLowerCase().trim();

      if (!seen.has(key)) {
        // First time seeing this product, add it
        seen.set(key, product);
      } else {
        // Duplicate found, merge facings and keep best price info
        const existing = seen.get(key)!;

        // Merge facings
        existing.confirmed_faces += product.confirmed_faces;

        // Keep the best price information
        if (product.price && !existing.price) {
          existing.price = product.price;
          console.log(`🔄 Updated price for ${product.product_name}: ${product.price}`);
        } else if (product.price && existing.price && product.price !== existing.price) {
          // If both have prices but different, keep the one with more facings
          if (product.confirmed_faces > existing.confirmed_faces) {
            existing.price = product.price;
            console.log(`🔄 Updated price for ${product.product_name}: ${product.price} (higher facings)`);
          }
        }

        console.log(`🔄 Merged duplicate: ${product.product_name} - combined facings: ${existing.confirmed_faces}`);
      }
    }

    return Array.from(seen.values());
  }
} 