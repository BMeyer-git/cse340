const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const baseController = require("../controllers/baseController")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  res.render("account/login", {
    title: "Login",
    nav,
    header,
    errors: null,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  res.render("account/register", {
    title: "Register",
    nav,
    header,
    errors: null,
  })
}


/* ****************************************
*  Deliver register view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  let name = res.locals.accountData.account_firstname
  let accountType = res.locals.accountData.account_type
  let accountId = res.locals.accountData.account_id
  let funds = await accountModel.getAccountWallet(accountId)
  res.render("account/account", {
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

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      header,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      header,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      header,
      errors:null
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    header,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }


/* ****************************************
*  Deliver account update view
* *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  let account_firstname = res.locals.accountData.account_firstname
  let account_lastname = res.locals.accountData.account_lastname
  let account_email = res.locals.accountData.account_email
  let account_id = res.locals.accountData.account_id
  res.render("./account/update", {
    title: "Update Account information",
    nav,
    header,
    account_firstname,
    account_lastname,
    account_email,
    account_id,
    errors: null
  })
}

/* ****************************************
*  Process Account Information Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  
  
  const { account_firstname, account_lastname, account_email, account_id, account_type } = req.body

  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )
  
  let name = account_firstname
  let accountType = account_type
  if (updateResult) {
    const accountData = await accountModel.getAccountByEmail(account_email)
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    let header = await utilities.getHeader(req, res)
    let funds = res.locals.accountData.account_wallet
    req.flash(
      "notice",
      `Congratulations, you\'ve updated ${account_firstname}. Please enjoy your stay.`
    )
    res.status(201).render("account/account", {
      title: "Account Management",
      nav,
      header,
      name,
      funds,
      accountType,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, the information update failed.")
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      header,
      name,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      errors:null
    })
  }
}

/* ****************************************
*  Process Password Update
* *************************************** */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)
  const { account_password, account_id, account_firstname} = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      header,
      errors: null,
    })
  }

  const passwordResult = await accountModel.updatePassword(
    hashedPassword,
    account_id
  )
  
  let funds = res.locals.accountData.account_wallet
  let name = account_firstname
  let accountType = "Client"
  if (passwordResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve updated your password. Please enjoy your stay.`
    )
    res.status(201).render("account/account", {
      title: "Account Management",
      nav,
      header,
      name,
      funds,
      accountType,
      errors:null
    })
  } else {
    req.flash("notice", "Sorry, password update failed")
    res.status(501).render("account/update", {
      title: "Update Account Information",
      nav,
      header,
      name,
      account_firstname,
      account_id,
      errors:null
    })
  }
}

/* ****************************************
 *  Process logout request
 * ************************************ */
async function logoutAccount(req, res) {
  let nav = await utilities.getNav()
  let header = await utilities.getHeader(req, res)

  delete res.cookie("jwt")

  req.flash("notice", "Logout Success. Please come again!")
  res.redirect('/')
}


module.exports = { buildLogin, buildRegistration, registerAccount, loginAccount, buildAccount, buildUpdateAccount, updateAccount, updatePassword, logoutAccount }