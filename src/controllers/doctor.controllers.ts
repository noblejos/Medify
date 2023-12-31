import { Request, Response } from "express";
import UserModel, { Role } from "../models/user.model";
import { BadRequestError } from "../errors/bad-request-error";
import { successfulRequest } from "../helpers/responses";
import DoctorModel from "../models/doctor.model";
import { DoctorStatus } from "../models/doctor.model";
import NotificationsModel from "../models/notifications.model";
import AppointmentModel, { Status } from "../models/appointment.model";

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

const fetchAppointments = async (req: Request, res: Response) => {
	const { _id } = req.user;
	try {
		const doctor = await DoctorModel.findOne({ user: _id });

		if (!doctor) throw new BadRequestError("Could not find Doctors Account");

		const appointments = await AppointmentModel.find({
			doctor,
		}).populate("patient");

		successfulRequest({
			res,
			message: "Appointments Fetched Successfully",
			data: appointments,
		});
	} catch (error) {
		throw error;
	}
};

const changeAppointmentStatus = async (req: Request, res: Response) => {
	const user = req.user;
	const { _id } = req.params;
	const status = req.body.status;
	try {
		const doctor = await DoctorModel.findOne({ user });

		const appointment = await AppointmentModel.findOneAndUpdate(
			{ doctor, _id },
			{
				status:
					status === "approve"
						? Status.APPROVED
						: status === "reject"
						? Status.REJECTED
						: Status.PENDING,
			},
			{ new: true },
		);

		if (!appointment) throw new BadRequestError("Could Not Find Appointment");

		successfulRequest({
			res,
			message: "Appointment Status Updated Successfully",
			data: appointment,
		});
	} catch (error) {
		throw error;
	}
};
export default {
	fetchDoctor,
	updateDoctorProfile,
	fetchAppointments,
	changeAppointmentStatus,
};
