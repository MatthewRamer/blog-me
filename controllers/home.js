// Controller handler to handle functionality in home page

const Room  = require('../models/chatroom.js');

// Handle functionality for users

const UserList = require('../models/user.js');


async function getHome(request, response) {
  //testings
  console.log('entering inside getHome...');
  console.log('Room:', Room);
  try { //Find rooms in the database if Room is defined
      if (Room) {
          //Testing
          const items = await Room.find().lean();
          const user_items = await UserList.find().lean();
          //console.log('Fetched rooms:', items); 

          //response.render('home', { title: 'home', rooms: items, isAvailable: true });
          response.render('home', { title: 'Home Page', rooms: items, users: user_items, current_user: request.session.nickname, isAvailable: true });

          //Testing
          console.log('After fetching rooms...');
      } else {
          // Render empty version
          response.render('home', { title: 'Home Page', rooms: [], isAvailable: false });
      }
  } catch (err) {
      console.error('Not fetching rooms RIP', err);
      response.send('Internal Server Error');
  }
}


module.exports = {
    getHome
};

