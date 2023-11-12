import { Request, Response } from "express";
import UserModel, { Role } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import { successfulRequest } from "../helpers/responses";
import DoctorModel from "../models/doctor.model";
import { DoctorStatus } from "../models/doctor.model";
import NotificationsModel from "../models/notifications.model";

const fetchUsers = async (req: Request, res: Response) => {
	const user = req.user;

	try {
		if (user.role !== Role.ADMIN)
			throw new BadRequestError(
				"You Do Not Have Adequate Permission to Access this Resources",
			);

		const users = await UserModel.find({ role: { $ne: Role.ADMIN } });

		successfulRequest({
			res,
			message: "Users Fetched Successfully",
			data: users,
		});
	} catch (error) {
		throw error;
	}
};

const fetchDoctors = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		if (user.role !== Role.ADMIN)
			throw new BadRequestError(
				"You Do Not Have Adequate Permission to Access this Resources",
			);

		const doctors = await DoctorModel.find({});

		successfulRequest({
			res,
			message: "Doctors Fetched Successfully",
			data: doctors,
		});
	} catch (error) {
		throw error;
	}
};

const changeDoctorStatus = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		if (user.role !== Role.ADMIN)
			throw new BadRequestError(
				"You Do Not Have Adequate Permission to Access this Resources",
			);

		const { doctorId, status } = req.body;

		if (!(Object.values(DoctorStatus) as string[]).includes(status))
			throw new BadRequestError("Invalid status key");

		const doctor = await DoctorModel.findOneAndUpdate(
			{ _id: doctorId },
			{ status },
		).populate("user");

		if (!doctor) throw new BadRequestError("Could Not Find Doctor");

		const _user = await UserModel.findOne({ _id: doctor.user });
		if (!_user) throw new BadRequestError("Could Not Find User");

		_user.role = status === DoctorStatus.APPROVED ? Role.DOCTOR : Role.USER;

		await _user.save();

		await NotificationsModel.create({
			user: _user,
			header: "Doctor application",
			message: `Your Doctor Application has been ${status}`,
			clickPath: "/doctor/profile",
			role: Role.DOCTOR,
			ref: "profiles",
		});

		successfulRequest({
			res,
			message: "Successfully Updated Doctors Account",
			data: doctor,
		});
	} catch (error) {
		throw error;
	}
};

export default { fetchUsers, fetchDoctors, changeDoctorStatus };
