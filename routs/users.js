const express=require("express");
const { render } = require("ejs");
const router=express.Router();
const  bcrypt= require('bcryptjs');
const User=require('../models/User');

router.get('/login',(req,res)=> res.render("login"));
router.get('/register',(req,res)=> res.render("register"));

//Register Handle
router.post('/register',(req,res)=>{
    const {name, email, password, password2}= req.body;
    let errors=[];
    //Check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }
    //Check passwords match
    if(password!=password2){
        errors.push({msg:"Passwords do not match"});
    }

    //Check pass length
    if(password.length<6){
        errors.push({msg: "Password should be atleast 6 charaacters"});
    }

    if(errors.length>0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        })   //it returns that application with the info filled
    }
    else{
        //VAlidation passe
        User.findOne({email:email})
            .then(user =>{
                //User exists
                if(user){
                    errors.push({msg: "Email is already registered"})
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                }
                else{
                    const newUser =new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10,(err,salt)=>
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        // Set password to hashed
                        newUser.password=hash;
                        //Save user
                        newUser.save()
                         .then(user=>{
                             req.flash('success_msg','You are now registered and can login')
                            res.redirect("/users/login"); 
                         })
                         .catch(err => console.log(err))
                    }))
                }

            })
            
        
    }
})

module.exports=router;