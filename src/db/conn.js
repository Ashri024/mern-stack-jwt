const mongoose= require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/signUpForm").then(()=>{
    console.log("connected successfully!!");
}).catch(e=>{
    console.log("Error: ", e);
});
