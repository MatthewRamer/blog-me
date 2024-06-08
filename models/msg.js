const mongoose = require('mongoose');
/* ref
const roomSchema = new mongoose.Schema({
    id: String,
    name: String
}, { versionKey: false });
*/
//Helpful Link: https://mongoosejs.com/docs/guide.html
const messageSchema = new mongoose.Schema({
    roomId: {type:String, required: true}, 
    nickname: {type:String, required: true},
    text: {type:String, required: true},
    timestamp: {type:Date, default: Date.now}
}, { versionKey: false });

module.exports = mongoose.model("Message", messageSchema);