const router = require('express').Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt=require('bcryptjs');
var jwt=require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');
const JWT_SECRET="jashan";
// ROUTE 1: create a user using: POST "/api/auth/". Doesn't require Auth
router.post('/createuser',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password','Password must be at least 5 characters').isLength({min:5})

], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //const salt=bcrypt.genSaltSync(10);

   //const secPass=await bcrypt.hash(req.body.password,salt);
   try{
   let user = await User.findOne({ email: req.body.email });
   if(user){
       return res.status(400).json({error:"User already exists"})
   }

   const salt=await bcrypt.genSalt(10);
   const secPass=await bcrypt.hash(req.body.password,salt);
  
    user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass
    })
    const data={
        user:{
            id:user.id
        }
    }
   const authToken= jwt.sign(data, JWT_SECRET);
    
    res.json(authToken);
}
catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
}

});
    
//ROUTE 2:  Authenticate user:

router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
   
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"Please login with correct credentials"});
        }

        const passwordCompare=await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            return res.status(400).json({error:"Please login with correct credentials"});
        }

        const data={
            user:{
                id:user.id
            }
        }

        const authToken= jwt.sign(data, JWT_SECRET);
    
    res.json(authToken);

    }catch(error){
        console.error(error.message);
    res.status(500).send("Internal Server Error occured");
    }
});

// ROUTE 3: get loggedin user details using: POST "/api/auth/getuser". Login required
router.post('/getuser',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists()
   
], async (req, res) => {
    
try {
    const userId=req.user.id;
    const user=await User.findById(userId).select("-password");
    res.send(user);
} catch(error){
    console.error(error.message);
    res.status(500).send("Internal Server Error occured");
}
});
module.exports = router;