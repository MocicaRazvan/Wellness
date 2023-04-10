import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	ids: [],
	senderId: null,
	notifications: null,
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
		setNotificationsRedux: (state, action) => {
			state.notifications = action.payload;
			state.notifications = state.notifications.reduce((acc, { ref }) => {
				acc[ref] ? acc[ref]++ : (acc[ref] = 1);
				return acc;
			}, {});
		},
	},
});

export default notificationsSlice.reducer;
export const selectNotificationsIds = (state) => state.notifications.ids;
export const selectSenderNotification = (state) => state.notifications.senderId;
export const selectNotifications = (state) => state.notifications.notifications;

export const { addIds, addSenderId, setNotificationsRedux } =
	notificationsSlice.actions;
