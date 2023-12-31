const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '<hr />'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(vehicle){
  let grid
  if(vehicle){
    grid = '<div id="informationPanel">'
    grid +=  '<img src="' + vehicle.inv_thumbnail 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" />'
    grid += '<div class="specifications">'
    grid += '<hr/>'
    grid += '<h2>' 
    + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Specifications'
    grid += '</h2>'
    grid += '<h3>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    grid += '</h3>'
    grid += '<p>' + vehicle.inv_description + '</p>'
    grid += '<ul id="detail-specifications">'
    grid += '<li>Make: ' + vehicle.inv_make + '</li>'
    grid += '<li>Model: ' + vehicle.inv_model + '</li>'
    grid += '<li>Year: ' + vehicle.inv_year + '</li>'
    grid += '<li>Price: $'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
    grid += '<li>Miles: '
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>' + '</li>'
    grid += '</ul>'
    grid +=  '<a href="../../inv/buy/'+ vehicle.inv_id
    + '" title="Purchase ' + vehicle.inv_make + ' '+ vehicle.inv_model
    + '">Own the ' + vehicle.inv_make + ' '+ vehicle.inv_model + ' now!' + '</a>'
    grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

Util.getClassificationSelectList = async function(){
  let classList
  let data = await invModel.getClassifications()
  classList = '<label for="classification_id">Classification:</label><br>'
  classList += '<select id="classification_id" name="classification_id" form="addInventory" required>'
  data.rows.forEach((row) => {
    classList += '<option value="' + row.classification_id + '">' + row.classification_name
    classList += "</option>"
  })
  classList += "</select><br>"
  return classList
}

// Different version for different form
Util.getClassificationSelectList2 = async function(){
  let classList
  let data = await invModel.getClassifications()
  classList = '<label for="classification_id">Classification:</label><br>'
  classList += '<select id="classification_id" name="classification_id" form="updateInventory" required>'
  data.rows.forEach((row) => {
    classList += '<option value="' + row.classification_id + '">' + row.classification_name
    classList += "</option>"
  })
  classList += "</select><br>"
  return classList
}

/* **************************************
* Build the Inventory view
* ************************************ */
Util.getAddInventory = async function(){
  let grid
  grid = '<div id="informationPanel">'
    grid += '<section class="colorBox">'
      grid += await Util.getClassificationSelectList()
      grid += '<form action="/inv/add-inventory" method="post" id="addInventory">'
        grid += '<label for="inv_make">Make:</label><br>'
        grid += '<input type="text" id="inv_make" name="inv_make" required value="<%= locals.classification_name %>"><br>'
        grid += '<label for="inv_model">Model:</label><br>'
        grid += '<input type="text" id="inv_model" name="inv_model" required><br>'
        grid += '<label for="inv_year">Year:</label><br>'
        grid += '<input type="text" id="inv_year" name="inv_year" required><br>'
        grid += '<label for="inv_description">Description:</label><br>'
        grid += '<input type="text" id="inv_description" name="inv_description" required><br>'
        grid += '<label for="inv_price">Price:</label><br>'
        grid += '<input type="text" id="inv_price" name="inv_price" required><br>'
        grid += '<label for="inv_miles">Miles:</label><br>'
        grid += '<input type="text" id="inv_miles" name="inv_miles" required><br>'
        grid += '<label for="inv_color">Color:</label><br>'
        grid += '<input type="text" id="inv_color" name="inv_color" required><br>'
        grid += '<input type="submit" value="Add Vehicle">'
      grid += '</form>'
    grid += '</section>'
    grid += '<p class="colorBox">Name must be alphabetic characters only</p><br>'
  grid += '</div>'
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getHeader = async function (req, res, next) {
  let header = '<span class="siteName">'
  header += '<a href="/" title="Return to home page">CSE Motors</a>'
  header += '</span>'
  header += '<div id="tools">'
  if (!req.cookies.jwt) {
    header += '<a title="Click to log in" href="/account/login">My Account</a>'
  }
  else {
    let accountId = res.locals.accountData.account_id
    let funds = await accountModel.getAccountWallet(accountId)
    header += '<p>Balance: $' + funds + '</p>'
    header += '<a title="Click to manage account" href="/account/">Welcome, '
    header += res.locals.accountData.account_firstname
    header += '</a><br>'
    header += '<a title="Click to log out" href="/account/logout">Logout</a>'
  }
  header += '</div>'
  return header
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildBuyView = async function(vehicle, user_id){
  let buy
  if(vehicle){
    buy = '<div id="informationPanel">'
    buy +=  '<img src="' + vehicle.inv_thumbnail 
    +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
    +' on CSE Motors" />'
    buy += '<div class="specifications">'
    buy += '<hr/>'
    buy += '<h2>' 
    + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Specifications'
    buy += '</h2>'
    buy += '<h3>Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price)
    buy += '</h3>'
    buy += '<p>' + vehicle.inv_description + '</p>'
    buy += '<ul id="detail-specifications">'
    buy += '<li>Make: ' + vehicle.inv_make + '</li>'
    buy += '<li>Model: ' + vehicle.inv_model + '</li>'
    buy += '<li>Year: ' + vehicle.inv_year + '</li>'
    buy += '<li>Price: $'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
    buy += '<li>Miles: '
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>' + '</li>'
    buy += '</ul>'
    buy += '<form action="/inv/buy" method="post" id="buy">'
      buy += '<input type="hidden" name="inv_id"'
      buy += 'value="' + vehicle.inv_id + '">'
      buy += '<input type="hidden" name="account_id"'
      buy += 'value="' + user_id + '">'
      buy += '<input type="submit" value="Purchase Vehicle">'
    buy += '</form>'
    buy += '</div>'
    buy += '</div>'
  } else { 
    buy += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return buy
}

module.exports = Util