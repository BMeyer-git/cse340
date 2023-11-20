const invModel = require("../models/inventory-model")
const Util = {}

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
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
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
    grid += '<ul id="detail-specifications">'
    grid += '<li>Make: ' + vehicle.inv_make + '</li>'
    grid += '<li>Model: ' + vehicle.inv_model + '</li>'
    grid += '<li>Year: ' + vehicle.inv_year + '</li>'
    grid += '<li>Price: $'
    + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</li>'
    grid += '<li>Miles: '
    + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</li>' + '</li>'
    grid += '</ul>'
    grid += '</div>'
    grid += '</div>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return grid
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util