import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	trainings: [],
	uiValues: {},
};

const trainingsSlice = createSlice({
	name: "trainings",
	initialState,
	reducers: {
		setTrainingsValues: (state, { payload }) => {
			state.trainings = payload.trainings;
			//state.uiValues = payload.uiValues;
		},
	},
});

export const { setTrainingsValues } = trainingsSlice.actions;
export const selectTrainings = (state) => state.trainings.trainings;
// export const selectUiValues = (state) => state.trainings.uiValues;

export default trainingsSlice.reducer;
