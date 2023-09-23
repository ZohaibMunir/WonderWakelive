const otpGenerator = require('otp-generator');

const OTP_CONFIG = {
  upperCaseAlphabets: false,
  specialChars: false,
  lowerCaseAlphabets: false,
};

const OTP_LENGTH = 4;

export const generateOTP = () => {
  const OTP = otpGenerator.generate(OTP_LENGTH, OTP_CONFIG);
  return OTP;
};
