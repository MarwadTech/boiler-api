import fs from "fs";

export const ValidUserStatus: any[] = ["active", "inactive", "blocked"];

export const ValidUserRoles: any[] = ["user", "admin"];

export const ValidQueryCategories = ["login", "compatibility", "performance", "security", "privacy", "functionality", "other"];

export const optExpireMinutes = 10;

export const ValidAddresTypes = ["word", "office"];

export const publicKey = Buffer.from(fs.readFileSync("public.pem", { encoding: "utf-8" }));

export const privateKey = fs.readFileSync("private.pem", { encoding: "utf-8" });

export const ImageSizes: { size: number; type: string }[] = [
  { size: 150, type: "thumbnail" },
  { size: 500, type: "medium" },
  { size: 1080, type: "large" },
];

export const timestamps = (DataTypes: any) => {
  return {
    created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  };
};
