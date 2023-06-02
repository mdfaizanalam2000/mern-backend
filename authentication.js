const jwt = require("jsonwebtoken");
const User = require("./models/userSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtToken;
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        const userInfo = await User.findOne({ _id: verify._id, "tokens.token": token });
        if (!userInfo) {
            throw new Error("User not found");
        }
        req.token = token;
        req.userInfo = userInfo;
        req.userID = userInfo._id;
        next();
    } catch (error) {
        res.status(401).json({ error: "Unauthorized user" });
    }
}

module.exports = authenticate;