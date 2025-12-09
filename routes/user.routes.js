let express = require("express");
let user = require("../models/user.model");
let multer = require("multer");
let path = require("path");
let fs = require("fs");

let router = express.Router();

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

let fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/png")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

let upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limit: {
    fileSize: 1024 * 1024 * 5, // 5mb
  },
});

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

router.post("/create-data", upload.single("profile_pic"), async (req, res) => {
  try {
    // let student = await user.create(req.body);
    console.log(req.body);
    let User = new user(req.body);
    if (req.file) {
      User.profile_pic = req.file.path;
    }

    let newUser = await User.save();
    res.status(200).json({ message: "User Created", data: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

router.put("/update/:id", upload.single("profile_pic"), async (req, res) => {
  try {
    let existingStudent = await user.findById(req.params.id);

    //if user does not exist means _id is available in db then we will not store image in uploads folder
    if (!existingStudent) {
      if (req.file.filename) {
        let profilePicPath = path.join("./uploads", req.file.filename);

        fs.unlink(profilePicPath, (err) => {
          if (err) console.log("Failed to delete profile pic", err);
        });
      }
      return res.status(404).json({ message: "User Not Found" });
    }

    //if user does exist means _id is available in db then we will store or update image in uploads folder and remove already existing image
    if (req.file) {
      if (existingStudent.profile_pic) {
        let oldPicPath = path.join(existingStudent.profile_pic);
        fs.unlink(oldPicPath, (err) => {
          if (err) console.log("Failed to Delete old pic", err);
        });
      }
      req.body.profile_pic = req.file.path;
    }

    let updatedStudent = await user.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "User Updated", data: updatedStudent });
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
    console.log(deleteStudent);
    if (!deleteStudent)
      return res.status(404).json({ message: "User Not Found" });
    if (deleteStudent.profile_pic) {
      let profilePicPath = path.join(deleteStudent.profile_pic);
      fs.unlinkSync(profilePicPath, (err) => {
        console.log("Failed to delete profile pic", err);
      });
    }

    res.json({ message: "User Deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

module.exports = router;
