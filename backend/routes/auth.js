const router = require('express').Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');

// create a user using: POST "/api/auth/". Doesn't require Auth
router.post('/',[
    body('email','Enter a valid email').isEmail(),
    body('name','Enter a valid name').isLength({min:3}),
    body('password','Password must be at least 5 characters').isLength({min:5})

], (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }).then(user=>{
        res.send(user);
    }).catch((error)=>{
        {console.log(error)
            res.json({error:"Please enter a unique email",message:error.message})}; 


    });
});
    



module.exports = router;