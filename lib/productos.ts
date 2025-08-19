import { executeQuery } from './database';

export interface ProductoDetectado {
  id?: number;
  foto_id: number;
  producto_id?: string;
  nombre: string;
  marca?: string;
  facing: number;
  precio_detectado?: string;
  es_reconocido: boolean;
  confidence?: number;
  bounding_box?: any;
  created_at?: Date;
}

export class ProductosService {
  /**
   * Insert multiple detected products for a single photo
   */
  async insertProductosDetectados(fotoId: number, productos: Omit<ProductoDetectado, 'foto_id' | 'id' | 'created_at'>[]): Promise<number[]> {
    if (productos.length === 0) {
      return [];
    }

    const values = productos.map(producto => [
      fotoId,
      producto.producto_id || null,
      producto.nombre,
      producto.marca || null,
      producto.facing,
      producto.precio_detectado || null,
      producto.es_reconocido,
      producto.confidence || null,
      producto.bounding_box ? JSON.stringify(producto.bounding_box) : null
    ]);

    const placeholders = productos.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');

    const query = `
      INSERT INTO productos_detectados 
      (foto_id, producto_id, nombre, marca, facing, precio_detectado, es_reconocido, confidence, bounding_box)
      VALUES ${placeholders}
    `;

    const flatValues = values.flat();
    const result = await executeQuery(query, flatValues);
    
    // Return the inserted IDs
    const insertedIds: number[] = [];
    for (let i = 0; i < productos.length; i++) {
      insertedIds.push(result.insertId + i);
    }
    
    return insertedIds;
  }

  /**
   * Get all detected products for a specific photo
   */
  async getProductosByFotoId(fotoId: number): Promise<ProductoDetectado[]> {
    const query = `
      SELECT id, foto_id, producto_id, nombre, marca, facing, precio_detectado, 
             es_reconocido, confidence, bounding_box, created_at
      FROM productos_detectados 
      WHERE foto_id = ?
      ORDER BY created_at ASC
    `;

    const results = await executeQuery(query, [fotoId]);
    return results.map((row: any) => ({
      ...row,
      bounding_box: row.bounding_box ? JSON.parse(row.bounding_box) : null,
      created_at: new Date(row.created_at)
    }));
  }

  /**
   * Get all detected products for a user
   */
  async getProductosByUserId(userId: number): Promise<ProductoDetectado[]> {
    const query = `
      SELECT pd.id, pd.foto_id, pd.producto_id, pd.nombre, pd.marca, pd.facing, 
             pd.precio_detectado, pd.es_reconocido, pd.confidence, pd.bounding_box, 
             pd.created_at, uu.filename, uu.url
      FROM productos_detectados pd
      JOIN user_uploads uu ON pd.foto_id = uu.id
      WHERE uu.user_id = ?
      ORDER BY pd.created_at DESC
    `;

    const results = await executeQuery(query, [userId]);
    return results.map((row: any) => ({
      id: row.id,
      foto_id: row.foto_id,
      producto_id: row.producto_id,
      nombre: row.nombre,
      marca: row.marca,
      facing: row.facing,
      precio_detectado: row.precio_detectado,
      es_reconocido: row.es_reconocido,
      confidence: row.confidence,
      bounding_box: row.bounding_box ? JSON.parse(row.bounding_box) : null,
      created_at: new Date(row.created_at),
      filename: row.filename,
      url: row.url
    }));
  }

  /**
   * Get statistics for detected products
   */
  async getProductosStats(userId: number): Promise<{
    totalProductos: number;
    productosReconocidos: number;
    productosNoReconocidos: number;
    marcasUnicas: number;
    precioPromedio: number;
  }> {
    const query = `
      SELECT 
        COUNT(*) as total_productos,
        SUM(CASE WHEN es_reconocido = 1 THEN 1 ELSE 0 END) as productos_reconocidos,
        SUM(CASE WHEN es_reconocido = 0 THEN 1 ELSE 0 END) as productos_no_reconocidos,
        COUNT(DISTINCT marca) as marcas_unicas,
        AVG(CAST(REPLACE(REPLACE(precio_detectado, '€', ''), ',', '.') AS DECIMAL(10,2))) as precio_promedio
      FROM productos_detectados pd
      JOIN user_uploads uu ON pd.foto_id = uu.id
      WHERE uu.user_id = ?
    `;

    const result = await executeQuery(query, [userId]);
    const stats = result[0];

    return {
      totalProductos: stats.total_productos || 0,
      productosReconocidos: stats.productos_reconocidos || 0,
      productosNoReconocidos: stats.productos_no_reconocidos || 0,
      marcasUnicas: stats.marcas_unicas || 0,
      precioPromedio: stats.precio_promedio || 0
    };
  }

  /**
   * Delete all detected products for a specific photo
   */
  async deleteProductosByFotoId(fotoId: number): Promise<void> {
    const query = 'DELETE FROM productos_detectados WHERE foto_id = ?';
    await executeQuery(query, [fotoId]);
  }

  /**
   * Update a specific detected product
   */
  async updateProductoDetectado(id: number, updates: Partial<ProductoDetectado>): Promise<void> {
    const allowedFields = ['nombre', 'marca', 'facing', 'precio_detectado', 'es_reconocido', 'confidence', 'bounding_box'];
    const updateFields = Object.keys(updates).filter(key => allowedFields.includes(key));
    
    if (updateFields.length === 0) {
      return;
    }

    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    const values = updateFields.map(field => {
      const value = (updates as any)[field];
      return field === 'bounding_box' && value ? JSON.stringify(value) : value;
    });

    const query = `UPDATE productos_detectados SET ${setClause} WHERE id = ?`;
    await executeQuery(query, [...values, id]);
  }
} 