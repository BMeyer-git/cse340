// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const invValidate = require("../utilities/inventory-validation")

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
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

// Route for add vehicle view
router.get("/add-inventory", invController.buildAddInventory);

// Route to add a new vehicle
router.post(
    '/add-inventory',
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory));

// Route to getinventory
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route for editing inventory items
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventory));

//Route for update requests
router.post(
    "/update/",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.updateInventory))

//Route for deleting inventory items
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteInventory));

//Route for delete requests
router.post(
    "/delete/",
    utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;