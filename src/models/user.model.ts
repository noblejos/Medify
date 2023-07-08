import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
	pre,
	DocumentType,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import { sign } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export enum Gender {
	MALE = "male",
	FEMALE = "female",
	OTHER = "other",
}

export enum Role {
	USER = "user",
	DOCTOR = "doctor",
	ADMIN = "admin",
}
@pre<User>("save", async function () {
	if (!this.isModified("password")) return;

	const hash = await argon2.hash(this.password);
	this.password = hash;

	return;
})
@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform(_, ret: any) {
				ret.id = ret._id;

				delete ret._id;
				delete ret.password;
				delete ret.tokens;
			},
			versionKey: false,
		},
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
export class User {
	@prop({ required: true })
	firstName: string;

	@prop({})
	lastName: string;

	@prop({ required: true, unique: true })
	email: string;

	@prop({})
	password: string;

	@prop({ enum: Gender, required: true })
	gender: Gender;

	@prop({ required: true, default: Role.USER })
	Role: Role;

	async validatePassword(this: DocumentType<User>, candidatePassword: string) {
		try {
			return await argon2.verify(this.password, candidatePassword);
		} catch (error) {
			throw error;
		}
	}

	async generateAuthToken(this: DocumentType<User>) {
		try {
			const token = sign({ _id: this._id, email: this.email }, secret!);
			return token;
		} catch (error) {
			throw error;
		}
	}
}

const UserModel = getModelForClass(User);

export default UserModel;
