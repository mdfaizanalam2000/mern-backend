const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "config.env" });

const db = process.env.DATABASE;
mongoose.connect(db).then(() => {
    console.log("Connection to database is successful");
}).catch(() => {
    console.log("Some error occured while connecting");
})