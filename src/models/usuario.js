const { pool } = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async crear({ nombre, email, password }) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Verificar si el usuario ya existe
      const verificarUsuario = await client.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );

      if (verificarUsuario.rows.length > 0) {
        throw new Error('El usuario ya existe');
      }

      // Insertar el nuevo usuario
      const resultado = await client.query(
        'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email',
        [nombre, email, password]
      );

      await client.query('COMMIT');
      return resultado.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async obtenerPorId(id) {
    try {
      const resultado = await pool.query(
        'SELECT id, nombre, email FROM usuarios WHERE id = $1',
        [id]
      );
      return resultado.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async obtenerPorEmail(email) {
    try {
      const resultado = await pool.query(
        'SELECT * FROM usuarios WHERE email = $1',
        [email]
      );
      return resultado.rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const usuario = await this.obtenerPorEmail(email);
      
      if (!usuario) {
        return null;
      }

      const passwordValida = await bcrypt.compare(password, usuario.password);
      
      if (!passwordValida) {
        return null;
      }

      return {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Usuario;