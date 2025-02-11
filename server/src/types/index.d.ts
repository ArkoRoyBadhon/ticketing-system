
// import { user } from '@prisma/client'; // Import your Prisma user model

declare global {
  namespace Express {
    interface Request {
        user?: {
            id: string;
            email: string;
            role: string;
        };
    }
  }
}