/**
 * This controller exists to create an exception for testing
 */

const intentionalErrorswitch = {};

intentionalErrorswitch.causeError = async function(req, res, next) {
    console.log("Causing an error...");
    let aNumber = 1/0;
    throw new Error("This is an intentional error.");
    //render templates expect data that is not being provided. that will also cause an exception.
    res.render("./", {
        title: "Intentional Error",
    })
}

module.exports = intentionalErrorswitch;