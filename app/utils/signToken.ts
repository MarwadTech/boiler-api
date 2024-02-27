import jwt, { JwtPayload } from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * This function is commonly used in authentication processes to create a token
 * that can be used for user identification and authorization.
 *
 * @param {string} userId - The unique identifier of the user for whom the token is generated.
 * @param {string} userId - The user's type for whom the token is generated.
 * @returns {string} - The generated JWT containing user information and expiration details.
 */
export const signToken = (userId: string) => {
  // Sign the JWT with the user ID, using the secret and expiration details from environment variables
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
