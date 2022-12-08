require('dotenv').config();
const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');

require("./db/conn")
const Register = require("./models/registers");
const { triggerAsyncId } = require("async_hooks");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public")
const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")


app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// console.log(process.env.SECRET_KEY);

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/login", (req, res) => {
    res.render("login")
})



// create a new user in our database
app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        // const { fname, lname,email } = req.body;      short 
        if (password === cpassword) {
            const registerEmployee = new Register({
                fname: req.body.fname,
                lname: req.body.lname,
                email: req.body.email,
                gender: req.body.gender,
                phone: req.body.phone,
                age: req.body.age,
                password: password,
                confirmpassword: cpassword
            })
            console.log("the success part" + registerEmployee);
            const token =await registerEmployee.generateAuthToken();
            console.log("the token part" + token);


            const registered = await registerEmployee.save();
            console.log("the page part" + registered);

            res.status(201).render("login");
        } else {
            res.send("password not match")
        }
  
    } catch (error) {
        res.status(400).send(error);
    }
})


// login check 
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({ email: email });

        const isMatch = await bcrypt.compare(password, useremail.password);

        const token =await useremail.generateAuthToken();
            console.log("the token part" + token);

        if (isMatch) { // if(useremail.password === password){
            res.status(201).render("index");
        } else {
            res.send("invalid password ");
        }  

        // console.log(`email is ${email} and password is ${password}`)


    } catch (error) {
        res.status(400).send("invalid email");
    }
})


const bcrypt = require('bcryptjs');
const securepassword = async (password) => {
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    const passwordmatch = await bcrypt.compare("aadi@123", passwordHash);
    console.log(passwordmatch);
}

securepassword("aadi@123");






// const jwt = require("jsonwebtoken");


// const createToken = async()=>{
//    const token=await jwt.sign({_id:"6390325d3c5ab7ef64f382c9"},"hellomynameisadityatybca2gccbscbscblacslsbscsch",{
//     expiresIn:"2 seconds"
//    });
//     console.log(token);


//     const userver = await jwt.verify(token,"hellomynameisadityatybca2gccbscbscblacslsbscsch");
//     console.log(userver);
// }
 
// createToken();

app.listen(port, () => {
    console.log(`connecting in the port no ${port}`);
})