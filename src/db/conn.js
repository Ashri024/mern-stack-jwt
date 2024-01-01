const mongoose= require("mongoose");
mongoose.connect(`${process.env.DB_URL}`).then(()=>{
    console.log("connected successfully!!");
}).catch(e=>{
    console.log("Error: ", e);
});
