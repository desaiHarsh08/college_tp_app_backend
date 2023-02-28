const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Company = require('../models/Company');
const { body, validationResult } = require('express-validator');


// Route 1: Get all the records of User using: GET "/api/records/fetchallrecords". Login require Auth
// router.get('/fetchallrecords', fetchuser, async (req, res) => {
//     try {

//         // Fetch all records
//         console.log(req.user.id)
//         const records = await Records.findOne({ user: req.user.id });
//         res.json(records);
//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error!");
//     }
// });




// Route 2: Add the companies using: POST "/api/company/addcompany". Login require Auth
router.post('/addcompany',  [
    body('companyName', 'Enter a valid name').isLength({ min: 3 }),
    body('jobRole', 'Enter a valid jobRole').isLength({ min: 3 }),
    body('criteria', 'Enter a valid criteria').isLength({ min: 3 }),
    body('aboutCompany', 'Enter a valid aboutCompany').isLength({ min: 3 }),
    body('driveLink', 'Enter a valid driveLink').isLength({ min: 3 }),
    body('aboutCompany', 'Enter a valid aboutCompany').isLength({ min: 3 }),
], async (req, res) => {

    try {

        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        

        const { companyName, jobRole, criteria, driveLink, aboutCompany } = req.body;

        let company = await new Company({
            companyName, jobRole, criteria, aboutCompany, driveLink
        });

        let savedCompany = await company.save();

        res.json(savedCompany);


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

// router.put('/updaterecord/:id', fetchuser,  async (req, res) => {

//     try {

//         const { name, email, address, phone, department, yearOfPassing, homeTown, state, tenth, twelfth, aggregate } = req.body;

//         const newRecord = {};
//         if(name) { newRecord.name = name}
//         if(email) { newRecord.email = email}
//         if(address) { newRecord.address = address}
//         if(phone) { newRecord.phone = phone}
//         if(department) { newRecord.department = department}
//         if(yearOfPassing) { newRecord.yearOfPassing = yearOfPassing}
//         if(homeTown) { newRecord.homeTown = homeTown}
//         if(state) { newRecord.state = state}
//         if(tenth) { newRecord.tenth = tenth}
//         if(twelfth) { newRecord.twelfth = twelfth}
//         if(aggregate) { newRecord.aggregate = aggregate}

//         console.log(req.params.id)

//         // Find the note to be updated and update
//         let record = await Records.findOne({ user: req.params.id});
//         console.log(record._id, record.name,)

//         if(!record) {return res.status(404).send("Not found!")}

//         if(record.user.toString() !== req.user.id){return res.status(401).send("Not Allowed!")}

//         record = await Records.findByIdAndUpdate(record._id, {$set: newRecord}, {new: true});
//         res.json({record});


//     } catch (error) {
//         console.log(error);
//         res.status(500).send("Internal Server Error!");
//     }
// });



// Route 3: Get the latest company: GET "/api/company/getcompany". Login require Auth
router.get('/getcompany', async (req, res) => {
    try {

        const company = await Company.findOne().sort({ _id: -1}).limit(1);
        res.json(company);

    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error!");
    }
});




module.exports = router;