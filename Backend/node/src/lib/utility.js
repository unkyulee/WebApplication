const obj = require("object-path");
const jwt = require("jsonwebtoken");

module.exports = {
  match: function (str, rule) {
    // "."  => Find a single character, except newline or line terminator
    // ".*" => Matches any string that contains zero or more characters
    rule = rule.split("*").join(".*");

    // "^"  => Matches any string with the following at the beginning of it
    // "$"  => Matches any string with that in front at the end of it
    rule = "^" + rule + "$";

    //Create a regular expression object for matching string
    var regex = new RegExp(rule);

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(str);
  },

  // escape regular expression
  escapeRegExp: function (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
  },

  getProtocol(req) {
    var proto = req.connection.encrypted ? "https" : "http";
    // only do this if you trust the proxy
    proto = req.headers["x-forwarded-proto"] || proto;
    return proto.split(/\s*,\s*/)[0];
  },

  timeout(ms) {
    return new Promise((res) => setTimeout(res, ms));
  },

  replace(value, pattern, replacement) {
    if (!value) return;
    return value.replace(new RegExp(pattern, "g"), replacement);
  },

  // create JWT token
  createToken({
    secret,
    issuer,
    subject,
    audience,
    expiresIn,
    id,
    name,
    groups,
  }) {
    var signOptions = {
      issuer,
      subject,
      audience,
      expiresIn,
    };
    var payload = {
      unique_name: id,
      nameid: name,
      groups,
    };
    // create token
    return jwt.sign(payload, secret, signOptions);
  },
};
