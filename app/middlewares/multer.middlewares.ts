import { Request } from "express";
import { ApiError } from "@libs/responses";
import multer, { FileFilterCallback } from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) return cb(new ApiError(400, "Invalid image", [{ field: "image", message: "Please provide image only" }]));
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
});

const diskStorage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, "public/templetes");
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const fileUpload = multer({ storage: diskStorage });
