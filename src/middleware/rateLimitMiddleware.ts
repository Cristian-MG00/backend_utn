import rateLimit from "express-rate-limit";

// la funcion necesita un objeto de configuraciones
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //esto equivale a 15 min en mls. Para que el usuario pueda volver a registrarse,
  max: 5000, // cantidad de peticiones que podrá hacer antes de la espera,
  handler: (req, res, next, options) => {
    res.status(429).json({
      succes: false,
      error: `Limite alcanzado ${options.max} solicitudes cada ${
        options.windowMs / 1000 / 60
      } minutos.`,
    });
  },
});

export default limiter;
