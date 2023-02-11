import { apiSlice } from "../api/apiSlice";
import { setCredentials } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCountStats: builder.query({
			query: () => ({
				url: "/user/countStats",
			}),
			transformResponse: ({ stats }) => stats,
		}),
		getTotalMonth: builder.query({
			query: () => ({ url: "/user/admin/totalMonth" }),
			transformResponse: ({ total }) =>
				total.map(({ total, _id }) => ({ total, month: _id })),
		}),
		getUserById: builder.query({
			query: ({ id }) => ({ url: `/user/${id}` }),
			transformResponse: ({ user }) => ({ ...user, id: user._id }),
		}),
		updateUser: builder.mutation({
			query: (credentials) => ({
				url: "/user/update",
				method: "PUT",
				body: credentials,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data));
				} catch (error) {
					console.log(error);
				}
			},
		}),
		getAllUsersAdmin: builder.query({
			query: (params) => ({
				url: `/user/admin/all`,
				method: "GET",
				params,
			}),
			transformResponse: ({ users, total }) => {
				const loadedUsers = users.map((user) => ({
					...user,
					id: user._id,
				}));
				return { users: loadedUsers, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "User", id: "LIST" },
						...result.users.map((user) => ({
							type: "User",
							id: user.id,
						})),
					];
				} else return [{ type: "User", id: "LIST" }];
			},
		}),
		getAllMonthlyStats: builder.query({
			query: () => "/user/admin/month/all",
			transformResponse: ({ message, ...rest }) =>
				Object.entries(rest)
					.map(([k, v]) => ({ [k]: v.length }))
					.reduce(
						(acc, cur) => ({
							...acc,
							...Object.entries(cur).map(([k, v]) => ({ [k]: v }))[0],
						}),
						{},
					),//{k1:v1,k2:v2}->[{k1:v1},{k2:v2}]
			providesTags: [
				{ type: "User", id: "LIST" },
				{ type: "Post", id: "LIST" },
				{ type: "Training", id: "LIST" },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getAllCountAdmin: builder.query({
			query: () => "/user/admin/countStats",
			transformResponse: ({ stats }) => stats,
			providesTags: [
				{ type: "User", id: "LIST" },
				{ type: "Post", id: "LIST" },
				{ type: "Training", id: "LIST" },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getAdminRelativeStats: builder.query({
			query: () => "/user/admin/relativeStats",
			transformResponse: ({ message, ...rest }) => rest,
			providesTags: [
				{ type: "User", id: "LIST" },
				{ type: "Post", id: "LIST" },
				{ type: "Training", id: "LIST" },
				{ type: "Exercise", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetCountStatsQuery,
	useGetTotalMonthQuery,
	useGetUserByIdQuery,
	useUpdateUserMutation,
	useGetAllUsersAdminQuery,
	useGetAllMonthlyStatsQuery,
	useGetAdminRelativeStatsQuery,
	useGetAllCountAdminQuery,
} = userApi;
