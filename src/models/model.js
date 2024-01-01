const mongoose= require("mongoose");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");

const newSchema= mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true,
        minlength: 5,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:5,
    },
    confirmPass:{
        type:String,
        required:true,
        minlength:5
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
newSchema.methods.generateToken = async function(){
try {
    const token= jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
    console.log(token);
    this.tokens= this.tokens.concat({token:token});
    await this.save();
    return token;
} catch (error) {
    console.log("Token generation error: ", error);
    // res.send("TOken error: ", error);
}
}

newSchema.pre("save", async function(next){
    if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password, 10);
    // this.confirmPass= "Not Defined";
    }
    next();
})

const newModel= new mongoose.model("SignUpForm", newSchema);
module.exports= newModel;