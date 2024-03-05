import { ApiError, ApiResponse } from "@libs/responses";
import { QueryService } from "@services";
import { catchAsync } from "@utils";

class ReviewHandler extends QueryService {
  post = catchAsync(async (req, res) => {
    const query = await this.create({ user_id: req.user?.id, category: req.body.category, query: req.body.query });
    res.status(201).json(new ApiResponse(201, "Query posted successfully", query));
  });

  _getById = catchAsync(async (req, res) => {
    const query = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Query fetched successfully", query));
  });

  all = catchAsync(async (req, res) => {
    const queries = await this.getPaginated(req.query);
    res.status(200).json(new ApiResponse(200, "Queries fetched successfully", queries));
  });
}

export default new ReviewHandler();
