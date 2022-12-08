const mongoose =  require('mongoose');
mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/employeereg")
.then(()=>{
    console.log("connect");
}).catch(()=>{
    console.log("not connect");
})