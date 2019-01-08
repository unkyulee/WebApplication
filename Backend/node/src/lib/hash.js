var crypto = require('crypto')

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
module.exports.hash = function(password, salt){
    var hash = crypto.createHmac('sha512', salt ? salt : ''); /** Hashing algorithm sha512 */
    hash.update(password);
    return hash.digest('hex');
};
