const express = require('express');
const router = express.Router();

const JWT = require('jsonwebtoken');
const joi = require('joi');
const middleware = require('../role_backcondition/rolebackconsitions');
const customErrorClass = require('../custom-Error/customeError');
const modelTickets = require('../modelsFolder/modeolTickets');



const joiValidation = joi.object({
    title:joi.string().required(),
    description:joi.string().required(),
    status:joi.string().required(),
})
router.post('/createTicket',middleware, async (req,res)=>{
    try{
    const {error,value} =   joiValidation.validate(req.body || {});
 if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let {title,description,status} =  req.body;
  let newTicket = new modelTickets({
    title,description,status,
    role:req.userInfo.role,
    createdBy:req.userInfo.userId
  })
  await newTicket.save();
    return res.status(200).json({
        message:"ticket created succesffully!",
        data:newTicket
    })
    }catch (e){
        console.log(e)
    }
})


router.get('/listAllTickets',middleware,async(req,res)=>{
    try{
        let find = await modelTickets.find({})
    return res.status(200).json({
        message:"all tickets list",
        data:find
    })
    }catch (e){
        console.log(e.message)
    }
})


router.get('/getRecord/:objectId',middleware,async(req,res,next)=>{
  try{
    let objectId = req.params.objectId;
    let record = await modelTickets.findById(objectId);
    if(!objectId){
       next(new customErrorClass('objectId is required',400))
    }
    return res.status(200).json({
      message:"record fetched successfully",
      data:record
    })
  }catch (e){
return res.status(500).json({message:e.message})
  }
})

router.delete('/deleteTicket/:objectId',middleware,async(req,res,next)=>{
  try{
let ticketId = req.params.objectId;

let deletedRecod = await modelTickets.findById(ticketId);
if(!deletedRecod){
  return next(new customErrorClass("ticket not found",404))
}

let deletRecod = await modelTickets.findByIdAndDelete(ticketId);
return res.status(200).json({message:"ticket deleted successfully!",deletedRecod:deletRecod})
  }catch (e){
next(new customErrorClass(e.message,500))
  }
})


router.put('/updateTicket',middleware,async(req,res,next)=>{
  try{
    let {ticketId,title,description,status} = req.body;
    let updateBook = await modelTickets.findById(ticketId);

    if(!updateBook){
      return next(new customErrorClass("ticket not found",404))
    }

    let updatedBook = await modelTickets.findByIdAndUpdate(ticketId,req.body,{new :true});
    return res.status(200).json({
      message:"ticket updated successfully!",
      data:updatedBook
    })

  }catch(e){
    next(new customErrorClass(e.message,500))
  }
})

module.exports = router;