import * as OneSignal from "onesignal-node";
import { config } from "dotenv";
import path from "path";

config({ path: path.join(process.cwd(), ".env") });

const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID as string, process.env.ONESIGNAL_API_KEY as string, { apiRoot: process.env.ONESIGNAL_API_BASE_URL });

export interface INotificationPayload {
  heading: string;
  content: string;
  image?: string;
  data?: {
    activity?: string;
    id?: string;
  };
}

export default class Notification {
  private payload: INotificationPayload;

  constructor(payload: INotificationPayload) {
    this.payload = payload;
  }

  async send(userIds: string[] = []) {
    try {
      const notificationPayload = {
        headings: {
          en: this.payload?.heading,
        },
        contents: { en: this.payload?.content },
        big_picture: this.payload?.image,
        include_aliases: {
          external_id: userIds,
        },
        data: this.payload?.data,
        target_channel: "push",
      };
      return await client.createNotification(notificationPayload);
    } catch (error) {
      console.log("Error while sending notification: ", error);
    }
  }
}

/**
 * USE -
 *
 * new Notification({ heading: "Test Notification", content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry" }).send(["4b15c479491c4e138ca2f95746fe98b4"])
 */
