const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
  const nav = await utilities.getNav()
  const header = await utilities.getHeader(req, res)
  res.render("index", {
    title: "Home",
    header,
    nav,
    errors: null,
  })
}

module.exports = baseController