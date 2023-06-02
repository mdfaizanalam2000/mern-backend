const express = require("express");
const router = express.Router();
const User = require("./models/userSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("./authentication");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.use(express.json());

router.post("/registration", async (req, res) => {
    try {
        if (req.body.password != req.body.confirmPassword) {
            res.status(401).json({ error: "Passwords are not matching" });
        }
        else {
            const userData = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                profession: req.body.profession,
                age: req.body.age,
                password: req.body.password
            });
            const response = await userData.save();
            res.status(201).send(response);
        }
    } catch (e) {
        res.status(404).json({ error: "Sorry, Registration failed!" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(402).json({ message: "Fill both fields" });
        }
        const userData = await User.findOne({ email: email });
        if (!userData) {
            res.status(401).json({ message: "User not registered" });
        }
        else {
            if (await bcryptjs.compare(password, userData.password)) {
                const token = await userData.generateAuthToken();
                res.cookie("jwtToken", token, {
                    expires: new Date(Date.now() + 1000000),
                    httpOnly: true
                });
                res.status(200).json({ message: "Login successful" });
            }
            else {
                res.status(400).json({ message: "Invalid details" });
            }
        }

    } catch (error) {
        res.status(404).json({ error: "Internal server error" });
    }
})

router.post("/contact", authenticate, async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const userInfo = await User.findOne({ email });
        if (userInfo) {
            const userMessage = await userInfo.addMessage(message);
            await userInfo.save();
            res.status(201).json({ message: "message saved" });
        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/about", authenticate, (req, res) => {
    res.send(req.userInfo);
})

router.get("/getData", authenticate, (req, res) => {
    res.send(req.userInfo);
})

router.get("/logout", (req, res) => {
    res.clearCookie("jwtToken", { path: "/" });
    res.status(200).json({ message: "User logged out" });
})

module.exports = router;