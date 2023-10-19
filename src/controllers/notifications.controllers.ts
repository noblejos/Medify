import { Request, Response } from "express";
import NotificationsModel, { Status } from "../models/notifications.model";
import { successfulRequest } from "../helpers/responses";

const fetchNotification = async (req: Request, res: Response) => {
	const user = req.user;
	try {
		const notifications = await NotificationsModel.find({ user });
		return successfulRequest({
			res,
			message: "Notification fetched Successfully",
			data: notifications,
		});
	} catch (error) {
		throw error;
	}
};

const markAsSeen = async (req: Request, res: Response) => {
	const user = req.user;
	const { id } = req.params;
	try {
		const notifications = await NotificationsModel.findOneAndUpdate(
			{ user, _id: id },
			{ status: Status.SEEN },
			{ new: true },
		);
		return successfulRequest({
			res,
			message: "Notification Updated Successfully",
			data: notifications,
		});
	} catch (error) {
		throw error;
	}
};

export default { fetchNotification, markAsSeen };
