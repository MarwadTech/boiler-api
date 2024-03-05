import express from "express";
import { commonDataHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();

router.route("/").post(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), commonDataHandlers.add).get(commonDataHandlers.all);

router
  .route("/:key")
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("admin", "user"), commonDataHandlers._getByKey)
  .patch(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), commonDataHandlers._updateByKey)
  .delete(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), commonDataHandlers._deleteByKey);

export default router;
