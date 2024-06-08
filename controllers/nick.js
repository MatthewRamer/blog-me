// Controller handler to handle functionality in room page
const roomGenerator = require('../util/roomIdGenerator.js');
const Room = require('../models/chatroom.js');
const Message = require('../models/msg.js');

// Example for handle a get request at '/:roomName' endpoint.
async function getNick(req, res){
    console.log('Entering getRoom...');
    const nickname = req.params.nickname;
    console.log('Requested room: ', roomName);

    //res.render('room', {title: 'chatroom', roomName: request.params.roomName, newRoomId: roomGenerator.roomIdGenerator()});
    try{
        const room = await Room.findOne({name:nickname}).lean();
        console.log("Printing room:", room);
        
        if(!room){
            console.log("Room not Found: ", nickname);
            return res.status(404).send('404:Room not Found!')
        }

        const messages= await Message.find({roomId:roomName}).sort({ timestamp: -1 });
        console.log('Fetched messages:', messages);
        res.render('room', { title: 'chatroom', roomName: room.name, newRoomId: roomGenerator.roomIdGenerator(), messages: messages });
     }
    catch(err){
        //console.log("There was an error fetching room/messages", err)
    }

}

module.exports = {
    getNick
};