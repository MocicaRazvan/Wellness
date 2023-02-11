import { createSlice } from "@reduxjs/toolkit";

const initialState = { socket: null };

const socketSlice = createSlice({
	name: "socket",
	initialState,
	reducers: {
		initializeSocket: (state, { payload }) => {
			state.socket = payload.socket;
		},
	},
});

export const selectSocket = (state) => state.socket.socket;
export const { initializeSocket } = socketSlice.actions;

export default socketSlice.reducer;
