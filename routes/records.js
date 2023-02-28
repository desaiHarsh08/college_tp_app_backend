const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Records = require('../models/Records');
const { body, validationResult } = require('express-validator');


// Route 1: Get all the records of User using: GET "/api/records/fetchallrecords". Login require Auth
router.get('/fetchallrecords', fetchuser, async (req, res) => {
    try {

        // Fetch all records
        console.log(req.user.id)
        const records = await Records.findOne({ user: req.user.id });
        res.json(records);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error!");
    }
});



// Route 2: Add the records (only for the first time) of User using: POST "/api/records/addrecord". Login require Auth
router.post('/addrecord', fetchuser, [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('address', 'Enter a valid address').isLength({ min: 3 }),
    body('phone', 'Enter a valid phone number').isMobilePhone(),
    body('department', 'Enter a valid Department').isLength({ min: 2 }),
    body('yearOfPassing', 'Enter a valid year').isLength({ min: 4, max: 4 }),
    body('homeTown', 'Enter a valid home town').isLength({ min: 3 }),
    body('state', 'Enter a valid state').isLength({ min: 3 }),
    body('tenth', 'Enter a valid score').isLength({ min: 3 }),
    body('twelfth', 'Enter a valid score').isLength({ min: 3 }),
    body('aggregate', 'Enter a valid score').isLength({ min: 3 }),
], async (req, res) => {

    try {

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        
        // Check whether the user record exist already
        const isRecordFound = await Records.findOne({ user: req.user.id });
        console.log("isrecordfound", isRecordFound)

        // Logic for single time add record for the first time
        if (isRecordFound) {
            return res.send(true);
        }

        const { ref, name, email, address, phone, department, yearOfPassing, homeTown, state, tenth, twelfth, aggregate } = req.body;

        let record = await new Records({
            name, email, address, phone, department, yearOfPassing, homeTown, state, tenth, twelfth, aggregate, user: req.user.id
        });

        let savedRecord = await record.save();

        res.json(savedRecord);


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error!");
    }
});




// [
//     body('fname', 'Enter a valid first name').isLength({ min: 3 }),
//     body('mname', 'Enter a valid middle name').isLength({ min: 3 }),
//     body('lname', 'Enter a valid last name').isLength({ min: 3 }),
//     body('email', 'Enter a valid email').isEmail(),
//     body('address', 'Enter a valid address').isLength({ min: 3 }),
//     body('phone', 'Enter a valid phone number').isMobilePhone(),
//     body('department', 'Enter a valid Department').isLength({ min: 2 }),
//     body('yearOfPassing', 'Enter a valid year').isLength({ min: 4, max: 4 }),
//     body('homeTown', 'Enter a valid home town').isLength({ min: 3 }),
//     body('state', 'Enter a valid state').isLength({ min: 3 }),
//     body('tenth', 'Enter a valid score').isLength({ min: 3 }),
//     body('twelfth', 'Enter a valid score').isLength({ min: 3 }),
//     body('aggregate', 'Enter a valid score').isLength({ min: 3 }),
// ],


// Route 3: Update an existing records of User using: PUT "/api/records/updaterecord". Login require Auth

router.put('/updaterecord/:id', fetchuser,  async (req, res) => {

    try {

        const { name, email, address, phone, department, yearOfPassing, homeTown, state, tenth, twelfth, aggregate, skills, course } = req.body;

        const newRecord = {};
        if(name) { newRecord.name = name}
        if(email) { newRecord.email = email}
        if(address) { newRecord.address = address}
        if(phone) { newRecord.phone = phone}
        if(department) { newRecord.department = department}
        if(yearOfPassing) { newRecord.yearOfPassing = yearOfPassing}
        if(homeTown) { newRecord.homeTown = homeTown}
        if(state) { newRecord.state = state}
        if(tenth) { newRecord.tenth = tenth}
        if(twelfth) { newRecord.twelfth = twelfth}
        if(aggregate) { newRecord.aggregate = aggregate}
        if(skills) { newRecord.skills = skills}
        if(course) { newRecord.course = course}

        console.log(req.params.id)

        // Find the note to be updated and update
        let record = await Records.findOne({ user: req.params.id});
        console.log(record._id, record.name,)

        if(!record) {return res.status(404).send("Not found!")}

        if(record.user.toString() !== req.user.id){return res.status(401).send("Not Allowed!")}

        record = await Records.findByIdAndUpdate(record._id, {$set: newRecord}, {new: true});
        res.json({record});


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error!");
    }
});



// Route 4: Get all the records of students by department using: GET "/api/records/fetchallstudentsbysearch". Login require Auth
router.post('/fetchallstudentsbysearch', async (req, res) => {
    try {


        const { department, skills, yearOfPassing } = req.body;
        // if(email !== 'ndesai171@gmail.com'){
        //     return res.status(400).send("Not valid credentials!");
        // }
        let records;
        if(department) { records = await Records.find({department: department}); }
        if(skills) { records = await Records.find({ skills: skills }); }
        if(yearOfPassing) { records = await Records.find({ yearOfPassing: yearOfPassing }); }

        if(department && skills) { records = await Records.find({ department: department, skills: skills }); }
        if(skills && yearOfPassing) { records = await Records.find({ skills: skills, yearOfPassing: yearOfPassing }); }
        if(department && yearOfPassing) { records = await Records.find({ department: department, yearOfPassing: yearOfPassing }); }

        if(department && skills && yearOfPassing) { records = await Records.find({ department: department, skills: skills, yearOfPassing: yearOfPassing }); }

        if(!(department && skills && yearOfPassing)) {
            records = await Records.find();
        }





        // Fetch all records
        // console.log(req.user, department)
        // const records = await Records.find({department: department});
        console.log(records)
        res.json(records);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error!");
    }
});


// // Route 5: Get all the records of students by skills using: GET "/api/records/fetchallstudentsbyskills". Login require Auth
// router.post('/fetchallstudentsbyskills', async (req, res) => {
//     try {

//         const { email, skills } = req.body;
//         if(email !== 'ndesai171@gmail.com'){
//             return res.status(400).send("Not valid credentials!");
//         }

//         // Fetch all records
//         console.log(req.user, skills)
//         const records = await Records.find({ skills: skills });
//         res.json(records);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error!");
//     }
// });


// // Route 6: Get all the records of students by yearOfPassing using: GET "/api/records/fetchallstudentsbypassingyear". Login require Auth
// router.post('/fetchallstudentsbypassingyear', async (req, res) => {
//     try {

//         const { yearOfPassing } = req.body;
//         // if(email !== 'ndesai171@gmail.com'){
//         //     return res.status(400).send("Not valid credentials!");
//         // }

//         // Fetch all records
//         console.log(req.user, yearOfPassing)
//         const records = await Records.find({ yearOfPassing: yearOfPassing});
//         res.json(records);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error!");
//     }
// });



module.exports = router;