import express from "express";
import { userHandlers } from "@handlers";
import { authMiddlewares, validatorMiddlewares } from "@middlewares";
import { authValidator } from "@validators";

const router = express.Router();

router
  .route("/me")
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("user"), userHandlers.getAuthUser)
  .patch(authMiddlewares.protect, authMiddlewares.restrictTo("user"), userHandlers.updateAuthUser)
  .delete(authMiddlewares.protect, authMiddlewares.restrictTo("user"), userHandlers.deleteAuthUser);

router
  .route("/me/update-password")
  .post(authMiddlewares.protect, authMiddlewares.restrictTo("user"), authValidator.crt_pass, authValidator.newPass_cnfNewPass, validatorMiddlewares.validate, userHandlers.updatePassword);

//**ADMIN**//

router.route("/").get(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), userHandlers.getAllUsers);

router
  .route("/:id")
  .get(authMiddlewares.protect, authMiddlewares.restrictTo("admin", "user"), userHandlers._getById)
  .put(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), userHandlers._updateById)
  .delete(authMiddlewares.protect, authMiddlewares.restrictTo("admin"), userHandlers._deleteById);

//**ADMIN**//

export default router;
