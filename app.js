require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { sequelize } = require("./models");

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));;
app.use(morgan("dev"));
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/category", require("./routes/category"));
app.use("/api/product", require("./routes/product"));
app.use("/api/upload", require("./routes/upload"));

sequelize.sync()
.then(() => {
    console.log("Database Connected");
});

app.listen(process.env.PORT, () => {
    console.log(`Server Running on ${process.env.PORT}`);
});