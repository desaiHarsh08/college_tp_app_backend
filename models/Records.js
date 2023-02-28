const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        unique: true,
        ref: 'user'
    },
    name: {
        type: String,
        default: "",
         // required: true
    },
    dob: {
        type: Date,
        default: Date("dd-mm-yyyy").now
    },
    email: {
        type: String,
         // required: true,
    },
    address: {
        type: String,
        default: "",
         // required: true,
    },
    phone: {
        type: String,
        default: "",
         // required: true,
    },
    department: {
        type: String,
        default: "",
         // required: true,
    },
    yearOfPassing: {
        type: Number,
        default: 2023,
         // required: true,
    },
    homeTown: {
        type: String,
        default: "",
         // required: true,
    },
    state: {
        type: String,
        default: "",
         // required: true,
    },
    tenth: {
        type: String,
        default: "",
         // required: true,
    },
    twelfth: {
        type: String,
        default: "",
         // required: true,
    },
    aggregate: {
        type: String,
        default: "",
         // required: true,
    },
    skills: {
        type: String,
        default: "",
         // required: true,
    },
    // source : {
    //     type: Buffer,
    //     contentType: String 
    // },
    course: {
        type: String,
        default: "",
         // required: true,
    }
    // ,
    // "is-placed": {
    //     type: Boolean,
    //      // required: true,
    //     default: false,
    // }
    
});

module.exports = mongoose.model('records', recordsSchema);