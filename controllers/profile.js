const User = require('../models/user.js');
const bcrypt = require('bcrypt');

// Render new profile form
async function newProfile(req, res) {
    res.render('newProfile');
}

// Handle profile creation
async function createProfile(req, res) {
    const { email, password, nickname, gender, age, bio } = req.body;

    try {
        const hashPass = await bcrypt.hash(password, 10);
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
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('Internal server error.');
    }
}

module.exports = {
    newProfile,
    createProfile
};
