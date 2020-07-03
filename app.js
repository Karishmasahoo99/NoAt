const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const mongoose=require('mongoose');
const flash=require('connect-flash');
const session=require('express-session');

const app=express();

//db config
const db=require('./config/keys').MongoURI;

//Connect to Mongo
 mongoose.connect(db,{ useNewUrlParser:true , useUnifiedTopology: true})
  .then(() => console.log("Mongodb connected...."))
  .catch(err =>console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine","ejs");

//Bodyparser
app.use(express.urlencoded({extended:false}));

//Express session
app.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));

//Connect flash
app.use(flash());

//Global Vars
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg');
  res.locals.error_msg=req.flash('error_msg');
  next();
})

//create routes
app.use("/",require("./routs/index"));
app.use("/users",require("./routs/users.js"));

const PORT=process.env.PORT||3000;

app.listen(PORT,console.log("Server started"));