import { body } from "express-validator";

export default {
  phNum_email: [body("phone_number").notEmpty().withMessage("Phone number is required"), body("email").notEmpty().withMessage("Email is required")],
  phNum_or_email: [
    body().custom((value, { req }) => {
      if (!req.body.email && !req.body.phone_number) {
        throw new Error("Email or phone number is required");
      }
      return true;
    }),
  ],
  otp: [body("otp").notEmpty().withMessage("Otp is required")],
  google_id_token: [body("google_id_token").notEmpty().withMessage("Google id token is required")],
  password: [body("password").notEmpty().withMessage("Password is required")],
  newPass_cnfNewPass: [
    body("new_password").notEmpty().withMessage("New password is required"),
    body("confirm_new_password").notEmpty().withMessage("Confirm new password is required"),
    body("confirm_new_password").custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  crt_pass: [body("current_password").notEmpty().withMessage("Current password is required")],
};
