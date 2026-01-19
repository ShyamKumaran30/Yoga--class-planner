const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");

const Teacher = require("../models/teacherModel");
const Asana = require("../models/asanaModel");
const authenticateToken = require("../Middleware/authRequest");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const multer = require("multer");
const fs = require("fs");

const uploadsDir = "uploads"; //directory existence check
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post(
  "/add-asana",
  authenticateToken,
  upload.array("image"),
  async (req, res) => {
    console.log("Request Body:", req.body);
    try {
      const userId = req.user.TeacherId;

      const user = await Teacher.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const addedById = userId;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }

      const existingAsana = await Asana.findOne({ name: req.body.name, addedById: userId });
      if (existingAsana) {
        return res.status(400).json({ message: "You have already added an asana with the same name" });
      }
      
      console.log("File buffer check - ", req.files);

      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          const uploadParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${addedById}/${Date.now()}-${file.originalname}`,
            Body: file.buffer,
            ACL: "public-read",
            ContentType: file.mimetype,
          };

          return await s3.upload(uploadParams).promise();
        })
      );

      const imageUrls = uploadResults.map((result) => result.Location);

      const newAsana = new Asana({
        name: req.body.name,
        description: req.body.description,
        benefits: req.body.benefits,
        image: imageUrls,
        asanaType: req.body.asanaType,
        addedByName: user.name,
        addedById: userId,
      });

      await newAsana.save();

      res.status(200).json({ message: "Asana added successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.get("/view-asanas", async (req, res) => {
  try {
    const asanas = await Asana.find();

    res.status(200).json({ asanas });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put(
  "/update/:id",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log(req.body);
      const asanaId = req.params.id;

      let asana = await Asana.findById(asanaId);

      if (!asana) {
        return res.status(404).json({ message: "Asana not found" });
      }

      if (req.body.name) {
        asana.name = req.body.name;
      }
      if (req.body.description) {
        asana.description = req.body.description;
      }
      if (req.body.benefits) {
        asana.benefits = req.body.benefits;
      }
      if (req.file) { 
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${asana.addedById}/${Date.now()}-${req.file.originalname}`,
          Body: req.file.buffer,
          ACL: "public-read",
          ContentType: req.file.mimetype,
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        asana.image = [uploadResult.Location]; 
      }

      if (req.body.deletedImages && req.body.deletedImages.length > 0) {
        asana.image = asana.image.filter(image => !req.body.deletedImages.includes(image));
      }
      if (req.body.asanaType) {
        asana.asanaType = req.body.asanaType;
      }

      asana = await asana.save();

      res.status(200).json({ message: "Asana updated successfully", asana });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const asanaId = req.params.id;

    const asana = await Asana.findById(asanaId);
    if (!asana) {
      return res.status(404).json({ message: "Asana not found" });
    }

    if (asana.addedById !== req.user.TeacherId) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    await Asana.findByIdAndDelete(asanaId);

    res.status(200).json({ message: "Asana deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/teacher-asanas", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.TeacherId;

    const asanas = await Asana.find({ addedById: userId });

    res.status(200).json({ asanas });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;