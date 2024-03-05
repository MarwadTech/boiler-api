import { Media } from "@models";
import { CommonService } from "./common.service";
import path from "path";
import fs from "fs/promises";

export class MediaService extends CommonService<Media> {
  constructor() {
    super(Media);
  }

  upload = (image: any) => {};

  delete = (image: any) => {
    const types = ["thumbnail", "medium", "large"];
    types.forEach((type) => {
      fs.rm(path.join(process.cwd(), `public/images/${image.model_type}/${image[`pic_${type}`].split("/").pop()}`), { recursive: true });
    });
  };
}
