var crypto = require('crypto')

/**
 * hash password with sha512.
 * @function
 * @param {string} password
 * @param {string} salt
 */
module.exports.hash = function(password, salt){
    var hash = crypto.createHmac('sha512', salt ? salt : ''); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};
