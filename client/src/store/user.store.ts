import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
	firstName: string;
	lastName: string;
	email: string;
	id: string;
	gender: string;
	role: string;
	createdAt?: string;
}

interface UserState {
	user: null | User;
	setUser: (user: User | null) => void;
	removeUser: () => void;
}

const User = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set(() => ({ user })),
			removeUser: () => set(() => ({ user: null })),
		}),
		{
			name: "user-store",
		},
	),
);

export default User;
