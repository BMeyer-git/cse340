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

/* **************************************
* Build the classification view
* ************************************ */
Util.getSelectClassification = async function(){
  let grid
  let data = await invModel.getClassifications()
  grid = '<div id="informationPanel">'
    grid += '<section class="colorBox">'
      grid += '<label for="classification_id">Classification:</label><br>'
      grid += '<select id="classification_id" name="classification_id" form="addInventory" required value="<%= locals.classification_id %>">'
      data.rows.forEach((row) => {
        grid += '<option value="' + row.classification_id + '">' + row.classification_name
        grid += "</option>"
      })
      grid += "</select><br>"
      grid += '<form action="/inv/add-inventory" method="post" id="addInventory">'
        grid += '<label for="inv_make">Make:</label><br>'
        grid += '<input type="text" id="inv_make" name="inv_make" required><br>'
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

module.exports = Util