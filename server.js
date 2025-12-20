const express = require('express');
const rateLimit = require('express-rate-limit');
const monose = require('mongoose');
const app = express();
app.use(express.json());
require('dotenv').config();
const customErrorClass = require('./custom-Error/customeError');
const middlewarefunc = require('./custome_middleware/customeMiddleware');
const usersListing = require('./ticket_users/users_List')
const ticktesList = require('./role-WiseTickets/ticktes_raising')
// Rate limiting middleware


const rateLimiting = rateLimit({
    windowMs:1 * 60 * 1000,
    max:5,
      message: {
    status: 429,
    error: "Too many requests! Please try again after 15 minutes."
  }
})

monose.connect(process.env.MONGODB).then(()=>{
  console.log("connected to mongodb")
}).catch
((err)=>{
  console.log(err)
})

app.use('/ticketusers',usersListing)
app.use('/ticketsData',ticktesList)
app.use(rateLimiting);

app.use(middlewarefunc)
app.listen(process.env.PORT,()=>{
  console.log(`server running on ${process.env.PORT}`)
})