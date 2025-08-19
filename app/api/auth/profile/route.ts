import { NextRequest, NextResponse } from 'next/server';
import { executeQuery, executeQuerySingle } from '@/lib/database';
import { verifyToken, hashPassword, comparePassword } from '@/lib/auth';

// GET - Obtener perfil del usuario
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await executeQuerySingle(
      'SELECT id, username, email, first_name, last_name, role, avatar_url, is_active FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PUT - Actualizar perfil del usuario
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const { first_name, last_name, email, avatar_url } = body;

    // Validar campos requeridos
    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: 'Nombre, apellidos y email son requeridos' }, { status: 400 });
    }

    // Verificar si el email ya existe en otro usuario
    const existingUser = await executeQuerySingle(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, decoded.id]
    );

    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está en uso por otro usuario' }, { status: 409 });
    }

    // Actualizar perfil
    await executeQuery(
      'UPDATE users SET first_name = ?, last_name = ?, email = ?, avatar_url = ? WHERE id = ?',
      [first_name, last_name, email, avatar_url || null, decoded.id]
    );

    // Obtener usuario actualizado
    const updatedUser = await executeQuerySingle(
      'SELECT id, username, email, first_name, last_name, role, avatar_url, is_active FROM users WHERE id = ?',
      [decoded.id]
    );

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: 'Perfil actualizado correctamente' 
    });
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// PATCH - Cambiar contraseña
export async function PATCH(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Contraseña actual y nueva son requeridas' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'La nueva contraseña debe tener al menos 8 caracteres' }, { status: 400 });
    }

    // Obtener hash de la contraseña actual
    const user = await executeQuerySingle(
      'SELECT password_hash FROM users WHERE id = ?',
      [decoded.id]
    );

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar contraseña actual
    const isValidPassword = await comparePassword(currentPassword, (user as any).password_hash);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'La contraseña actual es incorrecta' }, { status: 400 });
    }

    // Hash de la nueva contraseña
    const newPasswordHash = await hashPassword(newPassword);

    // Actualizar contraseña
    await executeQuery(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, decoded.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Contraseña cambiada correctamente' 
    });
  } catch (error) {
    console.error('Error cambiando contraseña:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
