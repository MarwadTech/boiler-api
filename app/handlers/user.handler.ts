import { ApiResponse } from "@libs/responses";
import { catchAsync } from "@utils";
import { em } from "../index";
import { UserService } from "@services";

class UserHandler extends UserService {
  createUser = catchAsync(async (req, res) => {
    const user = await this.create(req.body);
    delete user.password;
    em.emit("REGISTER", user);
    res.status(201).json(new ApiResponse(200, "User created successfully", user));
  });

  getUser = catchAsync(async (req, res) => {
    const user = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
  });

  updateUser = catchAsync(async (req, res) => {
    const user = await this.updateById(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, "User updated successfully", user));
  });

  deleteUser = catchAsync(async (req, res) => {
    const user = await this.deleteById(req.params.id);
    res.status(200).json(new ApiResponse(200, "User deleted successfully", user));
  });

  getAllUsers = catchAsync(async (req, res) => {
    const users = await this.getAll(req.query);
    res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
  });
}

export default new UserHandler();
