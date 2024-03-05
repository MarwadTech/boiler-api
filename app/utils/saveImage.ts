import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { Request } from "express";

import { ImageSizes } from "../contants";

/**
 * Save an image and generate resized versions with corresponding URLs.
 *
 * @param {Express.Request} req - The Express request object.
 * @param {string} dir - The main directory.
 * @param {string} subDir - The subdirectory.
 * @returns {Promise<Object>} - A Promise that resolves to an object containing resized image URLs.
 */

export const saveImage = async (req: Request, dir: string): Promise<{ [k: string]: { url: string; localPath: string } } | undefined> => {
  try {
    // Create the specified directory (and any missing parent directories) for storing images
    await fs.mkdir(`public/images/${dir}`, { recursive: true });

    // Generate resized images and corresponding URLs using sharp and fs.promises
    const resizedImages = await Promise.all(
      ImageSizes.map(async ({ size, type }) => {
        // Resize the image using sharp
        const resizedBuffer = await sharp(req.file?.buffer).resize({ width: size, height: size, fit: "inside" }).toFormat("webp").toBuffer();

        // Create a unique filename for the resized image
        const resizedImagePath = `public/images/${dir}/${Date.now() + Math.ceil(Math.random() * 1e5)}-${type}.webp`;

        // Write the resized image to the file system
        await fs.writeFile(path.join(process.cwd(), resizedImagePath), resizedBuffer);

        // Return an object with the resized image URL
        return {
          [type]: {
            localPath: resizedImagePath,
            url: getStaticFilePath(req, resizedImagePath),
          },
        };
      })
    );

    // Combine the resized image URLs into a single object
    return Object.assign({}, ...resizedImages);
  } catch (err) {
    // Log an error message if an error occurs during the process
    console.error("Error while saving image:", err);
  }
};

/**
 * Generate a public URL for a local file path, using the request's protocol and host.
 *
 * @param {Express.Request} req - The Express request object.
 * @param {string} localPath - The local file path.
 * @returns {string} - The public URL for the given local path.
 */

const getStaticFilePath = (req: Request, localPath: string) => {
  // Combine the protocol, host, and modified local path to create a full URL
  return `${req.protocol}s://${req.get("host")}/${localPath.replace("public/", "")}`;
};
