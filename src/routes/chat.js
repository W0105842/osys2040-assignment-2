const express = require('express')
const createError = require('http-errors')
const Chat = require('../model/chat')
const Like = require('../model/like')
const router = express.Router()

// Load all messages [GET localhost:8000/chat]
router.get('/chat', async function loadMessages(req, res, next) {
  const messages = await Chat.getMessages();
  const likes = await Like.getLikes();
  let iLikeThis = true;
  res.render('messages', {messages, likes, iLikeThis})
})

// User likes a message [POST localhost:8000/chat/{id}/like]
router.post('/chat/:messageId/like', async function userLikes(req, res, next) {
  if(!res.locals.signedInAs) return next(createError(401));
  if(req.body.like) await Like.addLike(res.locals.signedInAs, req.params.messageId);
  else if(!req.body.like) await Like.unLike(res.locals.signedInAs, req.params.messageId);
  res.redirect('/chat')
})

// User leaves a message [POST localhost:8000/chat/create-message]
router.post('/chat/create-message', async function createMessage(req, res, next) {
  if(!res.locals.signedInAs) return next(createError(401));
  if(!req.body.message) return next(createError(400, 'Missing message!'));
  await Chat.createMessage(res.locals.signedInAs, req.body.message);
  res.redirect('/chat');
})

module.exports = router