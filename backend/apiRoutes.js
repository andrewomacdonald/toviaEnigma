const routes = require('express').Router();
const EncryptionModule = require('./EncryptionModule.js');

routes.get('/api/generatePasscode', (request, response) => {
  EncryptionModule.generateNewPasscode(response);
});

routes.post('/api/sendMessageAndCode', (request, response) => {
  const message = request.body.message;
  const passcode = request.body.passcode;
  const sender = request.body.sender;
  const time = request.body.time;
  EncryptionModule.encrypt(response, message, passcode, sender, time);
});

routes.post('/api/decipherMessageAndCode', (request, response) => {
  const message = request.body.message;
  const passcode = request.body.passcode;
  EncryptionModule.decrypt(response, message, passcode);
});


module.exports = routes;
