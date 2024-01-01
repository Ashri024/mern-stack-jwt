const register= require("../models/model");
const jwt = require("jsonwebtoken");

const auth= async(req,res, next)=>{
    try {
        const token = req.cookies.jwt0;
        const status= jwt.verify(token, process.env.SECRET_KEY);
        console.log("status: ");
        console.log(status);

        const user = await register.findOne({_id: status._id});
        req.token= token;
        req.user= user;
        next();
    } catch (error) {
        console.log("Error: ", error);
        res.status(404).send(error);
    }
}
module.exports= auth;