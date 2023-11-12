import { Request, Response } from "express";
import UserModel, { Role } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import { successfulRequest } from "../helpers/responses";
import DoctorModel from "../models/doctor.model";
import { DoctorStatus } from "../models/doctor.model";
import NotificationsModel from "../models/notifications.model";

const fetchDoctor = async (req: Request, res: Response) => {
	const user = req.user;

	try {
		const doctor = await DoctorModel.findOne({ user: user._id });

		if (!doctor) throw new BadRequestError("Could not Fetch Doctor");

		successfulRequest({
			res,
			message: "Users Fetched Successfully",
			data: doctor,
		});
	} catch (error) {
		throw error;
	}
};

export default { fetchDoctor };
