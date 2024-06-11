//Import dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const session = require('express-session');
const path = require('path');
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const cors = require('cors');

//Import handlers
const homeHandler = require('./controllers/home.js');
const roomHandler = require('./controllers/room.js');
//const profile = require('./controllers/profile.js');

const nickHandler = require('./controllers/nick.js');
const nicknameHandler = require('./controllers/nickname.js');
const profileHandler = require('./controllers/profile.js');
const msgHandler = require('./controllers/message.js');

const Message = require('./models/msg.js');
const Room = require('./models/chatroom.js');
const User = require('./models/user.js');

const { roomIdGenerator } = require('./util/roomIdGenerator.js');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

const app = express();
const port = 8080;

//MongoDB connection string and options
const uri = "mongodb+srv://ahan058:DHXXha0ZrqiVCKcT@cluster0.hj10yd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const uri = "mongodb+srv://ahan058:DHXXha0ZrqiVCKcT@cluster0.hj10yd6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
//const uri = "mongodb+srv://drios027:rCVT5TkScEiP0Pdw@cs110-project.rtlhbad.mongodb.net";
const clientOptions = { 
    serverApi: { version: '1', strict: true, deprecationErrors: true }
};

//Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'frontend', 'dist'))); // Serve the static files from the React app

//app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: uri,
        mongooseConnection: mongoose.connection,
        collectionName: 'sessions'
    })
}));

app.use(nicknameHandler);

//View engine setup
const hbsOptions = {
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/views/layouts/'),
    handlebars: allowInsecurePrototypeAccess(require('handlebars')),
    //https://handlebarsjs.com/guide/block-helpers.html#conditionals
    helpers: {
        eq: (a, b) => a === b
    }
};
app.engine('hbs', hbs(hbsOptions));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// mongoose.connect('mongodb://localhost:27017/')
//     //check connection
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch(err => {
//         console.error('Error connecting to MongoDB:', err);
//     });

mongoose.connect(uri, clientOptions)
    .then(() => {
        console.log("Connected to MongoDB");
        app.use(express.static(path.join(__dirname, 'public')));

        app.get('/', (req, res) => { //loads the login page first, only issue is its not redirecting
            res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
          });

        // Create controller handlers to handle requests at each endpoint

        app.get('/debug/messages', async (req, res) => {
            try {
                const messages = await Message.find({}).lean();
                res.json(messages);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                res.status(500).json({ success: false, message: 'Internal server error.' });
            }
        });
        
        app.get('/home', homeHandler.getHome);
        
        app.get('/newProfile', (req, res) => {
            res.render('newProfile');
        });


        app.delete('/deleteMessage/:id', async (req, res) => {
            const messageId = req.params.id;
            try {
                await Message.findByIdAndDelete(messageId);
                res.status(200).json({ success: true, message: 'Message deleted successfully.' });
            } catch (err) {
                console.error('Error deleting message:', err);
                res.status(500).json({ success: false, message: 'Internal server error.' });
            }
        });
        
        
        app.get('/editMessage/:id', async (req, res) => {
            console.log("Inside edit message", req.body);
            const messageId = req.params.id;
            try {
                const message = await Message.findById(messageId).lean();
                if (message) {
                    res.render('editMessage', { message: message, loggedInNickname: req.session.nickname });
                } else {
                    res.status(404).send('Message not found.');
                }
            } catch (err) {
                console.error('Error fetching message:', err);
                res.status(500).send('Internal server error.');
            }
        });


        app.post('/updateMessage', async (req, res) => {
            const { msgId, text, roomId } = req.body;
        
            try {
                await Message.findByIdAndUpdate(msgId, { text: text });
                res.redirect(`/${roomId}`);
            } catch (err) {
                console.error('Error updating message:', err);
                res.status(500).send('Internal server error.');
            }
        });
        
        app.get('/login', (req, res) => {
            res.render('login');
        });
        
     
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            console.log('Inside /login, email is:', email);
            console.log('Inside /login, password is:', password);
        
            try {
                const userExists = await User.findOne({ email: email });
                if (userExists) {
                    
                    req.session.nickname = userExists.nickname; 
                    res.redirect('/home'); 
                } else {
                    console.log('Email not in database');
                    res.redirect('/newProfile');
                }
            } catch (err) {
                console.error('Error verifying user:', err);
                res.status(500).send('Internal server error.');
            }
        });

        app.get('/searchMessages/:roomId', async (req, res) => {
            const { keyword } = req.query;
            const { roomId } = req.params;
            console.log(`Searching in room: ${roomId} for keyword: ${keyword}`);
        
            try {
                const messages = await Message.find({
                    text: { $regex: new RegExp(keyword, 'i') },
                    roomId: roomId
                }).lean();
        
                console.log(`Messages found for '${keyword}' in '${roomId}':`, messages);
                console.log("Messages found:", messages);
                res.json(messages);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                res.status(500).send('Internal server error.');
            }
        });
        
        app.post('/newProfile', profileHandler.createProfile);
        app.post('/sendMessage', msgHandler.postMessage);

        app.get('/logout', (req, res) => {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).send('Internal server error.');
                } else {
                    res.redirect('/');
                }
            });
        });
        
        
    
        /*
        app.post('/editMessage', async(req, res)=>{
            const {msgId,name, text} = req.body;
            console.log("Inside editMessage: ",req.body);
            res.render('editMessage', {text:text,loggedInNickname: req.session.nickname});
        } );
        */

        app.post("/create", async (req, res) => {
            const roomName = req.body.roomName;
            req.session.nickname = req.body.nickname;

            if (!roomName || roomName.trim() === "") {
                return res.send('Room name is required and cannot be empty.');
            }

            try {
                //Check if room exists already
                const exist = await Room.findOne({ name: roomName });
                if (exist) {
                    return res.send('Identical room name already exists!');
                }

                const newRoom = new Room({
                    id: roomIdGenerator(), //from util!
                    name: roomName,
                });

                await newRoom.save();
                //res.send('Room created successfully.' );

                //Respond with success message or redirect as needed
                res.redirect('/home');

            } catch (err) {
                console.error('Error creating room:', err);
                res.status(500).send('Internal server error.');
            }
        });
        app.get('/:roomName', roomHandler.getRoom);
        
        

        app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
    })
    .catch(err => {
        console.error('Failed to connect to MongoDB', err);
    });