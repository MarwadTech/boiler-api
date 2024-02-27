import { v4 } from "uuid";
import fs from "fs/promises";
import path from "path";
import { Request } from "express";

export const uuid = (DataTypes: any) => {
  return {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => {
      return v4().replace(/-/g, "");
    },
  };
};

export const storeImage = (dest: string, image: any) => {
  const imgPath = `public/templetes/${Date.now() + Math.ceil(Math.random() * 1e5)}`;
  fs.writeFile(path.join(process.cwd(), imgPath), image.buffer);
};

export const getStaticFilePath = (req: Request, localPath: string) => {
  // Combine the protocol, host, and modified local path to create a full URL
  return `${req.protocol}s://${req.get("host")}/${localPath.replace("public/", "")}`;
};
