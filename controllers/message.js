const Message  = require('../models/msg.js');

async function postMessage(req, res) {
    
    const { roomId, text } = req.body;
    const nickname = req.session.nickname;
    console.log("message.js req body:",req.body);
    if (!nickname) {
        return res.status(400).send('Nickname is required');
    }

    const newMessage = new Message(
        { roomId: roomId,
        nickname: nickname, 
        text: text,
        timestamp: new Date()
    });
   
    //res.status(201).send('Message sent successfully.');
    try{
        await newMessage.save();
        res.redirect(`/${roomId}`);

    }
    catch (err) {
        console.error('Error posting message:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    postMessage
};