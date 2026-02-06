import { generateToken } from '@/common/utils/jwt';
import { AuthRepo } from '@/repos/auth.repo';
import { UserRepo } from '@/repos/user.repo';
import { AppError, ErrorCodes } from '@/utils/response';

interface GitHubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

const GITHUB_API_URL = 'https://api.github.com';
const GITHUB_OAUTH_URL = 'https://github.com/login/oauth';

export const GitHubService = {
  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      redirect_uri: process.env.GITHUB_CALLBACK_URL!,
      scope: 'read:user user:email',
    });

    return `${GITHUB_OAUTH_URL}/authorize?${params.toString()}`;
  },

  async exchangeCodeForToken(code: string): Promise<string> {
    const res = await fetch(`${GITHUB_OAUTH_URL}/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
      }),
    });

    const data = (await res.json()) as GitHubTokenResponse;

    if (!data.access_token) {
      throw new AppError(
        'Failed to exchange GitHub code for token',
        401,
        ErrorCodes.UNAUTHORIZED,
      );
    }

    return data.access_token;
  },

  async fetchGitHubUser(accessToken: string): Promise<GitHubUserResponse> {
    const res = await fetch(`${GITHUB_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });

    if (!res.ok) {
      throw new AppError(
        'Failed to fetch GitHub user',
        401,
        ErrorCodes.UNAUTHORIZED,
      );
    }

    return (await res.json()) as GitHubUserResponse;
  },

  async authenticate(code: string): Promise<string> {
    const accessToken = await this.exchangeCodeForToken(code);
    const githubUser = await this.fetchGitHubUser(accessToken);

    const githubId = githubUser.id.toString();
    const email = githubUser.email || `${githubUser.login}@github.local`;
    const displayName = githubUser.name || githubUser.login;
    const avatarUrl = githubUser.avatar_url;

    let user = await UserRepo.findByGithubId(githubId);

    if (!user) {
      user = await UserRepo.findByEmail(email);

      if (user) {
        user = await UserRepo.updateWithGitHub(user.id, {
          githubId,
          avatarUrl,
          displayName,
        });
      } else {
        user = await UserRepo.create(email);
        user = await UserRepo.updateWithGitHub(user.id, {
          githubId,
          avatarUrl,
          displayName,
        });
      }
    }

    const jwtToken = generateToken(user.id, user.email);

    const tempCode = await AuthRepo.createTempCode(user.id, jwtToken);

    return tempCode;
  },

  async exchangeTempCode(code: string) {
    const result = await AuthRepo.verifyTempCode(code);

    if (!result) {
      throw new AppError(
        'Invalid or expired code',
        401,
        ErrorCodes.UNAUTHORIZED,
      );
    }

    const user = await UserRepo.findById(result.userId);

    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.NOT_FOUND);
    }

    return { user, accessToken: result.token };
  },
};
