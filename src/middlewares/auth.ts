import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Jwt } from "jsonwebtoken";

import { NotAuthorizedError } from "../errors/not-authorized-error";

declare global {
  namespace Express {
    interface Request {
      user: UserData;
      token: Jwt | string;
    }
  }
}

export interface UserData {
  _id: string;
  email: string;
}

interface Payload extends JwtPayload {}

export const auth = async (req: Request, _: Response, next: NextFunction) => {
  const headerAuth = req.header("Authorization");

  if (!headerAuth) {
    throw new NotAuthorizedError();
  }

  const token = headerAuth.replace("Bearer ", "");
  const key = process.env.JWT_SECRET;

  try {
    const payload = jwt.verify(token, key!) as Payload;

    req.user = payload as UserData;
    req.token = token;
  } catch (err) {
    throw err;
  }

  next();
};
