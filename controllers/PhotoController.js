/* eslint-disable no-undef */
const Photo = require("../models/Photo");
const mongoose = require("mongoose");
const User = require("../models/User");

// inserindo imagem do post do usuario
const insertPhoto = async (req, res) => {
  const {title} = req.body;
  const image = req.file.filename;

  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  // criando o Post
  const postedTime = new Date();

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    creationDate: {
      postedYear: postedTime.getFullYear(),
      postedMonth: postedTime.getMonth() + 1,
      postedDay: postedTime.getDate(),
      postedHours: postedTime.getHours(),
    },
  });

  if (!newPhoto) {
    res.status(422).json("Houve um problema, tente novamente mais tarde!");
  }

  // CASO NÃO TENHA ERROS ENVIA:
  // NEWPHOTO - COM OS DADOS DO NOVO POST PARA EFEITOS PRATICOS NO SLICE
  // ISVALID:  0 - PARA ZERAR O PROCESSO
  // MESSAGE:  COM A MENSAGEM PARA EFEITOS PRATICOS NO SLICE

  res
    .status(201)
    .json({data: newPhoto, isValid: 0, message: "Post publicado com sucesso!"});
};

// deletando o Post
const deletePhoto = async (req, res) => {
  const {id} = req.params;
  const reqUser = req.user;
  try {
    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // se o post existe
    if (!photo) {
      res.status(404).json({errors: ["Foto não encontrada."]});
      return;
    }
    // checa se o post é do user autenticado
    if (!photo.userId.equals(reqUser._id)) {
      res
        .status(422)
        .json({errors: ["Ocorreu um erro, tente novamente mais tarde."]});
      return;
    }

    //   deleta caso passe de todas as verifições acima
    await Photo.findByIdAndDelete(photo._id);
    res.status(200).json({photo, message: "Foto excluída com sucesso."});
  } catch (error) {
    res.status(404).json({errors: ["Foto não encontrada."]});
    return;
  }
};

// pega todas as fotos
const getAllPhotos = async (req, res) => {
  try {
    const dataPhotos = await Photo.find({})
      .sort([["createdAt", -1]])
      .exec();

    const photos = [];
    for (const photoData of dataPhotos) {
      const photo = JSON.parse(JSON.stringify(photoData));
      const author = await User.findById(photoData.userId).select(
        "-password -email"
      );

      photo.userName = author.name;
      photo.userProfile = author.profileImage;

      photos.push(photo);
    }

    res.status(200).json(photos);
  } catch (error) {
    res
      .status(404)
      .json({errors: ["Houve um erro, tente novamente mais tarde."]});
    return;
  }
};

// pega todas as fotos de um usuario qualquer
const getUserPhotos = async (req, res) => {
  const {id} = req.params;

  try {
    const photos = await Photo.find({userId: id})
      .sort([["createdAt", -1]])
      .exec();

    res.status(200).json(photos);
  } catch (error) {
    res
      .status(404)
      .json({errors: ["Houve um erro, tente novamente mais tarde."]});
    return;
  }
};
// busca foto por id
const getPhotoByid = async (req, res) => {
  const {id} = req.params;
  try {
    const photoData = await Photo.findById(new mongoose.Types.ObjectId(id));
    const photo = JSON.parse(JSON.stringify(photoData));
    const author = await User.findById(photoData.userId).select(
      "-password -email"
    );

    photo.userName = author.name;
    photo.userProfile = author.profileImage;

    res.status(200).json(photo);
  } catch (error) {
    res.status(404).json({errors: ["Post não encontrado!"]});
    return;
  }
};

// atualizar o Post
const updatePhoto = async (req, res) => {
  const {id} = req.params;
  const {title} = req.body;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde!"],
      });
      return;
    }

    if (title) {
      photo.title = title;
    }
    await photo.save();

    res.status(200).json({photo, message: ["Foto atualizada com exito."]});
  } catch (error) {
    res.status(404).json({errors: ["Post não encontrado!"]});
  }
};

