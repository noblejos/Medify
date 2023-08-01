import { z } from "zod";

const register = z.object({
	body: z.object({
		firstName: z.string({
			required_error: "First name is required",
			invalid_type_error: "First name must be a string",
		}),
		lastName: z.string({
			required_error: "First name is required",
			invalid_type_error: "First name must be a string",
		}),
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email"),
		gender: z.string({
			required_error: "Gender is required",
			invalid_type_error: "Gender must be a string",
		}),
		password: z
			.string({
				required_error: "Password is required",
			})
			.refine(
				(value) =>
					/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
						value,
					),
				`Password must contain at least 8 characters, 
            include at least one uppercase letter, 
            one lowercase letter, a number, and one special character`,
			),
	}),
});

const login = z.object({
	body: z.object({
		email: z
			.string({ required_error: "Email is required" })
			.email("Invalid email"),
		password: z
			.string({
				required_error: "Password is required",
			})
			.refine(
				(value) =>
					/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
						value,
					),
				`Password must contain at least 8 characters, 
            include at least one uppercase letter, 
            one lowercase letter, a number, and one special character`,
			),
	}),
});

export default {
	register,
	login,
};
