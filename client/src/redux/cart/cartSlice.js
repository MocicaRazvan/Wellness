import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	cartItems: localStorage["cartItems"]
		? JSON.parse(localStorage["cartItems"])
		: [],
};

const cartSlice = createSlice({
	name: "cart",
	initialState,
	reducers: {
		addToCart: (state, { payload }) => {
			const itemIndex = state.cartItems.findIndex(
				(item) => item.id === payload.id,
			);
			if (itemIndex < 0) {
				state.cartItems.push({ ...payload });
				localStorage["cartItems"] = JSON.stringify(state.cartItems);
			}
		},
		removeFormCart: (state, { payload }) => {
			state.cartItems = state.cartItems.filter(
				(item) => item.id !== payload.id,
			);
			localStorage["cartItems"] = JSON.stringify(state.cartItems);
		},
		clearCart: (state) => {
			state.cartItems = [];
			localStorage["cartItems"] = JSON.stringify(state.cartItems);
		},
	},
});

export const { addToCart, clearCart, removeFormCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.cartItems;

export default cartSlice.reducer;
