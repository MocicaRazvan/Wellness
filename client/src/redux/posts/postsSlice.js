import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	posts: [],
	uiValues: {},
};

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setValues: (state, { payload }) => {
			state.posts = payload.posts;
			//state.uiValues = payload.uiValues;
		},
	},
});

export const { setValues } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectUiValues = (state) => state.posts.uiValues;

export default postsSlice.reducer;
