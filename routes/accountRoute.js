const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Account Management View Route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

// Registration Routes
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Login Routes
router.get("/login", accountController.buildLogin);
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
);

// Logout Route
router.get("/logout", accountController.accountLogout);

// Account Update Routes
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update",
  regValidate.updateRules(), // Use separate validation rules for update
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Password Update Routes
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;
