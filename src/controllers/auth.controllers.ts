import { Request, Response } from "express";

import { BadRequestError } from "../errors/bad-request-error";
import { resourceCreated, successfulRequest } from "../helpers/responses";
import UserModel from "../models/user.model";
import DoctorModel, { DoctorStatus } from "../models/doctor.model";
import NotificationsModel, { Role } from "../models/notifications.model";
import AppointmentModel from "../models/appointment.model";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

// GET Request Controllers
const currentUser = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user!;

		const user = await UserModel.findById(_id);

		if (!user) throw new BadRequestError("User not found");

		successfulRequest({
			res,
			message: "Authentication Successful",
			data: user,
		});
	} catch (error) {
		throw error;
	}
};

const logout = async (req: Request, res: Response) => {
	try {
		const { _id } = req.user!;
		const token = req.token;

		await UserModel.updateOne({ _id }, { $pull: { tokens: { token } } });

		successfulRequest({
			res,
			message: "User logged out",
			data: {},
		});
	} catch (error) {
		throw error;
	}
};

// POST Request Controllers
const register = async (req: Request, res: Response) => {
	try {
		const { firstName, lastName, email, password, gender } = req.body;

		const user = await UserModel.create({
			firstName,
			lastName,
			email,
			password,
			gender,
		});

		const token = await user.generateAuthToken();

		resourceCreated({
			res,
			message: "User Authenticated",
			data: { user, token },
		});
	} catch (error) {
		throw error;
	}
};

const login = async (req: Request, res: Response) => {
	const { remaining } = req.rateLimit;

	try {
		const { email, password } = req.body;

		const user = await UserModel.findOne({ email });
		if (!user)
			throw new BadRequestError(
				`Incorrect Email or Password, you have ${remaining} attempts left`,
			);

		const _isValidated = await user.validatePassword(password);
		if (!_isValidated)
			throw new BadRequestError(
				`Incorrect Email or Password, you have ${remaining} attempts left`,
			);

		const token = await user.generateAuthToken();

		successfulRequest({
			res,
			message: "User Authenticated",
			data: { user, token },
		});
	} catch (error) {
		throw error;
	}
};

const applyForDoctorRole = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		const _user = await UserModel.findOne({ _id: user._id });

		if (!_user) throw new BadRequestError("User not Found");

		const admin = await UserModel.findOne({ role: Role.ADMIN });

		const doctor = await DoctorModel.create({
			user,
			...req.body,
		});

		await NotificationsModel.create({
			user: admin,
			header: "Doctor application",
			message: `${_user.firstName} ${_user.lastName} has applied for a doctor account`,
			clickPath: "admin/doctors",
			role: Role.ADMIN,
			ref: doctor._id,
		});

		return successfulRequest({
			res,
			message: "Application for Doctor Role sent successfully",
			data: doctor,
		});
	} catch (error) {
		throw error;
	}
};

const fetchDoctors = async (req: Request, res: Response) => {
	try {
		const doctors = await DoctorModel.find({ status: DoctorStatus.APPROVED });
		successfulRequest({
			res,
			message: "Doctors fetched Successfully",
			data: doctors,
		});
	} catch (error) {
		throw error;
	}
};

const checkAvailability = async (req: Request, res: Response) => {
	const { _id } = req.user;
	const rqb = req.body;
	try {
		const fromTime = dayjs(rqb.time).format("HH:mm");

		const toTime = dayjs(rqb.time).add(60, "m").format("HH:mm");
		console.log(fromTime, toTime, { date: dayjs(rqb.date).format() });

		const appointments = await AppointmentModel.findOne({
			doctor: rqb.doctorId,
			date: dayjs(rqb.date).format(),
			time: { $gte: fromTime, $lte: toTime },
		});

		console.log({ appointments });
	} catch (error) {
		throw error;
	}
};

export default {
	currentUser,
	logout,
	register,
	login,
	applyForDoctorRole,
	fetchDoctors,
	checkAvailability,
};
