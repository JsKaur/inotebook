const router = require('express').Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
var bcrypt=require('bcryptjs');

// create a user using: POST "/api/auth/". Doesn't require Auth
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
    user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    
    

    res.json(user);
}
catch(error){
    console.error(error.message);
    res.status(500).send("Some error occured");
}

});
    



module.exports = router;