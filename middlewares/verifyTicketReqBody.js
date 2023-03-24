const constants = require("../middlewares")

validateTicketRequestBody = async(req, res, next) => {

    if(!req.body.title) {
        res.status(400).send({
            message: "Failed! Title not provided"
        })
        return;
    }

    if(!req.body.description) {
        res.status(400).send({
            message: "Failed! Description not provided"
        })
        return;
    }

    next();
};

const verifyTicketRequestBody = {
    validateTicketRequestBody: validateTicketRequestBody
}

module.exports = verifyTicketRequestBody