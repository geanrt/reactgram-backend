/* eslint-disable no-undef */
const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRETE;

const mongoose = require("mongoose");

//genrete user token
const generateToken = (id) => {
  return jwt.sign({id}, jwtSecret, {
    expiresIn: "7d",
  });
};

// register and singin user

const register = async (req, res) => {
  // dados enviados pelo usuario
  const {name, email, password} = req.body;

  const user = await User.findOne({email});

  // verifica se usuario já existe
  if (user) {
    res.status(422).json({errors: ["Por favor, utilize outro email"]});
    return;
  }

  // encripta a senha do usuario
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // cria o usuario
  // #registro
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // se usuario foi criado, retorna um token
  if (!newUser) {
    res
      .status(422)
      .json({errors: ["Houve um erro, por favor tente mais tarde."]});
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// #sing in user
const login = async (req, res) => {
  // dados enviados pelo usuario
  const {email, password} = req.body;

  const user = await User.findOne({email});

  // verifica se dados existem
  if (!user) {
    res.status(404).json({errors: ["Usuário não encontrado."]});
    return;
  }
  // verifica se senhas são iguais
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({errors: ["Senha incorreta."]});
    return;
  }

  // tudo deu certo
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};
// recupera dados presentes
const getCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};

// atualiza o usuario
const update = async (req, res) => {
  const {name, password, bio} = req.body;

  let profileImage = null;

  if (req.file) {
    profileImage = req.file.filename;
  }
  const reqUser = req.user;

  const user = await User.findById(
    new mongoose.Types.ObjectId(reqUser._id)
  ).select("-password");

  if (name) {
    user.name = name;
  }
  if (password) {
    // encripta a senha do usuario
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    user.password = passwordHash;
  }
  if (profileImage) {
    user.profileImage = profileImage;
  }
  if (bio) {
    user.bio = bio;
  }

  await user.save();

  // CASO NÃO TENHA ERROS ENVIA:
  // NEWPHOTO - COM OS DADOS ATUALIZADO PARA EFEITOS PRATICOS NO SLICE
  // ISVALID:  0 - PARA ZERAR O PROCESSO
  // MESSAGE:  COM A MENSAGEM PARA EFEITOS PRATICOS NO SLICE

  res
    .status(200)
    .json({data: user, isValid: 0, message: "Usuario editado com sucesso!"});
};

//Capturando usuario por id
const getUserById = async (req, res) => {
  const {id} = req.params;
  try {
    const user = await User.findById(id).select(
      "-password -email"
    );

    if (!user) {
      res.status(404).json({errors: ["Usuário não encontrado!"]});
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({errors: ["Usuário não encontrado!"]});
    return;
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
