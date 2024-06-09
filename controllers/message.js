const Message  = require('../models/msg.js');

async function postMessage(req, res) {
    
    const { roomId, text } = req.body;
    const nickname = req.session.nickname;
    console.log("current set nickname is:",req.session.nickname);
    console.log("message.js req body:",req.body);
    

    const newMessage = new Message(
        { roomId: roomId,
        nickname: nickname, 
        text: text,
        timestamp: getDate()
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