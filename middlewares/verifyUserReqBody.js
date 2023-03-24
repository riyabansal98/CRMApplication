/**
 * This file will contain the middlewares for validating the userId and email
 */
 
const User = require("../models/user.model")
const constants = require("../utils/constants")


validateUserRequestBody = async(req, res, next) => {

    if(!req.body.name) {
        res.status(400).send({
            message: "Failed! Username is not provided !"
        });
        return;
    }

    if(!req.body.userId) {
        res.status(400).send({
            message: "Failed! UserId is not provided !"
        });
        return;
    }

    const user = await User.findOne({userId: req.body.userId});
    if(user != null) {
        res.status(400).send({
            message: "Failed! UserId already exists !"
        });
        return;
    }

    const email = await User.findOne({email: req.body.email});

    if(email != null) {
        res.status(400).send({
            message: "Failed! email already exists !"
        });
        return;
    }

    const userType = req.body.userType;
    const userTypes = [constants.userTypes.customer, 
        constants.userTypes.admin, constants.userTypes.engineer]

    if(userType  && !userTypes.includes(userType)) {
        res.status(400).send({
            message: "User type is invalid. Possible values CUSTOMER | ENGINEER | ADMIN"
        });
        return;
    }

    next();
}

validateUserStatusandUserType = async(req, res, next) => {

    const userType = req.body.userType;
    const userTypes = [constants.userTypes.admin, constants.userTypes.customer, constants.userTypes.admin]

    if(userType && !userTypes.includes(userType)) {
        res.status(400).send({
            message: "UserType provided is invalid. Possible values CUSTOMER | ENGINEER | ADMIN"
        });
        return;
    }

    const userStatus = req.body.userStatus;
    const userStatuses = [constants.userStatus.approved, constants.userStatus.pending, 
        constants.userStatus.rejected]

    if(userStatus && !userStatuses.includes(userStatus)) {
        res.status(400).send({
            message: "userStatus provided is invalid. Possible values APPROVED | REJECTED | PENDING"
        });
        return;
    }
    next()
}

const verifyUserReqBody = {
    validateUserRequestBody: validateUserRequestBody,
    validateUserStatusandUserType: validateUserStatusandUserType
}
module.exports = verifyUserReqBody