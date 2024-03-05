import { ApiResponse, ApiError } from "@libs/responses";
import { catchAsync, saveImage } from "@utils";
import { MediaService } from "@services";

class ImageHandler extends MediaService {
  _getAll = catchAsync(async (req, res) => {
    const images = await this.getPaginated(req.query);
    res.status(200).json(new ApiResponse(200, "Images fetched successfully", images));
  });

  _upload = catchAsync(async (req, res) => {
    if (!req.file) throw new ApiError(400, "Validation Error", [{ field: "image", message: "Image is required" }]);
    const modelType = `${req.body.collection}s`;
    const collection = req.body.collection;
    const image = await this.create({
      model_id: null,
      model_type: modelType,
      collection: collection,
      name: req.file.originalname,
      type: "image",
      mime: req.file.mimetype,
      size: req.file.size,
      sort_order: req.body.sort_order,
    });
    const imagePaths = await saveImage(req, modelType);
    await image.update({ path: imagePaths?.large.url, pic_thumbnail: imagePaths?.thumbnail.url, pic_medium: imagePaths?.medium.url, pic_large: imagePaths?.large.url });
    res.status(200).json(new ApiResponse(200, "Image uploaded successfully", image));
  });

  _delete = catchAsync(async (req, res) => {
    const image = await this.getById(req.params.id);
    if (image?.model_id !== null) throw new ApiError(400, "Image is attached to other model");
    else await image?.destroy();
    this.delete(image);
    res.status(200).json(new ApiResponse(200, "Image deleted successfully", image));
  });
}

export default new ImageHandler();
