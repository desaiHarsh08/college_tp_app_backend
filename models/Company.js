const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
    companyName: {
        type: String,
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    criteria: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    driveLink: {
        type: String,
        required: true
    },
    lastDate: {
        type: Date,
        // required: true
    }
});

module.exports = mongoose.model('company', companySchema);