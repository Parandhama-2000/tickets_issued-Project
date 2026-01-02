const mongoose = require('mongoose');
const ticketShema = new mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    createdATime:{type:Number,default:Date.now},
    status:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'userRigister'},
    role:{type:String,required:true},
    createdUser:{type:String,required:true}
})
const modelTickets = mongoose.model('ticketsList',ticketShema);
module.exports = modelTickets;