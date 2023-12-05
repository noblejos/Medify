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

const updateDoctorProfile = async (req: Request, res: Response) => {
	const { _id } = req.user;
	const { doctorId, firstName, lastName, ...rest } = req.body;

	try {
		const doctor = await DoctorModel.findOneAndUpdate(
			{ _id: doctorId },
			{ ...rest },
			{ new: true },
		);

		if (!doctor) throw new BadRequestError("Could Not Find Doctor");

		const user = await UserModel.findOneAndUpdate(
			{ _id },
			{
				$set: {
					firstName,
					lastName,
				},
			},
			{ new: true },
		);

		successfulRequest({
			res,
			message: "You Have Successfully Updated your Profile",
		});
	} catch (error) {
		throw error;
	}
};
export default { fetchDoctor, updateDoctorProfile };
