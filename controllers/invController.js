const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = await invModel.getClassificationName(classification_id)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory details by id
 * ************************** */
invCont.buildDetailByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getDetailByInvId(inv_id)
  const detail = await utilities.buildDetailView(vehicle)
  let nav = await utilities.getNav()
  const vehicleName = vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detail,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classResult = await invModel.addClassification(
    classification_name,
  )

  if (classResult) {
    req.flash(
      "notice",
      `Success, you\'ve added ${classification_name} to the list.`
    )
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors:null
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let grid = await utilities.getSelectClassification()
  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    grid,
    errors: null,
  })
}

/* ****************************************
*  Process new vehicle
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  
  const regResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  
  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${inv_year} ${inv_make} ${inv_model} to the inventory.`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the vehicle addition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      errors:null
    })
  }
}

module.exports = invCont