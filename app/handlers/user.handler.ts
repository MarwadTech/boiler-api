import { ApiError, ApiResponse } from "@libs/responses";
import { catchAsync } from "@utils";
import { UserService, MediaService } from "@services";

const imageService = new MediaService();

class UserHandler extends UserService {
  getAuthUser = catchAsync(async (req, res) => {
    res.status(200).json(new ApiResponse(200, "User fetched successfully", req.user));
  });

  updateAuthUser = catchAsync(async (req, res) => {
    if (req.body.image_id) {
      await imageService.updateById(req.body.image_id, { model_id: req.user?.id });
      if (req.user?.avatar) {
        imageService.delete(req.user?.avatar);
        await req.user?.avatar?.destroy();
      }
    }
    await req.user?.update(req.body);
    res.status(200).json(new ApiResponse(200, "User fetched successfully", req.user));
  });

  deleteAuthUser = catchAsync(async (req, res) => {
    await req.user?.destroy();
    res.status(200).json(new ApiResponse(200, "User deleted successfully", req.user));
  });

  updatePassword = catchAsync(async (req, res) => {
    const user: any = await this.getByPhoneNumber(req.user?.phone_number as string, { scope: "full" });
    const isValidPass = await user?.correctPassword(req.body.current_password as string);
    if (!isValidPass) throw new ApiError(401, "Unable to update password", [{ field: "password", message: "Incorrect password" }]);
    await user?.update({ password: req.body.new_password });
    user.password = undefined;
    res.status(200).json(new ApiResponse(200, "User password updated successfully", user));
  });

  getAllUsers = catchAsync(async (req, res) => {
    const users = await this.getPaginated(req.query);
    res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
  });

  _getById = catchAsync(async (req, res) => {
    const user = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
  });

  _updateById = catchAsync(async (req, res) => {
    const user = await this.updateById(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, "User updated successfully", user));
  });

  _deleteById = catchAsync(async (req, res) => {
    const user = await this.deleteById(req.params.id);
    res.status(200).json(new ApiResponse(200, "User deleted successfully", user));
  });
}

export default new UserHandler();
