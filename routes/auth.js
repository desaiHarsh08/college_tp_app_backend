const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const Records = require('../models/Records');


// Secret key
const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Create a User using: POST "/api/auth/createuser". Doesn't require Auth
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;
    try {

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        // Check whether the user with this email exist already
        let user = await User.findOne({ email: req.body.email });

        // Return status 400, user with given email already exist
        if (user) {
            return res.status(400).json({ success, error: "Sorry, a user with this email already exist!" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        // Create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass
        })
        const data = {
            user: {
                id: user.id
            }
        }

        // Generate authToken
        const authToken = await jwt.sign(data, JWT_SECRET);
        success = true;

         // Check whether the user record exist already
         const isRecordFound = await Records.findOne({ user: user.id });
         console.log("isrecordfound", isRecordFound)
 
         // Logic for single time add record for the first time
         if (isRecordFound) {
             return res.send(true);
         }
 
         const { name, email,  } = req.body;
 
         let record = await new Records({
             name, email, user: user.id
         });
 
         let savedRecord = await record.save();
 
       
 
        











        res.json({ success, savedRecord });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
})


// Route 2: Authenticate a User using: POST "/api/auth/login". Doesn't require Auth
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    let success = false;
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;
    // console.log('req.body, email, password', req.body, email, password);
    try {


        // Check whether the user with the given email exist already
        let user = await User.findOne({ email });
        console.log(user)
        // Return status 400, if user with the given email not found
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login with correct email!" });
        }

        // If password not matched
        const passwordCompare = await bcrypt.compare(password, user.password);
        // console.log(user.password, password, passwordCompare)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login with correct credentials!" });
        }

        const data = {
            user: {
                id: user.id
            }
        }

        let name = user.name;
        let firstCharacter = name.charAt(0)

        //         // Generate authToken
        const authToken = await jwt.sign(data, JWT_SECRET);
        // res.setHeader("auth-token", authToken);
        success = true;
        res.json({ success, authToken, name, firstCharacter, email: user.email });
    } catch (error) {
        console.log(error);
        let success = false
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
})


// Route 3: Authenticate a User using token : POST "/api/auth/login-using-auth-token". Doesn't require Auth
// router.post('/login-using-auth-token', fetchuser, async (req, res) => {

//     let success = false;
//     try {
//         const userIdEmbedded = req.user; 
//         const userEmail = req.body.email; 
//         // Check whether the user with the given email exist already
//         let user = await User.findOne({ email: userEmail});
//         console.log(user)
//         if (!user) {
//             return res.status(400).json({ success, error: "Please try to login with correct details!" });
//         }

//         // const data = {
//         //     user: {
//         //         id: user.id
//         //     }
//         // }

//         // Generate authToken
//         // const authToken = await jwt.sign(data, JWT_SECRET);

//         success = true;
//         res.json({success, user});

//     } catch (error) {
//         let success = false;
//         console.log(error);
//         res.status(500).json({success, error: "Internal Server Error!"});
//     }
// })

router.post('/login-using-auth-token', async (req, res) => {

    let success = false;
    try {
        // const userIdEmbedded = req.user; 
        const userEmail = req.body.email;
        const isEmailVerified = req.body.isEmailVerified;

        if (isEmailVerified) {
            // Check whether the user with the given email exist already
            let user = await User.findOne({ email: userEmail });
            console.log(user)

            // If user not found
            if (!user) {
                return res.status(400).json({ success, error: "Please try to login with correct details!" });
            }

            // Adding user id to the token
            const data = {
                user: {
                    id: user.id
                }
            }
            // Generate authToken
            const authToken = await jwt.sign(data, JWT_SECRET);

            success = true;
            res.json({ success, user, authToken });
        }
        else {
            return res.status(400).json({ success, error: "Please try to login with correct details!" });
        }


    } catch (error) {
        let success = false;
        console.log(error);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
})


// Route 4: Get loggedin User details using: POST "/api/auth/getuser". Login require Auth
router.post('/getuser', fetchuser, async (req, res) => {

    let success = false;
    try {

        const userId = req.user;
        // Check whether the user with the given email exist already
        let user = await User.findById(userId.id).select("-password");

        success = true;
        res.json({ success, user });

    } catch (error) {
        let success = false;
        console.log(error);
        res.status(500).json({ success, error: "Internal Server Error!" });
    }
})



module.exports = router;