import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { executeQuery } from '@/lib/database';
import { AIAnalysisService } from '@/lib/ai-analysis';
import { ProductosService } from '@/lib/productos';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/bmp', 'image/tiff'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, BMP, and TIFF are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}_${randomString}_${originalName}`;
    const filePath = join(uploadsDir, fileName);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save original image without compression for better AI analysis
    await writeFile(filePath, buffer);

    // Return the URL
    const imageUrl = `/uploads/${fileName}`;

    // Get user ID from the request (you might need to implement proper authentication)
    const userId = formData.get('userId') as string;
    
    let uploadId: number | null = null;
    
    if (userId) {
      // Store upload information in database
      const insertQuery = `
        INSERT INTO user_uploads (user_id, filename, url, uploaded_at, size, original_size) 
        VALUES (?, ?, ?, NOW(), ?, ?)
      `;
      
      const result = await executeQuery(insertQuery, [
        userId,
        fileName,
        imageUrl,
        buffer.length,
        file.size
      ]);
      
      uploadId = (result as any).insertId;
    }

    // Trigger AI analysis asynchronously (don't wait for it)
    if (uploadId) {
      console.log('🚀 Starting AI analysis for upload ID:', uploadId);
      
      // Use setImmediate to run AI analysis asynchronously
      setImmediate(async () => {
        try {
          console.log('⏳ AI analysis process started for upload:', uploadId);
          
          // Minimal delay to prevent rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('⏱️ Delay completed, proceeding with analysis');
          
          // Check if OpenAI API key is available
          if (!process.env.OPENAI_API_KEY) {
            console.error('❌ OPENAI_API_KEY environment variable is not set!');
            return;
          }
          
          console.log('✅ OpenAI API key found, length:', process.env.OPENAI_API_KEY.length);
          
          // Initialize AI services
          const aiService = new AIAnalysisService();
          const productosService = new ProductosService();
          console.log('🔧 AI services initialized');
          
          // Analyze the image
          console.log('📸 Starting image analysis for file:', filePath);
          const analysisResult = await aiService.analyzeImage(filePath);
          console.log('📊 AI analysis result:', analysisResult);
          
          if (analysisResult.success && analysisResult.products.length > 0) {
            console.log('✅ AI analysis successful, found', analysisResult.products.length, 'products');
            
                         // Transform AI results to database format (optimized)
             const productosToInsert = analysisResult.products.map(product => ({
               nombre: product.product_name,
               marca: aiService.extractBrand(product.product_name),
               facing: product.confirmed_faces,
               precio_detectado: product.price || undefined,
               es_reconocido: aiService.isRecognized(product.product_name),
               confidence: 0.95,
               bounding_box: undefined
             }));
             
             console.log('🔄 Transformed products for database:', productosToInsert);
             
             // Insert detected products into database (parallel processing)
             const insertPromise = productosService.insertProductosDetectados(uploadId, productosToInsert);
             const insertedIds = await insertPromise;
             console.log('💾 Products inserted into database, IDs:', insertedIds);
            
          } else {
            console.log('❌ AI analysis failed or no products found:', analysisResult.error || 'No products detected');
            
            // Insert a placeholder record to show the analysis was attempted
            if (analysisResult.error) {
              try {
                await productosService.insertProductosDetectados(uploadId, [{
                  nombre: 'Análisis fallido',
                  marca: '',
                  facing: 0,
                  precio_detectado: undefined,
                  es_reconocido: false,
                  confidence: 0,
                  bounding_box: undefined
                }]);
                console.log('📝 Inserted failure placeholder record');
  
              } catch (dbError) {
                console.error('❌ Failed to insert error placeholder:', dbError);
              }
            }
          }
          
        } catch (error) {
          console.error(`❌ AI analysis error for upload ${uploadId}:`, error);
          
          // Try to insert an error record
          try {
            const productosService = new ProductosService();
            await productosService.insertProductosDetectados(uploadId, [{
              nombre: 'Error en análisis',
              marca: '',
              facing: 0,
              precio_detectado: undefined,
              es_reconocido: false,
              confidence: 0,
              bounding_box: undefined
            }]);
            console.log('📝 Inserted error record after exception');
            
          } catch (dbError) {
            console.error('❌ Failed to insert error record after exception:', dbError);
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: fileName,
      size: buffer.length,
      originalSize: file.size,
      uploadId: uploadId,
      aiAnalysisTriggered: !!uploadId,
      message: uploadId ? "Image uploaded and AI analysis started" : "Image uploaded successfully"
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    // Check if user has permission to delete (admin or manager only)
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and managers can delete images.' },
        { status: 403 }
      );
    }

    if (!imageId || !userId) {
      return NextResponse.json(
        { error: 'Image ID and user ID are required' },
        { status: 400 }
      );
    }

    // Get image information from database
    const imageQuery = 'SELECT * FROM user_uploads WHERE id = ? AND user_id = ?';
    const images = await executeQuery(imageQuery, [imageId, userId]) as any[];
    
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Image not found or access denied' },
        { status: 404 }
      );
    }

    const image = images[0];
    const filePath = join(process.cwd(), 'public', image.url);

    // Delete detected products first (due to foreign key constraint)
    try {
      const productosService = new ProductosService();
      await productosService.deleteProductosByFotoId(parseInt(imageId));
      
    } catch (error) {
      console.error(`Error deleting productos for image ${imageId}:`, error);
    }

    // Delete the image record from database
    const deleteQuery = 'DELETE FROM user_uploads WHERE id = ? AND user_id = ?';
    await executeQuery(deleteQuery, [imageId, userId]);
    

    // Delete the physical file
    try {
      await unlink(filePath);
      
    } catch (error) {
      console.error(`Error deleting physical file ${filePath}:`, error);
      // Don't fail the request if file deletion fails
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      deletedImageId: imageId
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
} 