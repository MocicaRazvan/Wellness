import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentExercises: localStorage["currentExercises"]
		? JSON.parse(localStorage["currentExercises"])
		: [],
	totalExercises: localStorage["currentExercises"]
		? JSON.parse(localStorage["currentExercises"]).length
		: 0,
};

const exercisesSlice = createSlice({
	name: "exercises",
	initialState,
	reducers: {
		addExercise: (state, { payload }) => {
			const itemIndex = state.currentExercises.findIndex(
				(item) => item.id === payload.id,
			);
			if (itemIndex >= 0) {
				state.currentExercises[itemIndex].quantity += 1;
			} else {
				state.currentExercises.push({ ...payload, quantity: 1 });
			}
			state.totalExercises = state.currentExercises.length;
			localStorage["currentExercises"] = JSON.stringify(state.currentExercises);
		},
		removeExercise: (state, { payload }) => {
			state.currentExercises = state.currentExercises.filter(
				(item) => item.id !== payload.id,
			);
			state.totalExercises = state.currentExercises.length;

			localStorage["currentExercises"] = JSON.stringify(state.currentExercises);
		},
		decreaseExercise: (state, { payload }) => {
			const itemIndex = state.currentExercises.findIndex(
				(item) => item.id === payload.id,
			);
			if (state.currentExercises[itemIndex].quantity > payload.q) {
				state.currentExercises[itemIndex].quantity -= payload.q;
			} else if (state.currentExercises[itemIndex].quantity === payload.q) {
				state.currentExercises = state.currentExercises.filter(
					(item) => item.id !== payload.id,
				);
			}
			state.totalExercises = state.currentExercises.length;

			localStorage["currentExercises"] = JSON.stringify(state.currentExercises);
		},
		clearExercise: (state) => {
			state.currentExercises = [];
			state.totalExercises = 0;
			localStorage["currentExercises"] = JSON.stringify(state.currentExercises);
		},
	},
});

export const { addExercise, clearExercise, decreaseExercise, removeExercise } =
	exercisesSlice.actions;

export const selectExercises = (state) => state.exercises;

export default exercisesSlice.reducer;
