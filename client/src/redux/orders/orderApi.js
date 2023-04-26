import { apiSlice } from "../api/apiSlice";
import months from "../../utils/consts/months";
import moment from "moment";

export const ordersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getAllOrders: builder.query({
			query: (credentials) => ({
				url: "/orders",
				params: credentials,
			}),
			transformResponse: ({ orders, total }) => {
				const loadedOrders = orders.map((order) => ({
					...order,
					id: order._id,
				}));
				return { orders: loadedOrders, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Order", id: "LIST" },
						...result.orders.map((exercise) => ({
							type: "Order",
							id: exercise.id,
						})),
					];
				} else return [{ type: "Order", id: "LIST" }];
			},
		}),
		getOrdersByUser: builder.query({
			query: ({ id }) => ({
				url: `/orders/find/${id}`,
			}),
			transformResponse: ({ orders }) => [
				...orders.map((order) => ({ ...order, id: order._id })),
			],
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						...result.map((exercise) => ({
							type: "Order",
							id: exercise.id,
						})),
					];
				}
			},
		}),
		getOrdersByUserAdmin: builder.query({
			query: ({ id }) => ({
				url: `/orders/find/admin/${id}`,
			}),
			transformResponse: ({ orders }) =>
				orders.map((order) => ({ ...order, id: order._id })),

			providesTags: (result, err, arg) => {
				if (result) {
					return [
						...result.map((orders) => ({
							type: "Order",
							id: orders.id,
						})),
					];
				}
			},
		}),
		getOrdersByMonth: builder.query({
			query: ({ month }) => ({
				url: `/orders/admin/month/${month}`,
			}),
			transformResponse: ({ orders }) =>
				orders.map((order) => ({ ...order, day: order._id })),
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						...result.map((orders) => ({
							type: "Order",
							id: orders.id,
						})),
					];
				}
			},
		}),
		getSingleOrder: builder.query({
			query: ({ id }) => ({
				url: `/orders/${id}`,
			}),
			transformResponse: ({ order }) => ({ ...order, id: order._id }),
			providesTags: (result, err, arg) => [{ type: "Order", id: arg.id }],
		}),
		getSingleOrderAdmin: builder.query({
			query: ({ id }) => ({
				url: `/orders/admin/${id}`,
			}),
			transformResponse: ({ order }) => ({ ...order, id: order._id }),
			providesTags: (result, err, arg) => [{ type: "Order", id: arg.id }],
		}),
		changeOrderStatus: builder.mutation({
			query: ({ id, deliveryStatus }) => ({
				url: `/orders/bought/${id}`,
				method: "PUT",
				body: { deliveryStatus },
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Order", id: "LIST" },
				{ type: "Order", id: arg.id },
			],
		}),
		updateOrderSession: builder.query({
			query: ({ session }) => ({
				url: `/orders/session/${session}`,
				method: "GET",
			}),
		}),
		deleteOrder: builder.mutation({
			query: ({ id }) => ({
				url: `/orders/admin/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Order", id: "LIST" },
				{ type: "Order", id: arg.id },
			],
		}),
		getEarnings: builder.query({
			query: ({ year, admin }) => ({
				url: `/orders/admin/get/total/${year}/${admin}`,
			}),
			transformResponse: ({ total }) =>
				total.map(({ _id, ...rest }) => ({ ...rest, month: months[_id - 1] })),
			providesTags: [{ type: "Order", id: "LIST" }],
		}),
		getdDailyEarnings: builder.query({
			query: ({ admin }) => ({ url: `/orders/admin/get/dailyTotal/${admin}` }),
			transformResponse: ({ total }) =>
				total.map(({ _id, ...rest }) => ({
					...rest,
					date: moment(_id).format("YYYY-MM-DD"),
				})),
			providesTags: [{ type: "Order", id: "LIST" }],
		}),
		getTagStats: builder.query({
			query: () => ({ url: "/orders/admin/get/tagsStats" }),
			transformResponse: ({ stats }) =>
				stats.map(({ _id, total }) => ({ total, tag: _id })),
		}),
		getAllOrdersAdmin: builder.query({
			query: () => `/orders/admin/all`,
			transformResponse: ({ orders, total }) => {
				const loadedOrders = orders.map((order) => ({
					...order,
					id: order._id,
				}));
				return { orders: loadedOrders, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Order", id: "LIST" },
						...result.orders.map((exercise) => ({
							type: "Order",
							id: exercise.id,
						})),
						{ type: "Order", id: "LIST" },
					];
				} else return [{ type: "Order", id: "LIST" }];
			},
		}),
		getOrdersLocation: builder.query({
			query: () => `/orders/admin/location/country`,
			transformResponse: ({ locations }) => locations,
			providesTags: [{ type: "Order", id: "LIST" }],
		}),
		getTotalUserMonth: builder.query({
			query: ({ year, userId }) => `/orders/user/month/${year}/${userId}`,
			transformResponse: ({ total }) => total,
		}),
		getTotalUserDaily: builder.query({
			query: ({ userId }) => `/orders/trainer/daily/earnings/${userId}`,
			transformResponse: ({ total }) => total,
		}),
		getUserEarnings: builder.query({
			query: ({ userId, year }) =>
				`/orders/trainer/month/earnings/${userId}/${year}`,
			transformResponse: ({ total }) =>
				total.map(({ month, ...rest }) => ({
					month: months[month - 1],
					...rest,
				})),
		}),
	}),
});
export const {
	useChangeOrderStatusMutation,
	useDeleteOrderMutation,
	useGetAllOrdersQuery,
	useGetOrdersByUserAdminQuery,
	useGetOrdersByUserQuery,
	useGetSingleOrderAdminQuery,
	useGetSingleOrderQuery,
	useGetOrdersByMonthQuery,
	useGetEarningsQuery,
	useGetTagStatsQuery,
	useGetAllOrdersAdminQuery,
	useGetOrdersLocationQuery,
	useGetdDailyEarningsQuery,
	useUpdateOrderSessionQuery,
	useGetTotalUserMonthQuery,
	useGetUserEarningsQuery,
	useGetTotalUserDailyQuery,
} = ordersApiSlice;
