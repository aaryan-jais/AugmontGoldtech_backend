const router = require("express").Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
const controller = require("../controllers/uploadController");

// Upload
router.post("/csv", auth, upload.single("file"), controller.uploadCSV);
router.post("/excel", auth, upload.single("file"), controller.uploadExcel);

// Download
router.get("/csv", auth, controller.downloadCSV);
router.get("/excel", auth, controller.downloadExcel);

module.exports = router;