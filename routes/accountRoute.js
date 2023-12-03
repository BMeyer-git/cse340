// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const baseController = require('../controllers/baseController')

// Route to build login view
router.get("/login", accountController.buildLogin);

// Route to build register view
router.get("/register", accountController.buildRegistration);

// Route to build account view
router.get("/", utilities.checkLogin, accountController.buildAccount);

// Route to post register data
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount));

// Route to build update account information view
router.get("/edit", utilities.checkLogin, accountController.buildUpdateAccount);

// Route to post updated account information
router.post(
    "/edit",
    utilities.handleErrors(accountController.updateAccount));

// Route to post updated passwords
router.post(
    "/editPass",
    utilities.handleErrors(accountController.updatePassword));

// Route to logout
router.get(
    "/logout",
    utilities.handleErrors(accountController.logoutAccount));

module.exports = router;