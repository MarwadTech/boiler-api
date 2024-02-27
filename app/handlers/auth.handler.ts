import { ApiError, ApiResponse } from "@libs/responses";
import { UserService, OtpService } from "@services";
import { catchAsync, signToken } from "@utils";
import { GoogleClient } from "@libs";

const otpService = new OtpService();

class AuthHandler extends UserService {
  checkUser = catchAsync(async (req, res) => {
    const [userWithPh, userWithEmail] = await Promise.all([this.get({ phone_number: req.body.phone_number }), this.get({ email: req.body.email })]);
    if (userWithPh) throw new ApiError(400, "Phone number already in use");
    if (userWithEmail) throw new ApiError(400, "Email already in use");
    otpService.send(req.body.phone_number);
    otpService.send(req.body.email);
    res.status(200).json(new ApiResponse(200, "Unique credentials confirmed", { next_route: "auth/verify-otp" }));
  });

  createUser = catchAsync(async (req, res) => {
    const isVerifiedOtpForEmail = await otpService.isVerified(req.body.phone_number_otp, req.body.phone_number, true);
    const isVerifiedOtpForPhNum = await otpService.isVerified(req.body.email_otp, req.body.email, true);
    if (!isVerifiedOtpForEmail || !isVerifiedOtpForPhNum) throw new ApiError(401, "Unable to create user", [{ field: "", message: "Incorrect otp or has been expired" }]);
    const newUser = await this.create({
      name: req.body.name,
      phone_number: req.body.phone_number,
      email: req.body.email,
      password: req.body.password,
    });
    newUser.password = undefined;
    const token = signToken(newUser.id);
    res.status(201).json(new ApiResponse(201, "User created successfully", { user: newUser, token }));
  });

  login = catchAsync(async (req, res) => {
    if (req.body.phone_number) {
      var user: any = await this.getByPhoneNumber(req.body.phone_number, { scope: "full" });
    } else {
      user = await this.getByEmail(req.body.email, { scope: "full" });
    }
    const [isValidPass, token] = await Promise.all([user?.correctPassword(req.body.password), signToken(user?.id as string)]);
    if (!isValidPass) throw new ApiError(401, "Unable to login", [{ field: "", message: "Incorrect phone number or password" }]);
    user.password = undefined;
    res.status(200).json(new ApiResponse(200, "Login successfully", { user, token }));
  });

  loginWithGoogle = catchAsync(async (req, res) => {
    try {
      const ticket = await GoogleClient.verifyIdToken({ idToken: req.body.google_id_token, audience: process.env.CLIENT_ID });
      var userInfo = ticket.getPayload();
    } catch (error) {
      throw new ApiError(400, "Unable to login", [{ field: "google_id_token", message: "Invalid google id token" }]);
    }
    const user = await this.getByEmail(userInfo?.email as string, { throwError: true });
    const token = signToken(user?.id as string);
    res.status(200).json(new ApiResponse(200, "Login successfully", { user, token }));
  });

  resetPassword = catchAsync(async (req, res) => {
    const user: any = await this.getByEmailOrPhone(req.body.phone_number || req.body.email);
    const [isVerifiedOtp, token] = await Promise.all([otpService.isVerified(req.body.otp, req.body.phone_number || req.body.email, true), signToken(user?.id as string)]);
    if (!isVerifiedOtp) throw new ApiError(401, "Failed to verify otp", [{ field: "", message: "Incorrect otp or has been expired" }]);
    await user?.update({ password: req.body.new_password });
    user.password = undefined;
    res.status(200).json(new ApiResponse(200, "Login successfully", { user, token }));
  });

  forgotPassword = catchAsync(async (req, res) => {
    await this.getByEmailOrPhone(req.body.phone_number || req.body.email);
    otpService.send(req.body.phone_number || req.body.email);
    res.status(200).json(new ApiResponse(200, "Otp sent successfully", { next_route: "auth/otp/verify" }));
  });

  sendOtp = catchAsync(async (req, res) => {
    otpService.send(req.body.phone_number || req.body.email);
    res.status(200).json(new ApiResponse(200, "Otp sent successfully", { next_route: "auth/otp/verify" }));
  });

  verifyOtp = catchAsync(async (req, res) => {
    const hasBeenVerified = await otpService.verify(req.body.otp, req.body.phone_number || req.body.email);
    if (!hasBeenVerified) throw new ApiError(401, "Failed to verify otp", [{ field: "", message: "Incorrect otp or has been expired" }]);
    res.status(200).json(new ApiResponse(200, "Otp has been verified successfully"));
  });
}

export default new AuthHandler();
