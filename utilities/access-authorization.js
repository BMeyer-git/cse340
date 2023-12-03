const utilities = require(".")
const { body, validationResult } = require("express-validator")
const authorize = {}
const accountModel = require("../models/account-model")


authorize.isEmployee = async (req, res, next) => {
    const {account_email } = req.body
    if (res.locals.accountData.account_type != "Employee" && res.locals.accountData.account_type != "Admin")
    {
        req.flash("notice", "You must be logged into an employee acount to access that page")
        let nav = await utilities.getNav()
        let header = await utilities.getHeader(req, res)
        res.render("account/login", {
          errors: null,
          title: "Login",
          nav,
          header,
          account_email,
        })
        return
    }
    next()
  }

  module.exports = authorize