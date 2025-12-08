let express = require("express");
let router = require("./routes/user.routes");
let mongooseConnect = require("./config/dbConnect");
let port = process.env.PORT;
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/user", router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  mongooseConnect();
});
