const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classificationame is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a classification name with ONLY alphabetic characters"), // on error this message is sent.
    ]
  }

/* ******************************
 * Check data and return errors or continue to add the new classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
}

/*  **********************************
 *  Inventory Item Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // make is required and must be string with no special characters
    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a make with ONLY alphabetic characters"), // on error this message is sent.

    // model is required and must be string with no special characters
    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a model with ONLY alphabetic characters"), // on error this message is sent.

    // valid year is required and must be at least a 4 digit calendar year
    body("inv_year")
      .trim()
      .isLength({ min: 4})
      .withMessage("Please choose a year after 999 at minimum")
      .isNumeric({ no_symbols:true })
      .withMessage("A valid year is required."),

    // description is required and must be string
    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a text description"), // on error this message is sent.

    // price is required and must be a number with no special characters
    body("inv_price")
      .trim()
      .isLength({ min: 1})
      .isNumeric({ no_symbols:true })
      .withMessage("A valid numeric price is required. No symbols"),

    // miles are required and must be a number with no special characters
    body("inv_price")
      .trim()
      .isLength({ min: 1})
      .isNumeric({ no_symbols:true })
      .withMessage("A valid mile count is required. No symbols"),
      
    body("inv_color")
      .trim()
      .isLength({ min: 1 })
      .isAlpha()
      .withMessage("Please provide a color with ONLY alphabetic characters. No spaces"), // on error this message is sent.
    
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const classificationSelect = await utilities.getClassificationSelectList()
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Vehicle",
      nav,
      classificationSelect,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}
  module.exports = validate