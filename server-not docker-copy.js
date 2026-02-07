const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://admin:diaa@mlocalhost:27017/userdb?authSource=admin'; 
//the app is not container so it can't see mongodb container but it can see the host port 3000 and localhost.

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    username: String,
    address: String,
    email: String,
    profilePicture: String
});

const User = mongoose.model('User', userSchema);

// Setup Multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission with image
app.post('/submit', upload.single('profilePicture'), async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            address: req.body.address,
            email: req.body.email,
            profilePicture: req.file ? `/uploads/${req.file.filename}` : ''
        });
        await newUser.save();
        res.send(`
            <h1>Information saved successfully!</h1>
            <p>Username: ${newUser.username}</p>
            ${newUser.profilePicture ? `<img src="${newUser.profilePicture}" width="150">` : ''}
            <br><a href="/">Go back</a>
        `);
    } catch (err) {
        res.status(500).send('Error saving information: ' + err.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
