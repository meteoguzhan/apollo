import { UserInterface } from '../models/UserModel';
import process from 'process';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

export interface AuthSign {
  id: string;
  email: string;
}

class AuthService {
  constructor() {
    config();
  }

  verifyToken(token: string): UserInterface | false {
    if (process.env.PRIVATE_KEY) {
      return jwt.verify(token, process.env.PRIVATE_KEY) as UserInterface;
    } else {
      return false;
    }
  }

  generateToken(user: UserInterface): string | false {
    if (process.env.PRIVATE_KEY && user._id) {
      const payload: AuthSign = { id: user._id, email: user.email };
      return jwt.sign(payload, process.env.PRIVATE_KEY, { expiresIn: '24h' });
    } else {
      return false;
    }
  }
}
export const authService: AuthService = new AuthService();
