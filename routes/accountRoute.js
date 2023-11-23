// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")

// Route to build login view
router.get("/login", accountController.buildLogin);

// Route to build register view
router.get("/register", accountController.buildRegistration);

// Route to post register data
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;