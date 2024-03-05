import jwt from "jsonwebtoken";
import crypto from "crypto";
import { privateKey } from "../contants";

export const decodeToken = (token: string): { id: string } => {
  const { data }: any = jwt.verify(token, process.env.JWT_SECRET as string);

  let rawData: Buffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(data)
  );

  return JSON.parse(rawData.toString());
};
