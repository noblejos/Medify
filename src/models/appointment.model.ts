import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
	Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";
import { Doctor } from "./doctor.model";

export enum Status {
	PENDING = "pending",
	COMPLETED = "completed",
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
export class Appointment {
	@prop({ required: true, ref: () => User })
	user: Ref<User>;

	@prop({ required: true, ref: () => Doctor })
	doctor: Ref<Doctor>;

	@prop({ required: true })
	dateTime: string;

	@prop({ required: true, default: Status.PENDING })
	status: Status;
}

const AppointmentModel = getModelForClass(Appointment);

export default AppointmentModel;
