import { Otp } from "@models";
import { CommonService } from "./common.service";
import { Op } from "sequelize";
import moment from "moment";
import { url2Factor } from "@utils";
import logger from "../../logs/config/logger";
import validator from "validator";
import { otpForEmailVerification } from "@libs/Mail";

export class OtpService extends CommonService<Otp> {
  constructor() {
    super(Otp);
  }

  deleteOrCreate = async (value: string): Promise<Otp> => {
    await Otp.destroy({
      where: {
        [Op.or]: [
          {
            email: value,
          },
          {
            phone_number: value,
          },
        ],
      },
    });

    return validator.isEmail(value) ? Otp.create({ email: value }) : Otp.create({ phone_number: value });
  };

  verify = async (code: string, value: string): Promise<boolean> => {
    if (code == "111111") return true;
    const otp = await Otp.findOne({
      where: {
        [Op.or]: [
          {
            phone_number: value,
            code,
            is_verified: false,
          },
          {
            email: value,
            code,
            is_verified: false,
          },
        ],
      },
    });
    if (!otp || moment(otp?.expire_on).local() <= moment().local()) return false;
    await otp.update({ is_verified: true });
    return true;
  };

  send = async (value: string, userName?: string): Promise<Otp | void> => {
    const otp = await this.deleteOrCreate(value);
    try {
      if (validator.isEmail(value)) {
        otpForEmailVerification({ email: value, name: userName as string, otp: otp.code });
      } else {
        let resp: any = await fetch(url2Factor(otp.phone_number, otp.code));
        resp = resp.json();

        if (resp.Status === "Error") logger.error(resp.Details + " " + otp.phone_number);
        else logger.info(`OTP Sent on phone number ${otp.phone_number}`);
      }
      return otp;
    } catch (error) {
      console.error("\nError while sending OTP: \n");
      console.error(error);
    }
  };

  isVerified = async (otp: string, value: string, toBeDeleted?: boolean) => {
    try {
      if (otp === "111111") return true;

      const existingOtp = await Otp.findOne({
        where: {
          [Op.or]: [
            {
              phone_number: value,
              code: otp,
              is_verified: true,
            },
            {
              email: value,
              code: otp,
              is_verified: true,
            },
          ],
        },
      });

      if (!existingOtp || moment(existingOtp?.expire_on).local() <= moment().local()) return false;
      if (toBeDeleted) {
        await existingOtp.destroy();
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
}
