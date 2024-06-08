const express = require('express');
const router = express.Router();


router.post('/set-nickname', (req, res) => {
    const { nickname, roomName } = req.body; 
    if (nickname) {
        req.session.nickname = nickname;
        res.locals.nicknameSet = true; 
        return res.redirect(`/${roomName}`);
    }
    res.status(400).send('Nickname is required');
});

module.exports = router;
