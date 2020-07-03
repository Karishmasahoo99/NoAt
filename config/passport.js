const localStrategy=require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

// Load User Model
const User=require('../models/User');
module.exports=function(passport){
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
           //Match User
           User.findOne({email:email})
              .then(user=>{
                    if(!user){
                        return done(null,false,{message: "That email is not registered"});
                    }

                    else{
                        bcrypt.compare(password,user.password,(err, isMAtch)=>{
                            if(err) throw err;
                            if(isMAtch){
                                return done(null,user);
                            }
                            else{
                                return done(null,false,{ message: "Password didn't match"})
                            }
                        })
                    }
                }
                )
              .catch(err=>console.log(err));
        })
    );
    passport.serializeUser((user, done)=> {
        done(null, user.id);
      });
       
      passport.deserializeUser((id, done) =>{
        User.findById(id,(err, user) => {
          done(err, user);
        });
      });
}