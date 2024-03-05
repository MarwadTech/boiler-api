import { ApiError, ApiResponse } from "@libs/responses";
import { CommonDataService } from "@services";
import { catchAsync } from "@utils";

class CommonDataHandler extends CommonDataService {
  add = catchAsync(async (req, res) => {
    const commondata = await this.create({ key: req.body.key, data: req.body.data });
    res.status(201).json(new ApiResponse(201, "Common data added successfully", commondata));
  });

  _getByKey = catchAsync(async (req, res) => {
    const commondata = await this.getByKey(req.params.key);
    res.status(200).json(new ApiResponse(200, "Common data fetched successfully", commondata));
  });

  _updateByKey = catchAsync(async (req, res) => {
    const commondata = await this.updateByKey(req.params.key, req.body);
    res.status(200).json(new ApiResponse(200, "Common data updated successfully", commondata));
  });

  _deleteByKey = catchAsync(async (req, res) => {
    const commondata = await this.deleteByKey(req.params.key);
    res.status(200).json(new ApiResponse(200, "Common data deleted successfully", commondata));
  });

  all = catchAsync(async (req, res) => {
    const commondata = await this.getAll();
    res.status(200).json(new ApiResponse(200, "Common data fetched successfully", commondata));
  });
}

export default new CommonDataHandler();
