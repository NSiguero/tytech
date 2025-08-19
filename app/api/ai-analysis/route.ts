import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { AIAnalysisService } from '@/lib/ai-analysis';
import { ProductosService } from '@/lib/productos';
import { executeQuery } from '@/lib/database';

// Deduplication function for database products
function deduplicateProductosForDB(productos: any[]): any[] {
  const seen = new Map<string, any>();
  
  for (const producto of productos) {
    const key = producto.nombre.toLowerCase().trim();
    
    if (!seen.has(key)) {
      seen.set(key, producto);
    } else {
      const existing = seen.get(key)!;
      // Merge facings
      existing.facing += producto.facing;
      // Keep the best price information
      if (producto.precio_detectado && !existing.precio_detectado) {
        existing.precio_detectado = producto.precio_detectado;
      }
      console.log(`🔄 DB Dedup: Merged ${producto.nombre} - total facings: ${existing.facing}`);
    }
  }
  
  return Array.from(seen.values());
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fotoId, fotoIds } = body;

    // Support both single and batch analysis
    if (fotoIds && Array.isArray(fotoIds)) {
      return await handleBatchAnalysis(fotoIds);
    }

    if (!fotoId) {
      return NextResponse.json(
        { error: 'fotoId is required for single analysis, or fotoIds array for batch analysis' },
        { status: 400 }
      );
    }

    return await handleSingleAnalysis(fotoId);

  } catch (error) {
    console.error('AI analysis API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleSingleAnalysis(fotoId: number) {
  const startTime = Date.now();
  
  try {
    // Get the uploaded file information
    const fotoQuery = 'SELECT * FROM user_uploads WHERE id = ?';
    const fotos = await executeQuery(fotoQuery, [fotoId]);
    
    if (fotos.length === 0) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      );
    }

    const foto = fotos[0];
    const imagePath = join(process.cwd(), 'public', foto.url);

    // Initialize services
    const aiService = new AIAnalysisService();
    const productosService = new ProductosService();

    // Analyze the image
    const analysisResult = await aiService.analyzeImage(imagePath);

    if (!analysisResult.success) {
      return NextResponse.json(
        { 
          error: analysisResult.error || 'AI analysis failed',
          processingTime: analysisResult.processingTime
        },
        { status: 500 }
      );
    }

              // Transform AI results to database format
     const productosToInsert = analysisResult.products.map(product => ({
       nombre: product.product_name,
       marca: aiService.extractBrand(product.product_name),
       facing: product.confirmed_faces,
       precio_detectado: product.price,
       es_reconocido: aiService.isRecognized(product.product_name),
       confidence: 0.95, // Default confidence for now
       bounding_box: null // Not provided by current AI response
     }));

     // Apply final deduplication before database insertion
     const uniqueProductos = deduplicateProductosForDB(productosToInsert);
     if (uniqueProductos.length !== productosToInsert.length) {
       console.log(`🔄 API: Removed ${productosToInsert.length - uniqueProductos.length} duplicates before DB insertion`);
     }

     // Insert detected products into database
     const insertedIds = await productosService.insertProductosDetectados(fotoId, uniqueProductos);

    // Get the inserted products for response
    const insertedProductos = await productosService.getProductosByFotoId(fotoId);

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Analysis completed in ${totalTime}ms. ${insertedProductos.length} products detected.`,
      products: insertedProductos,
      analysisStats: {
        totalDetected: insertedProductos.length,
        recognized: insertedProductos.filter(p => p.es_reconocido).length,
        unrecognized: insertedProductos.filter(p => !p.es_reconocido).length,
        processingTime: totalTime,
        aiProcessingTime: analysisResult.processingTime
      }
    });

  } catch (error) {
    console.error('Single analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleBatchAnalysis(fotoIds: number[]) {
  const startTime = Date.now();
  
  try {
    if (fotoIds.length === 0) {
      return NextResponse.json(
        { error: 'fotoIds array cannot be empty' },
        { status: 400 }
      );
    }

    if (fotoIds.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images can be analyzed in a single batch' },
        { status: 400 }
      );
    }

    // Get all uploaded files information
    const placeholders = fotoIds.map(() => '?').join(',');
    const fotoQuery = `SELECT * FROM user_uploads WHERE id IN (${placeholders})`;
    const fotos = await executeQuery(fotoQuery, fotoIds);
    
    if (fotos.length === 0) {
      return NextResponse.json(
        { error: 'No photos found' },
        { status: 404 }
      );
    }

    if (fotos.length !== fotoIds.length) {
      return NextResponse.json(
        { error: `Only ${fotos.length} out of ${fotoIds.length} photos were found` },
        { status: 404 }
      );
    }

    // Initialize services
    const aiService = new AIAnalysisService();
    const productosService = new ProductosService();

    // Prepare image paths
    const imagePaths = fotos.map(foto => join(process.cwd(), 'public', foto.url));

    // Analyze all images in batch
    const analysisResults = await aiService.analyzeImagesBatch(imagePaths);

    // Process results and insert into database
    const batchResults = [];
    let totalProducts = 0;
    let totalRecognized = 0;
    let totalUnrecognized = 0;

    for (let i = 0; i < fotos.length; i++) {
      const foto = fotos[i];
      const analysisResult = analysisResults[i];

      if (analysisResult.success) {
                 // Transform AI results to database format
         const productosToInsert = analysisResult.products.map(product => ({
           nombre: product.product_name,
           marca: aiService.extractBrand(product.product_name),
           facing: product.confirmed_faces,
           precio_detectado: product.price,
           es_reconocido: aiService.isRecognized(product.product_name),
           confidence: 0.95,
           bounding_box: null
         }));

        // Insert detected products into database
        await productosService.insertProductosDetectados(foto.id, productosToInsert);

        // Get the inserted products
        const insertedProductos = await productosService.getProductosByFotoId(foto.id);

        const recognized = insertedProductos.filter(p => p.es_reconocido).length;
        const unrecognized = insertedProductos.filter(p => !p.es_reconocido).length;

        totalProducts += insertedProductos.length;
        totalRecognized += recognized;
        totalUnrecognized += unrecognized;

        batchResults.push({
          fotoId: foto.id,
          success: true,
          products: insertedProductos,
          stats: {
            totalDetected: insertedProductos.length,
            recognized,
            unrecognized,
            processingTime: analysisResult.processingTime
          }
        });
      } else {
        batchResults.push({
          fotoId: foto.id,
          success: false,
          error: analysisResult.error,
          processingTime: analysisResult.processingTime
        });
      }
    }

    const totalTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      message: `Batch analysis completed in ${totalTime}ms. ${totalProducts} total products detected across ${fotos.length} images.`,
      results: batchResults,
      batchStats: {
        totalImages: fotos.length,
        successfulAnalyses: batchResults.filter(r => r.success).length,
        failedAnalyses: batchResults.filter(r => !r.success).length,
        totalProducts,
        totalRecognized,
        totalUnrecognized,
        totalProcessingTime: totalTime
      }
    });

  } catch (error) {
    console.error('Batch analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const fotoId = url.searchParams.get('fotoId');
    const userId = url.searchParams.get('userId');
    const includeStats = url.searchParams.get('stats') === 'true';

    if (!fotoId && !userId) {
      return NextResponse.json(
        { error: 'Either fotoId or userId is required' },
        { status: 400 }
      );
    }

    const productosService = new ProductosService();

    if (fotoId) {
      // Get products for a specific photo
      const productos = await productosService.getProductosByFotoId(parseInt(fotoId));
      
      const response: any = {
        success: true,
        products: productos
      };

      if (includeStats) {
        response.stats = {
          totalDetected: productos.length,
          recognized: productos.filter(p => p.es_reconocido).length,
          unrecognized: productos.filter(p => !p.es_reconocido).length
        };
      }

      return NextResponse.json(response);
    } else if (userId) {
      // Get all products for a user
      const productos = await productosService.getProductosByUserId(parseInt(userId));
      const stats = await productosService.getProductosStats(parseInt(userId));
      
      return NextResponse.json({
        success: true,
        products: productos,
        stats: stats
      });
    }

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 