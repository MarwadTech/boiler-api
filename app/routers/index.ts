import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import addressRoutes from "./address.routes";
import imageRoutes from "./image.routes";
import commondataRoutes from "./commondata.routes";
import levelRoutes from "./level.routes";
import reviewRoutes from "./review.routes";
import queryRoutes from "./query.routes";
// import notificationRoutes from "./notification.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/addresses", addressRoutes);
router.use("/images", imageRoutes);
router.use("/commondata", commondataRoutes);
router.use("/levels", levelRoutes);
router.use("/reviews", reviewRoutes);
router.use("/queries", queryRoutes);
// router.use("/notifications", notificationRoutes);

export default router;
