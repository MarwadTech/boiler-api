import { Notification } from "@models";
import { CommonService } from "./common.service";

export class NotificationService extends CommonService<Notification> {
  constructor() {
    super(Notification);
  }
}
