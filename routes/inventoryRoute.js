// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item by detail view
router.get("/detail/:invId", invController.buildDetailByInvId);

// Route for inventory management view
router.get("/", invController.buildManagement);

// Route for add classification view
router.get("/add-classification", invController.buildAddClassification);

// Route to add a new classification
router.post(
    '/add-classification',
    utilities.handleErrors(invController.addClassification));

module.exports = router;