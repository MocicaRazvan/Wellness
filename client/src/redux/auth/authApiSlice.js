import { apiSlice } from "../api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (credentials) => ({
				url: "/auth/register",
				method: "POST",
				body: { ...credentials },
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data));
				} catch (error) {
					dispatch(logOut());
					console.log(error);
				}
			},
		}),
		login: builder.mutation({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					dispatch(setCredentials(data));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		forgotPassword: builder.mutation({
			query: (email) => ({
				url: "/auth/forgotPassword",
				method: "POST",
				body: { email },
			}),
		}),
		resetPassword: builder.mutation({
			query: ({ resetToken, password }) => ({
				url: `/auth/resetPassword/${resetToken}`,
				method: "PUT",
				body: { password },
			}),
		}),
	}),
});

export const {
	useRegisterMutation,
	useLoginMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
} = authApiSlice;
