import { ApiResponse, ApiError } from "@libs/responses";
import { catchAsync } from "@utils";
import { NotificationService } from "@services";

class notificationHandler extends NotificationService {}

export default new notificationHandler();
