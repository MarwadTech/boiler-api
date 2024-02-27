/**
 * Generates the URL for sending a two-factor authentication (2FA) SMS using the 2Factor.in API.
 * This function constructs the API endpoint with the provided phone number and verification code.
 *
 * @param {string} phone_number - The phone number to which the 2FA SMS will be sent.
 * @param {string} code - The verification code to include in the 2FA SMS.
 * @returns {string} - The complete URL for triggering a 2FA SMS using the 2Factor.in API.
 */
export const url2Factor = function (phoneNumber: string, code: string) {
  // Construct the URL with the 2Factor.in API endpoint, API key, phone number, and verification code
  return `https://2factor.in/API/V1/${process.env.API_KEY_2_FACTOR}/SMS/${phoneNumber}/${code}`;
};
