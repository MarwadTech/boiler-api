import { Review } from "@models";
import { CommonService } from "./common.service";

export class ReviewService extends CommonService<Review> {
  constructor() {
    super(Review);
  }
}
