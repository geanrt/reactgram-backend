/* eslint-disable no-undef */
const User      = require("../models/User");
const jwt       = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRETE;

// checando a autentecidade/autenticação do usuario
const authGuard = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  //   checa se o header tem um token
  if (!token) return res.status(401).json({errors: ["Acesso negado!"]});

  //   checa se o token é valido
  try {
    const verified = jwt.verify(token, jwtSecret)
    req.user = await User.findById(verified.id).select("-password")

    next()
  } catch (error) {
    res.status(401).json({errors: ["Token inválido!"]});
  }
};

module.exports = authGuard
