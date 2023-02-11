import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	search: "",
};

const searchSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		setSearch: (state, { payload }) => {
			state.search = payload;
		},
	},
});

export const { setSearch } = searchSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectCurrentSearch = (state) => state.search.search;
export default searchSlice.reducer;
