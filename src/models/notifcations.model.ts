import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
	Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export enum Role {
	USER = "user",
	DOCTOR = "doctor",
	ADMIN = "admin",
}

export enum Status {
	SEEN = "seen",
	UNSEEN = "unseen",
}

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
export class Notifications {
	@prop({ required: true, ref: () => User })
	user: Ref<User>;

	@prop({ required: true })
	header: string;

	@prop({ required: true })
	message: string;

	@prop({ required: true })
	clickPath: string;

	@prop({ required: true, default: Role.ADMIN })
	Role: Role;

	@prop({ required: true, default: Status.UNSEEN })
	status: Status;
}

const NotificationsModel = getModelForClass(Notifications);

export default NotificationsModel;
