const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const employeeSchema = new mongoose.Schema({

    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]



})

// generating token
employeeSchema.methods.generateAuthToken=async function(){
    try {
        console.log(this._id);
        const token =jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY); // process.env.SECRET_KEY   =  hellomyname.......
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;
    } catch (error) {
        res.send("the eror part" + error);
        console.log("the eror part" + error);
    }
}

// converting password into hash 

employeeSchema.pre("save", async function (next) {

    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(password, 10);
       
        this.password = await bcrypt.hash(this.password, 10);
        this.confirmpassword = await bcrypt.hash(this.password, 10);
    }    

    next();

})

// collection 
const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;