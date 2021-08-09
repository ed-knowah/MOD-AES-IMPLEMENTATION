const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileController");
const multer = require("multer");
const isAuth = require("../controllers/auth").isAuth;

// files to accept
const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "video/mp4": "mp4",
  "audio/mpeg": "mp3",
  "text/plain": "txt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel.sheet.macroEnabled.12": "xlsm",
  "application/vnd.ms-excel": "xls",
  "application/pdf": "pdf",
};

//file storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid file type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/encrypt", isAuth, fileController.getUploadForm);
router.get("/decrypt", isAuth, fileController.getDownloadForm);

router.post(
  "/encrypt",
  uploadOptions.single("file"),
  fileController.encryptFile
);
router.post("/decrypt", fileController.decryptFile);

module.exports = {
  router,
};
