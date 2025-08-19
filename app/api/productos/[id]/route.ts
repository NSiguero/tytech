import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    // Check if user has permission to delete (admin or manager only)
    if (userRole !== 'admin' && userRole !== 'manager') {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and managers can delete products.' },
        { status: 403 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const productoId = parseInt(params.id);
    if (isNaN(productoId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if the product exists and belongs to the user
    const checkQuery = `
      SELECT p.*, u.user_id 
      FROM productos_detectados p 
      JOIN user_uploads u ON p.foto_id = u.id 
      WHERE p.id = ? AND u.user_id = ?
    `;
    const productos = await executeQuery(checkQuery, [productoId, userId]) as any[];
    
    if (productos.length === 0) {
      return NextResponse.json(
        { error: 'Product not found or access denied' },
        { status: 404 }
      );
    }

    // Delete the product
    const deleteQuery = 'DELETE FROM productos_detectados WHERE id = ?';
    await executeQuery(deleteQuery, [productoId]);
    
    console.log(`Deleted producto ${productoId} from database`);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProductoId: productoId
    });

  } catch (error) {
    console.error('Delete producto error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 