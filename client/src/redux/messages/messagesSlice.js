import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	notReload: false,
};

const messagesSlice = createSlice({
	name: "messages",
	initialState,
	reducers: {
		setNotReload: (state, action) => {
			state.notReload = action.payload;
		},
	},
});

export const { setNotReload } = messagesSlice.actions;

export const selectNotReload = (state) => state.messages.notReload;

export default messagesSlice.reducer;
