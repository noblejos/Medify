import { z } from "zod";
import { Status } from "../models/appointment.model";

const apply = z.object({
	body: z.object({
		address: z.string({
			required_error: "Address is required",
			invalid_type_error: "Address must be a string",
		}),
		specialization: z.string({
			required_error: "Specialization is required",
			invalid_type_error: "Specialization must be a string",
		}),
		experience: z.string(),
		consultationFee: z.number({
			required_error: "Consultation Fee is required",
			invalid_type_error: "Consultation Fee must be a Number",
		}),
		timings: z.object({
			from: z.string({
				required_error: "Timings is required",
			}),
			to: z.string({
				required_error: "Timings is required",
			}),
		}),
	}),
});

const updateAppointmentStatus = z.object({
	body: z.object({
		status: z.enum(["approve", "reject"], {
			errorMap: (issue, _ctx) => {
				switch (issue.code) {
					case "invalid_type":
						return {
							message: "role: expected 'approve' or 'reject' ",
						};
					case "invalid_enum_value":
						return {
							message: "role: expected 'approve' or 'reject'  ",
						};
					default:
						return { message: "role: expected 'approve' or 'reject'  " };
				}
			},
		}),
	}),
});

export default {
	apply,
	updateAppointmentStatus,
};
