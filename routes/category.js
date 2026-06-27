const router = require("express").Router();

const auth = require("../middleware/auth");

const controller = require("../controllers/categoryController");

router.post("/", auth, controller.create);

router.get("/", auth, controller.getAll);

router.put("/:id", auth, controller.update);

router.delete("/:id", auth, controller.remove);

module.exports = router;