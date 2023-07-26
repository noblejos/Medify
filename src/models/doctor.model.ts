import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
	Ref,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export enum DoctorStatus {
	PENDING = "pending",
	APPROVED = "approved",
	CANCELED = "canceled",
}

@modelOptions({
	schemaOptions: {
		timestamps: true,
		toJSON: {
			transform(_, ret: any) {
				ret.id = ret._id;

				delete ret._id;
			},
			versionKey: false,
		},
	},
	options: {
		allowMixed: Severity.ALLOW,
	},
})
export class Doctor {
	@prop({ ref: () => User })
	user: Ref<User>;

	@prop({ required: true })
	address: string;

	@prop({ required: true })
	specialization: string;

	@prop({ required: true })
	consultationFee: Number;

	@prop({ required: true })
	experience: string;

	@prop({ required: true })
	timings: string[];

	@prop({ required: true, default: DoctorStatus.PENDING })
	status: DoctorStatus;
}

const DoctorModel = getModelForClass(Doctor);

export default DoctorModel;
