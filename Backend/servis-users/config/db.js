const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = "mongodb+srv://danicamaksimovic:Maksimovic2007!@semos.7irashr.mongodb.net/Database2Semos?retryWrites=true&w=majority&appName=Semos"
/*
const mongooseDB = async () => {
    await mongoose.connect(MONGODB_URI)
    .then(()=>console.log('Connected to MongoDB database'))
    .catch(error => console.log('Filed to connect to MongoDB', error));
};
*/
async function mongooseDB() {
    try {
      await mongoose.connect('mongodb+srv://danicamaksimovic:Maksimovic2007!@semos.7irashr.mongodb.net/Database2Semos?retryWrites=true&w=majority&appName=Semos');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  }

/*
const mongooseDB = async () => {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://danicamaksimovic:Maksimovic2007!@semos.7irashr.mongodb.net/Database1Semos?retryWrites=true&w=majority&appName=Semos', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>console.log('Connected to DV'))
    .catch(err => console.log('Filed to connected to DB', err));
};
*/
module.exports = mongooseDB;

