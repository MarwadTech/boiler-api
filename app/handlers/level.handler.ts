import { ApiResponse, ApiError } from "@libs/responses";
import { catchAsync } from "@utils";
import { LevelService } from "@services";

class LevelHandler extends LevelService {
  _getAll = catchAsync(async (req, res) => {
    const levels = await this.getAll();
    res.status(200).json(new ApiResponse(200, "Levels fetched successfully", levels));
  });

  add = catchAsync(async (req, res) => {
    const level = await this.create(req.body);
    res.status(201).json(new ApiResponse(201, "Levels added successfully", level));
  });

  update = catchAsync(async (req, res) => {
    const level = await this.updateById(req.params.id, req.body);
    res.status(200).json(new ApiResponse(200, "Levels updated successfully", level));
  });

  delete = catchAsync(async (req, res) => {
    const level = await this.deleteById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Levels deleted successfully", level));
  });
}

export default new LevelHandler();
