const mongoose = require('mongoose');

let formSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('FormModel', formSchema);