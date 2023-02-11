import { apiSlice } from "../api/apiSlice";

export const cartApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		checkout: builder.mutation({
			query: ({ cartItems, userId }) => ({
				url: "/stripe/create-checkout-session",
				method: "POST",
				body: { cartItems, userId },
			}),
		}),
	}),
});

export const { useCheckoutMutation } = cartApiSlice;
