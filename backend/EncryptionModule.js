'use strict';
const crypto = require('crypto');
const algorithm = 'aes192';
const randomString = require('randomstring');


class EncryptionModule {
  constructor() {
    this.lengthOfPasscode = 5;
    this.storage = {};
    this.generateUnixTime = date => Math.floor(date / 1000);
  }

  generateNewPasscode(response) {
    response.status(200).json({
      passcode: randomString.generate(this.lengthOfPasscode),
    });
  }

  addToStorage(passcode, sender, expiration, whenGenerated) {
    this.storage[passcode] = {
      sender,
      whenGenerated,
      expiration,
    };
  }

  encrypt(response, text, passcode, sender, time) {
    const serverTime = this.generateUnixTime(new Date());
    // time = typeof time !== Number ? Infinity : time;
    if (typeof time !== 'Number') {
      time = Infinity;
    }

    if (this.storage[passcode]) {
      response.status(400).json({
        message: 'Generate a new Passcode & type a new message!',
        name: '',
      });
    } else {
      const toEncrypt = crypto.createCipher(algorithm, passcode);
      let finished = toEncrypt.update(text, 'utf8', 'hex');
      finished += toEncrypt.final('hex');

      this.addToStorage(passcode, sender, time, serverTime);

      response.status(200).json({
        message: finished,
      });
    }
  }

  decrypt(response, text, passcode) {
    const serverTime = this.generateUnixTime(new Date());

    if (this.storage[passcode]) {
      if (this.storage[passcode].expiration > serverTime) {
        const toDecrypt = crypto.createDecipher(algorithm, passcode);
        let decrypted = toDecrypt.update(text, 'hex', 'utf8');
        decrypted += toDecrypt.final('utf8');

        response.status(200).json({
          message: decrypted,
          sender: this.storage[passcode].sender,
        });
      } else {
        response.status(400).json({
          message: 'Please type a new message & Generate a new Passcode!',
        });
      }
    }
  }
}

module.exports = new EncryptionModule();
