const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    message: { type: String, required: true }
});


module.exports = mongoose.model('Msg', msgSchema);