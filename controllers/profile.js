const User = require('../models/user.js');
const bcrypt = require('bcrypt');

// Render new profile form
async function newProfile(req, res) {
    const error_msg = req.query.error;
    res.render('newProfile', {error_msg});
}

// Handle profile creation
async function createProfile(req, res) {
    const { email, password, nickname, gender, age, bio } = req.body;
    
    try {
        const existingUser = await User.findOne({ email: email }); //checking if email is already in use
        if (existingUser) {
            return res.redirect('/newProfile?error=Email is already in use! Please enter another email');
        }
        else{
        req.session.nickname = nickname;
        //https://stackoverflow.com/questions/48799894/trying-to-hash-a-password-using-bcrypt-inside-an-async-function
        const hashPass = await bcrypt.hash(password, 10);//security measures
        const newUser = new User({
            email: email,
            password: hashPass,
            nickname: nickname,
            gender: gender,
            age: age,
            bio: bio
        });
        await newUser.save();
        res.redirect('/home'); // Redirect to the home page after registration
    }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal server error.');
    }
}

module.exports = {
    newProfile,
    createProfile
};
