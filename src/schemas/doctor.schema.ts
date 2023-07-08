import { z } from "zod";

const apply = z.object({
	body: z.object({
		phoneNumber: z.string({
			required_error: "Phone number is required",
			invalid_type_error: "Phone number must be a string",
		}),
		address: z.string({
			required_error: "Address is required",
			invalid_type_error: "Address must be a string",
		}),
		specialization: z.string({
			required_error: "Specialization is required",
			invalid_type_error: "Specialization must be a string",
		}),

		consultationFee: z.number({
			required_error: "Consultation Fee is required",
			invalid_type_error: "Consultation Fee must be a Number",
		}),
		timings: z
			.string({
				required_error: "Timings is required",
			})
			.array(),
	}),
});

export default {
	apply,
};
