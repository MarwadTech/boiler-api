import express from "express";
import { userHandlers } from "@handlers";
import { authMiddlewares } from "@middlewares";

const router = express.Router();

router.route("/").post(authMiddlewares.protect, authMiddlewares.restrictTo("user"), userHandlers.createUser).get(userHandlers.getAllUsers);

router.route("/:id").get(userHandlers.getUser).patch(userHandlers.updateUser).delete(userHandlers.deleteUser);

export default router;
