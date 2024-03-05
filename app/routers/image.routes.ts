import express from "express";
import { imageHandlers } from "@handlers";
import { authMiddlewares, multerMiddlewares } from "@middlewares";

const router = express.Router();

router
  .route("/")
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), imageHandlers._getAll)
  .post(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), multerMiddlewares.upload.single("image"), imageHandlers._upload);

router.route("/:id").delete(authMiddlewares.protect, authMiddlewares.restrictTo("admin", "user"), imageHandlers.delete);

export default router;
