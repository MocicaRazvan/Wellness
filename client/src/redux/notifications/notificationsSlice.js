import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	messages: 0,
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addMessage: (state, { payload }) => {
			state.messages += payload.value;
		},
	},
});

export default notificationsSlice.reducer;

export const selectMessageNotification = (state) =>
	state.notifications.messages;

export const { addMessage } = notificationsSlice.actions;
