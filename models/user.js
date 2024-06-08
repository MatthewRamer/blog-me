//will hold the user info, such as email, password, nickname, gender, age and bio
const mongoose = require('mongoose');

//Helpful Link: https://mongoosejs.com/docs/guide.html
const userSchema = new mongoose.Schema({ //holds all information about user i.e nickname, email, password, 
    email: {type:String, required: true},
    password:{type:String, required: true},
    nickname: {type:String, required: true},
    gender:{type:String},
    age: {type:Number},
    bio:  {type:String}
}, { versionKey: false });

module.exports = mongoose.model("User", userSchema);