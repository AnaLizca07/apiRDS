const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    
    // Validar que todos los campos necesarios estén presentes
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        mensaje: 'Nombre, email y password son requeridos' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usuario = await Usuario.crear({
      nombre,
      email,
      password: hashedPassword
    });

    res.status(201).json({ 
      mensaje: 'Usuario creado exitosamente',
      id: usuario.id 
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Si el error es por email duplicado
    if (error.code === '23505') { // Código PostgreSQL para violación de unicidad
      return res.status(400).json({ 
        mensaje: 'El email ya está registrado' 
      });
    }
    res.status(500).json({ mensaje: 'Error al crear usuario' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ 
        mensaje: 'Email y password son requeridos' 
      });
    }

    const user = await Usuario.login(email, password);

    if (!user) {
      return res.status(401).json({ 
        mensaje: 'Credenciales inválidas' 
      });
    }

    const token = jwt.sign(
      { id: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return res.json({ 
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error en el proceso de login:', error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};