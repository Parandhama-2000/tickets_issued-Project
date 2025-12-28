const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const joi = require('joi');

const Mongoschema = new mongoose.Schema({
    userName:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,required:true},
    createdDtTime:{type:Number,default:Date.now}
})

const schema = joi.object({
    userName:joi.string().required(),
    password:joi.string().required(),
    role:joi.string().required()
   
})

const modelUsers = mongoose.model('userRigister',Mongoschema);


router.post('/userCreate',async (req,res)=>{
  try {
    

console.log(req.body)
      const { error, value } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }


    let {userName,password,role} = req.body;

    const existingUser = await modelUsers.findOne({userName});
    if(existingUser){
      return  res.status(400).json({message:"user already exists"})
    }
    let salt = await bcrypt.genSalt(10);
    let hasPassword = await bcrypt.hash(password,salt)
    let newUser = new modelUsers({  userName,
      password:hasPassword,
      role
    })

       await newUser.save();

    return res.status(200).json({
        message:"User created successfully!",
        data:newUser
    })
  } catch (error) {
    console.log(error)
  }
})


router.get('/getUsers',async(req,res)=>{
  try{

    let usersList = await modelUsers.find().select("id userName role createdDtTime");
    res.status(200).json({
      message:"Users List",
      data:usersList
    })

  }catch(e){
    res.status(500).json({
      message:e.message
    })
  }
})


router.put('/updateUser/:userId',async(req,res)=>{
  try {
let userId = req.params.userId;

if(!userId){
  return res.status(400).json({message:"userId is required"})
}

    let existingUser = await modelUsers.findById(userId);
    if(!existingUser){
      return res.status(400).json({message:"User not found"})
    }

   let {error , value} = schema.validate(req.body || {})
   if(error){
    return res.status(400).json({message:error.details[0].message})
   }
  
   let {userName,password,role} = req.body;
   let salt = await bcrypt.genSalt(10);

   let hashPassword = await bcrypt.hash(password,salt);
   let updatedUser = await modelUsers.findByIdAndUpdate(userId,{userName,password:hashPassword,role},{new:true});
   return res.status(200).json({message:"Updated successfully!",data:updatedUser})

  }catch(e){
        res.status(500).json({
      message:e.message
    })
  }
})


router.delete('/deleteUser/:userId',async(req,res)=>{
  try{

    let userId = req.params.userId;

    let existingUser = await modelUsers.findById(userId);

    if(!existingUser){
      return res.status(200).json({
        message:"User not found"
      })
    }

    let deletedRecod = await modelUsers.findByIdAndDelete(userId);

    return res.status(200).json({
      message:"User deleted successfully!",
      data:deletedRecod
    })
  }catch(e){
    res.status(500).json({
      message:e.message
    })
  }
})
router.post('/loginUser',async (req,res)=>{
  try{
  let {error,value} = await schema.validate(req.body);
  if(error){
    return res.status(400).json({message:error.details[0].message})
  }
  let {userName,password,role} = req.body;

  let userExists = await modelUsers.findOne({userName}).select("_id userName role password")

  if(!userExists){
    return res.status(400).json({message:"Invalid credentials"})
  }

  let comparing = await bcrypt.compare(password,userExists.password);
  if(!comparing){
   return res.status(400).json({message:"Password not macthed"})
  }
  let userId = await userExists.id
    console.log(userId)
let token = await JWT.sign({userName,userId,role},process.env.JWTToken,{expiresIn:'1h'});
 let userExist = await modelUsers.findOne({userName}).select("_id userName role")
  return res.status(200).json({
    token:token,
    userData:userExist,
    message:"Login successful",
    status:true
  });

  
}catch (e){
  return res.status(500).json({message:e.message})
}
})




module.exports = router;