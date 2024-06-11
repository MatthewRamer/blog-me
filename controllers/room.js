// Controller handler to handle functionality in room page

const roomGenerator = require('../util/roomIdGenerator.js');
const Room = require('../models/chatroom.js');
const Message = require('../models/msg.js');


// Example for handle a get request at '/:roomName' endpoint.
async function getRoom(req, res){
    console.log('Entering getRoom...');
    const roomName = req.params.roomName;
    console.log('Requested room: ', roomName);

    //res.render('room', {title: 'chatroom', roomName: request.params.roomName, newRoomId: roomGenerator.roomIdGenerator()});
    try{
        const room = await Room.findOne({name:roomName}).lean();
        console.log("Printing room:", room);
        
        if(!room){
            console.log("Room not Found: ", roomName);
            return res.status(404).send('404:Room not Found!')
        }

        const messages= await Message.find({roomId:roomName}).sort({ timestamp: -1 });
        console.log('Fetched messages:', messages);
        res.render('room', { title: 'BlogMe', roomName: room.name, newRoomId: roomGenerator.roomIdGenerator(), messages: messages, loggedInNickname: req.session.nickname });
        
        messages.forEach((message, index) => {
            console.log(`RoomID ${message.roomId}`)
            console.log(`Message ${index + 1}:`);
            console.log(`Nickname: ${message.nickname}`);
            console.log(`Text: ${message.text}`);
            console.log(`Timestamp: ${message.timestamp}`);
          });
     }
    catch(err){
        //console.log("There was an error fetching room/messages", err)
    }

}

module.exports = {
    getRoom
};