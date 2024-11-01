const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  };
  
  module.exports = errorHandler;