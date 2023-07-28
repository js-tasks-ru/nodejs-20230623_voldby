const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('../config');

//mongoose.plugin(beautifyUnique);

console.log("DB uri: "+config.mongodb.uri);
module.exports = mongoose.createConnection(config.mongodb.uri);