// curtindo o post
const likeThePhoto = async (req, res) => {
  const {id} = req.params;
  const userId = req.user._id;

  const savePhoto = async (photo, msg) => {
    await photo.save();
    res.status(200).json({photo, userId, message: [msg]});
  };

  try {
    const photo = await Photo.findById(id);

    // verifica se já tem o like do usuario, caso tenha ira remover e caso não tenha irá adicionar
    if (photo.likes.includes(userId)) {
      photo.likes = photo.likes.filter(
        (id) => id.valueOf() != userId.valueOf()
      );
      savePhoto(photo, "you disliked the photo");
    } else {
      photo.likes.push(userId);
      savePhoto(photo, "you liked the photo");
    }
  } catch (error) {
    res.status(404).json({errors: ["Post não encontrado ou houve um erro!"]});
  }
};

// comentando no post
const commentPhoto = async (req, res) => {
  const {id} = req.params;
  const reqUser = req.user;
  const {comment} = req.body;

  try {
    const photo = await Photo.findById(id);
    if (!comment) {
      return res
        .status(404)
        .json({errors: ["Houve um erro ao adicionar comentário!"]});
    }

    const newComment = {
      id: new mongoose.Types.ObjectId(),
      userId: reqUser._id,
      comment,
      creationDate: new Date(),
    };

    // adicionan o comentario no banco
    photo.comments.push(newComment);
    await photo.save();

    // para o frontend
    const user = await User.findById(reqUser._id).select(
      "-password -email -bio -_id -createdAt -updatedAt -__v"
    );

    const recentUserComment = {
      profile: user.profileImage,
      name: user.name,
      comment: comment,
      id: newComment.id,
      userId: newComment.userId,
      createdAt: newComment.createdAt,
    };

    // resposta da requisição
    res.status(200).json({
      recentUserComment,
      message: ["Comentário adicionado com sucesso."],
    });
  } catch (error) {
    res.status(404).json({errors: ["Post não encontrado ou houve um erro!"]});
    return;
  }
};

// deleta Comentario da foto/post
const deleteCommentPhoto = async (req, res) => {
  // parametros
  const {id, commentid} = req.params;
  const userId = req.user._id;
  try {
    const photo = await Photo.findById(id);
    const comment = await photo.comments.filter(
      (com) => com.id.valueOf() === commentid
    )[0];
    // verifica se o comentario existe
    if (!comment) {
      res.status(422).json({error: ["Comentario não encontrado."]});

      return;
    }

    // verifica se o user é dono do comentário
    if (!userId.equals(comment.userId)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde!"],
      });

      return;
    }

    // faz as alterações
    photo.comments = photo.comments.filter(
      (com) => com.id.valueOf() != commentid
    );
    await photo.save();

    res.status(200).json({message: ["Comentário deletado com sucesso."], commentid});
  } catch (error) {
    res.status(404).json({errors: ["Houve um erro, tente mais tarde!"]});
    return;
  }
};

// GET ALL COMMENTS USERS
const getComments = async (req, res) => {
  const {id} = req.params;
  try {
    const photo = await Photo.findById(id);
    const photoComments = await photo.comments;

    if (photo.comments.length === 0) {
      return res.status(200).json(null);
    }

    const comments = await Promise.all(
      photoComments.map(async (item) => {
        const user = await User.findById(item.userId);
        const userComment = {};

        userComment.userId = user._id;
        if (user.profileImage) {
          userComment.profile = user.profileImage;
        }
        userComment.name = user.name;
        userComment.comment = item.comment;
        userComment.id = item.id;

        return userComment;
      })
    );

    res.status(200).json(comments);
  } catch (error) {
    res.status(404).json({errors: ["Houve um erro, tente mais tarde!"]});
    return;
  }
};

// busca de posts
const searchPhotos = async (req, res) => {
  const {q} = req.query;

  const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoByid,
  updatePhoto,
  likeThePhoto,
  commentPhoto,
  deleteCommentPhoto,
  getComments,
  searchPhotos,
};
