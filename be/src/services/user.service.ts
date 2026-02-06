import { UserRepo } from '@/repos/user.repo';
import { AppError, ErrorCodes } from '@/utils/response';

export const UserService = {
  async getMe(userId: string) {
    const user = await UserRepo.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.NOT_FOUND);
    }

    return user;
  },
};
