let express = require("express");
let user = require("../models/user.model");

let router = express.Router();

router.get("/all-users", async (req, res) => {
  try {
    let students = await user.find();
    res.status(200).json({ message: "All Users", data: students });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.get("/read-data/:id", async (req, res) => {
  try {
    let student = await user.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "User Not Found" });

    res.json({ message: "User Found", data: student });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.post("/create-data", async (req, res) => {
  try {
    let student = await user.create(req.body);
    res.status(200).json({ message: "User Created", data: student });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.put("/update-data/:id", async (req, res) => {
  try {
    let updateStudent = await user.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateStudent)
      return res.status(404).json({ message: "User Not Found" });

    res.status(200).json({ message: "User Updated", data: updateStudent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.delete("/delete-data/:id", async (req, res) => {
  try {
    let deleteStudent = await user.findByIdAndDelete(req.params.id, {
      new: true,
    });
    if (!deleteStudent)
      return res.status(404).json({ message: "User Not Found" });

    res.status(200).json({ message: "User Deleted", data: deleteStudent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});
module.exports = router;
