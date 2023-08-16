const express = require("express");
const logger = require("morgan");
const cors = require("cors");

require("dotenv").config();
require("./config/database");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use("/users", require("./routes/users"));
app.use("/items", require("./routes/items"));
app.use("/orders", require("./routes/orders"));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})
