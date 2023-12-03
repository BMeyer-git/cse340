// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const invValidate = require("../utilities/inventory-validation")
const auth = require('../utilities/access-authorization')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory item by detail view
router.get("/detail/:invId", invController.buildDetailByInvId);

// Route for inventory management view
router.get("/", auth.isEmployee, invController.buildManagement);

// Route for add classification view
router.get("/add-classification", auth.isEmployee, invController.buildAddClassification);

// Route to add a new classification
router.post(
    '/add-classification',
    auth.isEmployee,
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

// Route for add vehicle view
router.get("/add-inventory", auth.isEmployee, invController.buildAddInventory);

// Route to add a new vehicle
router.post(
    '/add-inventory',
    auth.isEmployee,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

// Route to getinventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route for editing inventory items
router.get("/edit/:invId", auth.isEmployee, utilities.handleErrors(invController.buildEditInventory));

//Route for update requests
router.post(
    "/update/",
    auth.isEmployee,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.updateInventory))

//Route for deleting inventory items
router.get("/delete/:invId", auth.isEmployee, utilities.handleErrors(invController.buildDeleteInventory));

//Route for delete requests
router.post(
    "/delete/",
    auth.isEmployee,
    utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;