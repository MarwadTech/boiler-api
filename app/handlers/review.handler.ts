import { ApiResponse, ApiError } from "@libs/responses";
import { catchAsync } from "@utils";
import { ReviewService, UserService } from "@services";
import { Review } from "@models";

const userService = new UserService();

class reviewHandler extends ReviewService {
  reviewApp = catchAsync(async (req, res) => {
    const user = await userService.get({ role: "admin" });
    const review = await super.create({ given_by: req.user?.id, taken_by: user?.id, comment: req.body.comment, value: req.body.value });
    await user?.reCalAvgRating();
    res.status(201).json(new ApiResponse(201, "Review added successfully", review));
  });

  appReviewById = catchAsync(async (req, res) => {
    const review = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Review fetched successfully", review));
  });

  appReviews = catchAsync(async (req, res) => {
    const reviews = await this.getPaginated(req.query);
    res.status(200).json(new ApiResponse(200, "Reviews fetched successfully", reviews));
  });

  reviewUser = catchAsync(async (req, res) => {
    const user = await userService.getById(req.params.userId);
    const review = await super.create({ given_by: req.user?.id, taken_by: user?.id, comment: req.body.comment, value: req.body.value });
    await user?.reCalAvgRating();
    res.status(201).json(new ApiResponse(201, "Review added successfully", review));
  });

  reviews = catchAsync(async (req, res) => {
    if (req.user?.role === "user") req.query.taken_by = req.user?.id;
    const reviews = await this.getPaginated(req.query);
    res.status(200).json(new ApiResponse(200, "Reviews fetched successfully", reviews));
  });

  reviewByid = catchAsync(async (req, res) => {
    const review = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Review fetched successfully", review));
  });
}

export default new reviewHandler();
