import { Request, Response } from "express";
import compress from "compression";

export const allowCompression = (req: Request, res: Response) => {
  if (req.headers["x-no-compression"]) {
		return false;
	}
  return compress.filter(req, res);
};
