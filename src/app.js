require("dotenv").config();
const express = require('express')
const path= require("path");
const hbs= require("hbs");
require("./db/conn");
const SignUpForm = require("./models/model");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const app = express()
const port = 3000
console.log(process.env.SECRET_KEY);

const static_path= path.join(__dirname, "../public")
app.use(express.json());
app.use(express.static(static_path));
app.use(express.urlencoded({extended:false}));
app.set("view engine","hbs");
app.set('views', path.join(__dirname, '../templates/views'));
hbs.registerPartials(path.join(__dirname,"../templates/partials"));

app.get('/', (req, res) => {
    res.render('index')}
    );
app.get('/register', (req, res) => {
    res.render('register')}
    );
app.get('/login', (req, res) => {
    res.render('login')}
    );
app.post('/login', async(req, res) => {
    try {
    const result = await SignUpForm.find({username: req.body.username});
    console.log(result);
    if(result.length >0){
        console.log(result);
        const pass= req.body.password;
        const storedPass= result[0].password;
        // const status= pass==storedPass? true:false;
        const status= await bcrypt.compare(pass,storedPass)
        const token= await result[0].generateToken();
        console.log("Login token: ",token);

        if(status){
        console.log("Status: ", status);
        res.status(201).render("home");
        }
        else{
            res.status(404).send("Sorry the password doesnt match");
        }
    }else{
        res.status(401).send("Sorry the username cant be found");
    }
    } catch (error) {
        res.status(401).send(error);
    }
    });

// async function securePass(pass){
//     const hassPass= await bcrypt.hash(pass,10);
//     return hassPass;
// }
app.post('/register', async(req, res) => {
    try{
        const pass= req.body.password;
        const confirmPass= req.body.confirmPass;
        if(pass===confirmPass){
        // const bcryptPass= await securePass(pass);
        const newUser= new SignUpForm({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            confirmPass:req.body.confirmPass
        })

            const token = await newUser.generateToken();
            console.log("Success token generation: ", token);
            const result= await newUser.save();
            console.log("Result: ", result);
            res.status(201).render("login");
        }else{
            res.status(401).send("Sorry the password doesnt match");
        }
    }
    catch(err){
        console.log(err);
        res.status(501).send(err);
    }
}
    );
app.listen(port, () => console.log(`Example app listening on port http://localhost:${port} !`))
