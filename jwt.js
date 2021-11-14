const jwt = require("jsonwebtoken");

const jwtGenerator = async(id, key) => {
 const token = await jwt.sign({ id: id }, key);
 return token;
}

module.exports = jwtGenerator