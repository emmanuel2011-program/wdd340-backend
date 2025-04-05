// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
// building my account view route
router.get("/account", utilities.handleErrors(accountController.buildAccount));
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.get("/login", accountController.buildLogin);
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
// my processing of login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  (req, res) => {
    res.status(200).send('login process')
  }
)




module.exports = router;