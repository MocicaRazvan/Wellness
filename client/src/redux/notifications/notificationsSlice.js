import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	ids: [],
	senderId: null,
	notifications: null,
	tempNotif: [],
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
		setTempNotif: (state, action) => {
			if (action.payload?.reset === true) {
				state.tempNotif = [];
			} else {
				state.tempNotif = [...state.tempNotif, ...action.payload.notif];
			}
		},
	},
});

export default notificationsSlice.reducer;
export const selectNotificationsIds = (state) => state.notifications.ids;
export const selectSenderNotification = (state) => state.notifications.senderId;
export const selectNotifications = (state) => state.notifications.notifications;
export const selectTempNotif = (state) => state.notifications.tempNotif;

export const { addIds, addSenderId, setNotificationsRedux, setTempNotif } =
	notificationsSlice.actions;
