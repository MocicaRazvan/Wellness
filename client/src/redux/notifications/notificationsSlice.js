import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	ids: [],
	senderId: null,
};

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addIds: (state, action) => {
			state.ids = action.payload;
		},
		addSenderId: (state, action) => {
			state.senderId = action.payload;
		},
	},
});

export default notificationsSlice.reducer;
export const selectNotificationsIds = (state) => state.notifications.ids;
export const selectSenderNotification = (state) => state.notifications.senderId;

export const { addIds, addSenderId } = notificationsSlice.actions;
