import { createDraftSafeSelector, createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: localStorage["auth"] || null,
		user: localStorage["user"] ? JSON.parse(localStorage["user"]) : null,
		mode: localStorage["mode"] || "dark",
	},
	reducers: {
		setCredentials: (state, action) => {
			if (action?.payload) {
				const { token, user } = action.payload;
				state.token = token;
				localStorage["auth"] = token;
				state.user = { ...user, id: user._id };
				localStorage["user"] = JSON.stringify(state.user);
			}

			// if (state.token) {
			// 	const decodedToken = jwtDecode(state.token);
			// 	state.user = decodedToken;
			// }
		},
		updateUser: (state, action) => {
			if (action?.payload) {
				const { user } = action.payload;
				state.user = { ...user, id: user._id };
				localStorage["user"] = JSON.stringify(state.user);
			}
		},
		logOut: (state) => {
			state.token = null;
			state.user = null;
			localStorage.removeItem("auth");
			localStorage.removeItem("user");
		},
		setMode: (state) => {
			state.mode = state.mode === "dark" ? "light" : "dark";
			localStorage["mode"] = state.mode;
		},
	},
});

export const { setCredentials, logOut, setMode, updateUser } =
	authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentMode = (state) => state.auth.mode;
export const safeSelectCurrentUser = createDraftSafeSelector(
	selectCurrentUser,
	(user) => user,
);
