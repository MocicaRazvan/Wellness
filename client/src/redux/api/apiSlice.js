import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_REST_API,
	credentials: "include",
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;

		if (token) {
			headers.set("authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

export const apiSlice = createApi({
	baseQuery,
	tagTypes: [
		"Post",
		"Comment",
		"Exercise",
		"Training",
		"Order",
		"Conversation",
		"Message",
		"Notification",
		"User",
	],
	endpoints: (builder) => ({}),
});
