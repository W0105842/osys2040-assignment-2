const express = require('express')
const createError = require('http-errors')
const Chat = require('../model/chat')
const Like = require('../model/like')
const router = express.Router()

router.get('/chat', async function getMessages(req, res, next) {
  const messages = await Chat.getMessages();
  const likes = await Like.getLikes();
  const iLikeThis = true;
  console.log(messages, likes, iLikeThis);
  res.render('messages', {messages: messages, likes: likes, iLikeThis: iLikeThis})
})

router.post('/chat/:messageId/like', async function userLikes(req, res, next) {
  if(!res.locals.signedInAs) return next(createError(401));
  if(req.body.like) await Like.addLike(res.locals.signedInAs, {messageId: messageId});
  else if(!req.body.like) await Like.unLike(res.locals.signedInAs, {messageId: messageId});
  res.redirect('/chat')
})

router.post('/chat/create-message', async function createMessage(req, res, next) {
  if(!res.locals.signedInAs) return next(createError(401));
  if(!message) return next(createError(400, 'Missing message!'));
  await Chat.createMessage(res.locals.signedInAs, {message: req.body.message});
  res.redirect('/chat');
})

module.exports = router