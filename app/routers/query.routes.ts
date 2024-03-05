import express from "express";
import { queryHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();

router.route("/").post(authMiddlewares.protect, authMiddlewares.restrictTo("user"), queryHandlers.post).get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), queryHandlers.all);

router.route("/:id").get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), queryHandlers._getById);

export default router;
