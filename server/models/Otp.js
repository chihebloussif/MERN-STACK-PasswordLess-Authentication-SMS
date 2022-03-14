const mongoose = require ('mongoose');

const OtpSchema = new mongoose.Schema({
    phone:{type:String , required:true, unique:true},
    otp:{type:String , required:true, unique:true},
    createdAT: {type:Date , default:Date.now() , index : {expires:300}}
    },
    {timestamps:true}
    );
    module.exports = mongoose.model("Otp",OtpSchema);