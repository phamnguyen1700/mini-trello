import { generateToken } from '@/common/utils/jwt';
import { AuthRepo } from '@/repos/auth.repo';
import { UserRepo } from '@/repos/user.repo';
import { AppError, ErrorCodes } from '@/utils/response';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const AuthService = {
  async sendSignupCode(email: string) {
    const code = generateOtp();
    await AuthRepo.createCode(email, code);

    await transporter.sendMail({
      from: `"Mini Trello" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}.`,
    });

    const exists = await UserRepo.findByEmail(email);
    return { isExistingUser: !!exists };
  },

  async sendSigninCode(email: string) {
    const exists = await UserRepo.findByEmail(email);
    if (!exists) {
      throw new AppError(
        'User not found. Please sign up.',
        404,
        ErrorCodes.NOT_FOUND,
      );
    }

    const code = generateOtp();
    await AuthRepo.createCode(email, code);

    await transporter.sendMail({
      from: `"Mini Trello" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verification Code',
      text: `Your verification code is: ${code}.`,
    });
  },

  async signup(email: string, code: string) {
    const valid = await AuthRepo.verifyCode(email, code);
    if (!valid) {
      throw new AppError(
        'Invalid or expired verification code',
        400,
        ErrorCodes.INVALID_CODE,
      );
    }

    const exists = await UserRepo.findByEmail(email);
    if (exists) {
      const token = generateToken(exists.id, exists.email);
      return {
        user: exists,
        accessToken: token,
      };
    }

    const user = await UserRepo.create(email);
    const token = generateToken(user.id, user.email);

    return {
      user,
      accessToken: token,
    };
  },

  async signin(email: string, code: string) {
    const valid = await AuthRepo.verifyCode(email, code);
    if (!valid) {
      throw new AppError(
        'Invalid or expired verification code',
        400,
        ErrorCodes.INVALID_CODE,
      );
    }

    const user = await UserRepo.findByEmail(email);
    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.NOT_FOUND);
    }

    const token = generateToken(user.id, user.email);

    return { user, accessToken: token };
  },
};
