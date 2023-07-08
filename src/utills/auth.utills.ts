import { Request } from "express";

export const getClientIpAddress = (req: Request) => {
	return req.ip.split(":").pop();
};
