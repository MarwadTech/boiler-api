import jwt from "jsonwebtoken";
import crypto from "crypto";
import { publicKey } from "../contants";

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * This function is commonly used in authentication processes to create a token
 * that can be used for user identification and authorization.
 *
 * @param {string} userId - The unique identifier of the user for whom the token is generated.
 * @returns {string} - The generated JWT containing user information and expiration details.
 */
export const signToken = (userId: string) => {
  // Sign the JWT with the user ID, using the secret and expiration details from environment variables
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(`{"id": "${userId}"}`)
  );
  return jwt.sign({ data: encryptedData }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
