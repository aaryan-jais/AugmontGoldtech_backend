const router = require("express").Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const controller = require("../controllers/productController");

router.post("/", auth, upload.single("image"), controller.create);

router.get("/", auth, controller.list);

router.put("/:id", auth, upload.single("image"), controller.update);

router.delete("/:id", auth, controller.delete);

module.exports = router;