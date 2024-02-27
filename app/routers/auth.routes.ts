import express from "express";
import { authHandlers } from "@handlers";
import { validatorMiddlewares } from "@middlewares";
import { authValidator } from "@validators";

const router = express.Router();

router.route("/check-user").post(authValidator.phNum_email, validatorMiddlewares.validate, authHandlers.checkUser);

router.route("/verify-otp").post(authValidator.phNum_or_email, authValidator.otp, validatorMiddlewares.validate, authHandlers.verifyOtp);

router.route("/send-otp").post(authValidator.phNum_or_email, validatorMiddlewares.validate, authHandlers.sendOtp);

router.route("/create-user").post(authHandlers.createUser);

router.route("/login").post(authValidator.phNum_or_email, authValidator.password, validatorMiddlewares.validate, authHandlers.login);

router.route("/login/google").post(authValidator.google_id_token, validatorMiddlewares.validate, authHandlers.loginWithGoogle);

router.route("/forgot-password").post(authValidator.phNum_or_email, validatorMiddlewares.validate, authHandlers.forgotPassword);

router.route("/reset-password").post(authValidator.phNum_or_email, authValidator.otp, authValidator.newPass_cnfNewPass, validatorMiddlewares.validate, authHandlers.resetPassword);

export default router;
