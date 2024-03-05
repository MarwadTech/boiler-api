import express from "express";
import { addressHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();

router
  .route("/")
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), addressHandlers._getAll)
  .post(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), addressHandlers.add);

router
  .route("/:id")
  .put(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), addressHandlers.update)
  .delete(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), addressHandlers.delete);

router.route("/:id/default").patch(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), addressHandlers.makeDefault);

export default router;
