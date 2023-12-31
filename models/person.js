require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)

try {
    console.log('connecting to', url);
    mongoose.connect(url)
        .then(result => console.log('connected to MongoDB'));
}
catch (err)
{
    console.log('error connecting to MongoDB:', err.message);
}

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String
})

// personSchema.set('toJSON', {
//     transform : (document, returnedObject) => {
//         returnedObject.id = returnedObject.id.toString();
//         delete returnedObject._id;
//         delete returnedObject.__v;
//     }
// })

module.exports = mongoose.model('Person', personSchema);