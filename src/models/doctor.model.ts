import {
	getModelForClass,
	modelOptions,
	prop,
	Severity,
	Ref,
	pre,
} from "@typegoose/typegoose";
import { User } from "./user.model";

export enum DoctorStatus {
	PENDING = "pending",
	APPROVED = "approved",
	REJECTED = "rejected",
	CANCELED = "canceled",
}

type Timings = {
	from: string;
	to: string;
};

@pre<Doctor>("find", function () {
	this.populate("user");
})
@pre<Doctor>("findOne", function () {
	this.populate("user");
})
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
	timings: Timings;

	@prop({ required: true, default: DoctorStatus.PENDING })
	status: DoctorStatus;

	@prop({ required: true })
	license: string;
}

const DoctorModel = getModelForClass(Doctor);

export default DoctorModel;
