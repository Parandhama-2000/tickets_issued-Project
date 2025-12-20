 function middlewarefunc(error,req,res,next){
    if(error){
//   console.log(error)
            res.status(error.statusCode || 404).json({
            message:error.message
        })
      
    }
}

module.exports = middlewarefunc;