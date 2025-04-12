// Things that are well needed 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");
// building my account view route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.get("/login", accountController.buildLogin);
router.post(
  "/login",
  utilities.handleErrors(accountController.accountLogin)
);

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// my Route to logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

// Registration handlers
router.get("/registration", utilities.handleErrors(accountController.buildRegister));
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// this are update account handlers
router.get("/update/:accountId", utilities.handleErrors(accountController.buildUpdate));
router.post(
  "/update",
  regValidate.updateRules(), // TODO: This needs to have a separate rule set, without existing email check..unless...oh complex
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  );
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);


module.exports = router;


