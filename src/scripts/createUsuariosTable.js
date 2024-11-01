const { pool } = require('../config/database.js');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimizar búsquedas
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente updated_at
CREATE OR REPLACE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
`;

async function createUsuariosTable() {
  try {
    await pool.query(createTableQuery);
    console.log('✅ Tabla usuarios creada exitosamente');
    
    // Verificar la creación
    const tableExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'usuarios'
      );
    `);
    
    if (tableExists.rows[0].exists) {
      console.log('✅ Verificación: La tabla usuarios existe');
    }
    
  } catch (err) {
    console.error('❌ Error al crear la tabla:', err);
  } finally {
    await pool.end();
  }
}

createUsuariosTable();