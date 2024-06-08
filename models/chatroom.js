const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id: String,
    name: String
}, { versionKey: false });

module.exports = mongoose.model("Room", roomSchema);