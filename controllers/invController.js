const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const className = await invModel.getClassificationName(classification_id)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    header,
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
  let header = await utilities.getHeader(req, res)
  const vehicleName = vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    header,
    detail,
    errors: null,
  })
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)

  const classificationSelect = await utilities.getClassificationSelectList()

  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    header,
    classificationSelect,
    errors: null,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    header,
    errors: null,
  })
}

/* ****************************************
*  Process new classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
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
      header,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the classification addition failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      header,
      errors:null
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const classificationSelect = await utilities.getClassificationSelectList()

  res.render("./inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    header,
    classificationSelect: classificationSelect,
    errors: null
  })
}

/* ****************************************
*  Process new vehicle
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, classification_id } = req.body
  const classificationSelect = await utilities.getClassificationSelectList()
  
  const invResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
  
  if (invResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added the ${inv_year} ${inv_make} ${inv_model} to the inventory.`
    )
    res.status(201).render("inventory/management", {
      title: "Manage Inventory",
      nav,
      header,
      classificationSelect: classificationSelect,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the vehicle addition failed.")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      header,
      classificationSelect: classificationSelect,
      errors:null
    })
  }
}

/* ****************************************
*  Update a vehicle
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationSelectList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    header,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const data = await invModel.getDetailByInvId(inv_id)
  const classificationSelect = await utilities.getClassificationSelectList2(data.classification_id)
  const name = `${data.inv_make} ${data.inv_model}`

  

  res.render("./inventory/edit-inventory", {
    title: "Edit" + name,
    nav,
    header,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const data = await invModel.getDetailByInvId(inv_id)
  const classificationSelect = await utilities.getClassificationSelectList2(data.classification_id)
  const name = `${data.inv_make} ${data.inv_model}`

  

  res.render("./inventory/delete-confirm", {
    title: name,
    nav,
    header,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id
  })
}

/* ****************************************
*  Delete a vehicle
* *************************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const {inv_id} = req.body
  const updateResult = await invModel.deleteInventoryItem(inv_id)

  if (updateResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.getClassificationSelectList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delete failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    header,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build inventory details by id
 * ************************** */
invCont.buildBuyByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const vehicle = await invModel.getDetailByInvId(inv_id)
  const buy = await utilities.buildBuyView(vehicle, res.locals.accountData.account_id)
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const vehicleName = vehicle.inv_make + " " + vehicle.inv_model
  res.render("./inventory/buy-inventory", {
    title: "Purchase Confirmation for " + vehicleName,
    nav,
    header,
    buy,
    errors: null,
  })
}

/* ****************************************
*  Purchase a vehicle
* *************************************** */
invCont.buyInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  let header  = await utilities.getHeader(req, res)
  let name = res.locals.account_name
  let accountType = res.locals.account_type
  let accountId = res.locals.accountData.account_id
  const {inv_id} = req.body
  const account = res.locals.accountData
  const purchaseResult = await invModel.buyInventoryItem(inv_id, account)

  if (purchaseResult) {
    // Potentially redefine header here if funds are to be displayed there too
    //req.res.locals.accountData.account_wallet = purchaseResult
    res.locals.accountData.account_wallet = purchaseResult
    let funds = purchaseResult
    req.flash("notice", `The vehicle was successfully purchased.`)
    res.status(201).render("account/account",
    {
      title: "Account Management",
      nav,
      header,
      funds,
      name,
      accountType,
      errors: null
    })
  } else {
    header  = await utilities.getHeader(req, res)
    let name = res.locals.accountData.account_firstname
    let funds = await accountModel.getAccountWallet(accountId)
    req.flash("notice", "Sorry, the purchase failed. Do you have enough funds?")
    res.status(501).render("account/account", {
    title: "Account Management",
    nav,
    header,
    name,
    accountType,
    accountId,
    funds,
    errors: null,
    })
  }
}

module.exports = invCont