import express from "express";
import { reviewHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();

router
  .route("/app")
  .post(authMiddlewares.protect, authMiddlewares.restrictTo("user"), reviewHandlers.reviewApp)
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), reviewHandlers.appReviews);

router.route("/:userId").post(authMiddlewares.protect, authMiddlewares.restrictTo("user"), reviewHandlers.reviewUser);

router.route("/").get(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), reviewHandlers.reviews);

router.route("/:id").get(authMiddlewares.protect, authMiddlewares.restrictTo("user", "admin"), reviewHandlers.reviewByid);

router.route("/app/:id").get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), reviewHandlers.appReviewById);

export default router;
