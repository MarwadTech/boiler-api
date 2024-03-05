import { CommonData } from "@models";
import { CommonService, Options } from "./common.service";
import { ApiError } from "@libs/responses";

export class CommonDataService extends CommonService<CommonData> {
  constructor() {
    super(CommonData);
  }

  getByKey = async (key: string, options?: Options): Promise<CommonData | null> => {
    const data = await this.get({ key });
    if (!data && !options?.throwError) throw new ApiError(404, "Common data not found", [{ field: "key", message: `Common data does not exist by key ${key}` }]);
    return data;
  };

  updateByKey = async (key: string, update: any, options?: Options): Promise<CommonData | null> => {
    const data = await this.getByKey(key, options);
    return data?.update(update) || null;
  };

  deleteByKey = async (key: string, options?: Options): Promise<CommonData | null> => {
    const data = await this.getByKey(key, options);
    if (data?.key === "SIGNUP_COINS" || data?.key === "SPONSOR_COINS") {
      throw new ApiError(400, "You cannot delete this key", [
        {
          field: "key",
          message: "You cannot delete this key",
        },
      ]);
    } else await data?.destroy();
    await data?.destroy();
    return data;
  };

  getAll = async (): Promise<CommonData[]> => {
    return this.model.findAll();
  };
}
