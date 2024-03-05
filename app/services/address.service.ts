import { Address } from "@models";
import { CommonService } from "./common.service";
import { ApiError } from "@libs/responses";

export class AddressService extends CommonService<Address> {
  constructor() {
    super(Address);
  }

  addMyAddress = async (userId: string, payload: any): Promise<Address> => {
    const address = await this.create({ user_id: userId, ...payload });
    if (address.is_default) return address;
    const addresses = await this.model.findAll({ where: { user_id: userId, is_default: true }, raw: true });
    return addresses.length !== 0 ? address : address.makeDefault(userId);
  };

  updateMyAddress = async (addressId: string, userId: string, payload: any): Promise<Address> => {
    const address = await this.get({ id: addressId, user_id: userId });
    payload.user_id = undefined;
    payload.is_default = undefined;
    if (address) return address?.update(payload);
    throw new ApiError(404, "Address not found");
  };

  deleteMyAddress = async (addressId: string, userId: string): Promise<Address> => {
    const address = await this.get({ id: addressId, user_id: userId });
    if (!address) throw new ApiError(404, "Address not found");
    await address.destroy();
    if (address.is_default) {
      const newDefaultAddress = await this.model.findOne({ where: { user_id: userId }, order: [["created_at", "DESC"]] });
      if (newDefaultAddress) return newDefaultAddress.makeDefault(userId);
    }
    return address;
  };

  override getAll = async (userId: string): Promise<Address[]> => {
    return this.model.findAll({
      where: { user_id: userId },
      order: [
        ["is_default", "DESC"],
        ["created_at", "DESC"],
      ],
    });
  };
}
