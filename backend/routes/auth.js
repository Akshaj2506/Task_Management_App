const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();
const bcryptjs = require("bcryptjs");
const fetchUser = require('../middleware/fetchuser');
let status = false;

// Creating an endpoint for User using POST request route: "/api/auth/create"; No Login Required
router.post('/create',
   [
      body('name', "Minimum length of name should be 4 characters").isLength({ min: 4 }),
      body('password', "Password is not strong enough").isStrongPassword()
   ]
   , async (req, res) => {
      // Checking for any sort of errors in the request, return errors
      const errors = validationResult(req);
      if (!(errors.isEmpty())) {
         status = false;
         res.status(400).json({
            errors: errors.array(),
            success: status
         });
      } else {
         // Checking if the user already exists
         const user = await User.findOne({ email: req.body.email });
         if (user) {
            success = false;
            return res.status(400).json({
               error: "User already exists",
               success: status
            });
         }
         // Create user if no issues found
         const { name, password } = req.body;
         try {
            const salt = await bcryptjs.genSalt(10);
            const secPass = await bcryptjs.hash(password, salt);
            const createdUser = await User.create({
               name: name,
               password: secPass
            })
            success = true
            res.status(200).json({
               success: status,
               user : createdUser
            });
         } catch (err) {
            success = false
            res.status(500).json({
               error: err.message,
               success: status
            });
         }
      }
   }
);

// Authenticate a user using POST request route "/api/auth/login"
/* 
   @params: 
    -> Username (Check for: Valid email)
    -> Password (Check for: isLength > 5)
*/
router.post('/login',
   [
      body('name', "Enter a valid username").isLength({min: 4}),
      body('password', "Enter a password of more than 5 characters").isLength({ min: 5 })
   ], async (req, res) => {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
         success = false
         return res.status(400).json({
            errors: errors.array(),
            success: status
         });
      }
      try {
         const { name, password } = req.body;
         const user = await User.findOne({ name });
         // Checking if the user already exists
         if (!user) {
            status = false
            return res.status(400).json({
               error: "User does not exist",
               success: status
            });
         }
         const deHashedPassword = await bcryptjs.compare(password, user.password);
         // checking if the password is correct
         if (!deHashedPassword) {
            status = false
            return res.status(400).json({
               error: "Kindly enter correct credentials",
               success: status
            });
         }
         status = true;
         res.json({ name: user.name, success : status });
      } catch (error) {
         console.error(error.message);
         status = false;
         res.status(403).json({ error: "Internal Server Error", success: status });
      }
   }
)

module.exports = router;