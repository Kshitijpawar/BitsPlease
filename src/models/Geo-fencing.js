const mongoose = require('mongoose');

const Geo_fenceSchema= new mongoose.Schema({
    // username: {
    //     type: String,
    //     unique: true,
    //     required: 'Your username is required',
    // },
    userId:{
        type: mongoose.Types.ObjectId,
        required:true,
        ref:'User'
    },
    geo_fence:
    { 
        type : Array , 
        default : [] 
    }
    
}, {timestamps: true});


module.exports = mongoose.model('Geo_fencing',Geo_fenceSchema)