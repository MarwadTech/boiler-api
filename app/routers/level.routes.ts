import express from "express";
import { levelHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();
router
  .route("/")
  .post(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), levelHandlers.add)
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("admin", "user"), levelHandlers._getAll);

router
  .route("/:id")
  .patch(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), levelHandlers.update)
  .delete(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), levelHandlers.delete);

export default router;
