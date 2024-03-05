import { Level } from "@models";
import { CommonService } from "./common.service";

export class LevelService extends CommonService<Level> {
  constructor() {
    super(Level);
  }
}
