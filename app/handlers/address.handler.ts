import { ApiResponse, ApiError } from "@libs/responses";
import { catchAsync } from "@utils";
import { AddressService } from "@services";

class AddressHandler extends AddressService {
  _getAll = catchAsync(async (req, res) => {
    const addresses = await this.getAll(req.user?.id as string);
    res.status(200).json(new ApiResponse(200, "Addresses fetched successfully", addresses));
  });

  add = catchAsync(async (req, res) => {
    const address = await this.addMyAddress(req.user?.id as string, req.body);
    res.status(201).json(new ApiResponse(201, "Address added successfully", address));
  });

  _getById = catchAsync(async (req, res) => {
    const address = await this.getById(req.params.id);
    res.status(200).json(new ApiResponse(200, "Address fetched successfully", address));
  });

  update = catchAsync(async (req, res) => {
    const address = await this.updateMyAddress(req.params.id, req.user?.id as string, req.body);
    res.status(200).json(new ApiResponse(200, "Address updated successfully", address));
  });

  delete = catchAsync(async (req, res) => {
    const address = await this.deleteMyAddress(req.params.id, req.user?.id as string);
    res.status(200).json(new ApiResponse(200, "Address deleted successfully", address));
  });

  makeDefault = catchAsync(async (req, res) => {
    const address = await this.updateMyAddress(req.params.id, req.user?.id as string, { is_default: true });
    await address.makeDefault(req.user?.id as string);
    res.status(200).json(new ApiResponse(200, "Address set to default successfully", address));
  });
}

export default new AddressHandler();
