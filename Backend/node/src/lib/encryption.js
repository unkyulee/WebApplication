const Crypto = require("crypto")

class Encryption {
    constructor(password) {
        this.password = password
    }

    encrypt(data) {
        try {
            var cipher = Crypto.createCipher('aes-256-cbc', this.password);
            var encrypted = Buffer.concat([cipher.update(new Buffer(data, "utf8")), cipher.final()]);
            return encrypted.toString('base64')
        } catch (exception) {
            throw new Error(exception.message);
        }
    }


    decrypt(data) {
        try {
            var decipher = Crypto.createDecipher("aes-256-cbc", this.password);
            var decrypted = Buffer.concat([decipher.update(Buffer.from(data, 'base64')), decipher.final()]);
            return decrypted.toString();
        } catch (exception) {
            throw new Error(exception.message);
        }
    }

}

module.exports = Encryption