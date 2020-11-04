const router = require('express').Router();
const e = require('express');
const User = require( '../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registrationValidation,loginValidation} = require('../validation');
//Validation


router.post('/register', async (req, res) => {
    //validating User
    const {error} = registrationValidation(req.body);    
    if(error) return res.status(400).send(error.details[0].message);

    //Checking duplicate email
    const emailExist = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("Email already exist");
    //HASH the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try{
    const savedUser = await user.save();
    res.send(savedUser);
    }
    catch(ex){
        res.status(400).send(ex);
    }
});


//router.post('/login');

router.post('/login', async (req, res) => {
    //validating User
    const {error} = loginValidation(req.body);    
    if(error) return res.status(400).send(error.details[0].message);

    //Checking duplicate email
    const user = await User.findOne({email : req.body.email});
    if(!user) return res.status(400).send("Email does not exist");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("password is wrong");

    //create and assign token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET )
    res.header('auth-token', token).send(token);
    //res.send('Logged in');
});


module.exports = router;
