const express = require("express");
const app = express();
const port = 80 || process.env.PORT;

require("./db/connection");

app.use(require("./route"));

app.listen(port, () => {
    console.log("Server is listening on port " + port);
})