
exports.userResponse = (users) => {

    userResult = [];
    users.forEach(user => {
        userResult.push({
            name: user.name,
            userId: user.userId,
            email: user.email,
            userTypr: user.userType,
            userStatus: user.userStatus
        });
    });

    return userResult;
}