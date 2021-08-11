const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = ()=>{
    return new User({}).save();
    // return {
    //     _id: {ObjectId: '61139920b8905f2dfeaf73c3'}
    // }
}