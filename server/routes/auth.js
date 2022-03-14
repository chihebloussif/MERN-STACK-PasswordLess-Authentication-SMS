const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
const Otp = require('../models/Otp');
dotenv.config();

const accountSid = process.env.ACCOUNT_SID ;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid,authToken);




router.post("/register", async (req , res ) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
    });
    try {
        const phone = await User.findOne({phone:req.body.phone}) ;
        const email = await User.findOne({email:req.body.email}) ;
        const username = await User.findOne({username:req.body.username}) ;
        if (phone){
         return   res.status(400).send("Phone Number already registered");
        }  else if (username) {  
            return    res.status(400).send("Username is Taken"); 
        } else if (email) {
          return  res.status(400).send("Email already registered");
        }
        else {
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }    
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post("/login", async (req,res)=> {
          
        try {
            const phone = await User.findOne({phone:req.body.phone});
             if (!phone) {
                res.status(401).json("Wrong phone Number !");
             }
             else {         
                const phone = req.body.phone;
                const otpGen = Math.floor(100000 + Math.random()*900000);
                const otp = new Otp({phone:phone , otp:otpGen})
            client.messages
            .create({
               body: `Your OTP Password is ${otpGen}`,
               from: '+13603479371',
               to: phone
             });
                const result = await otp.save()
           return res.status(200).send({phone,otpGen})  ;
             }
        } catch (err) {
            res.status(500).json(err);
        }  
})



router.post("/otpCheck", async (req,res)=> {
        
       try {
        const user = await Otp.findOne({otp:req.body.otp});
        const otpHolder = await Otp.findOne({otp:req.body.otp});
            if (!otpHolder) return res.status(400).send('Invalid or Expired Otp');
            const accessToken = jwt.sign({
                id: user._id ,
            }, process.env.JWT_SECRET, 
            {expiresIn:"1d"});
            res.status(200).json({accessToken});
       } catch {


       }
})



module.exports = router 