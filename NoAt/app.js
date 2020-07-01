const express=require("express");
const expressLayouts=require("express-ejs-layouts");
const app=express();

//EJS
app.use(expressLayouts);
app.set("view engine","ejs");

//create routes
app.use("/",require("./routs/index"));
app.use("/users",require("./routs/users.js"));

const PORT=process.env.PORT||3000;

app.listen(PORT,console.log("Server started"));