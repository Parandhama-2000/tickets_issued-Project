const customErrorClass = require("../custom-Error/customeError");
const JWT = require('jsonwebtoken');
const modelTickets = require("../modelsFolder/modeolTickets");

const middleware = async (req,res,next)=>{
  try{

    let objectId = req.params.objectId;
    let record = await modelTickets.findById(objectId);

    let header = req.headers['authorization'];
    const bearToken = header && header.split(" ")[1]
    if(bearToken){
      let encodeUser = await JWT.verify(bearToken,process.env.JWTToken)
 req.userInfo = encodeUser;


  next()

    }else{
       next(new customErrorClass("Unauthorization",401))
    }
  }catch (err){
     next(new customErrorClass(err.message,401))
  }
    
}

const middlewareedit = async (req,res,next)=>{
  try{

    let objectId = req.params.objectId;
    let record = await modelTickets.findById(objectId);

    let header = req.headers['authorization'];
    const bearToken = header && header.split(" ")[1]
    if(bearToken){
      let encodeUser = await JWT.verify(bearToken,process.env.JWTToken)
 req.userInfo = encodeUser;

 if(encodeUser.role === 'platform'){
  next()
 }else if(record && encodeUser.userId === record.createdBy.toString()){
  next()
 }else{
  next(new customErrorClass("Ur not allow to access this page",401))
 }
    }else{
       next(new customErrorClass("Unauthorization",401))
    }
  }catch (err){
     next(new customErrorClass(err.message,401))
  }
    
}
module.exports = {middleware,middlewareedit}