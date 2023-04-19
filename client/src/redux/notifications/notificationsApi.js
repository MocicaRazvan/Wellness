import { apiSlice } from "../api/apiSlice";

export const notificationsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createNotification: builder.mutation({
			query: (body) => ({
				url: "/notifications",
				method: "POST",
				body,
			}),
			transformResponse: ({ savedNotification }) => ({
				...savedNotification,
				id: savedNotification._id,
			}),
			invalidatesTags: [{ type: "Notification", id: "LIST" }],
		}),

		getNotificationsByUser: builder.query({
			query: ({ receiverId }) => ({ url: `/notifications/${receiverId}` }),
			transformResponse: ({
				notifications,
				postApprove,
				postDisapprove,
				postDelete,
				trainingApprove,
				trainingDisapprove,
				trainingDelete,
				trainingBought,
			}) => ({
				notifications: notifications.map((n) => ({ ...n, id: n._id })),
				postApprove: postApprove.map((n) => ({ ...n, id: n._id })),
				postDisapprove: postDisapprove.map((n) => ({ ...n, id: n._id })),
				postDelete: postDelete.map((n) => ({ ...n, id: n._id })),
				trainingApprove: trainingApprove.map((n) => ({ ...n, id: n._id })),
				trainingDisapprove: trainingDisapprove.map((n) => ({
					...n,
					id: n._id,
				})),
				trainingDelete: trainingDelete.map((n) => ({
					...n,
					id: n._id,
				})),
				trainingBought: trainingBought.map((n) => ({
					...n,
					id: n._id,
				})),
			}),
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Notification", id: "LIST" },
						...Object.values(result).map(({ id }) => ({
							type: "Notification",
							id,
						})),
					];
				} else return [{ type: "Notification", id: "LIST" }];
			},
		}),
		deleteNotificationById: builder.mutation({
			query: ({ notificationId }) => ({
				url: `/notifications/${notificationId}`,
				method: "DELETE",
			}),
			invalidatesTags: (res, err, arg) => [
				{ type: "Notification", id: arg.notificationId },
			],
		}),
		deleteNotificationsByReceiver: builder.mutation({
			query: ({ receiverId }) => ({
				url: `/notifications/user/${receiverId}`,
				method: "DELETE",
			}),
			invalidatesTags: (res, err, arg) => {
				if (res) {
					return [
						{ type: "Notification", id: "LIST" },
						...res?.ids.map((_id) => ({ type: "Notification", id: _id })),
					];
				} else {
					return [{ type: "Notification", id: "LIST" }];
				}
			},
		}),
		deleteApproved: builder.mutation({
			query: ({ type }) => ({
				url: `/notifications/user/approved/${type}`,
				method: "DELETE",
			}),
			invalidatesTags: (res, err, arg) => {
				if (res) {
					return [
						{ type: "Notification", id: "LIST" },
						...res?.ids.map((_id) => ({ type: "Notification", id: _id })),
					];
				} else {
					return [{ type: "Notification", id: "LIST" }];
				}
			},
		}),
		deleteNotifcationsBySender: builder.mutation({
			query: ({ senderId }) => ({
				url: `/notifications/receiver/${senderId}`,
				method: "DELETE",
			}),
			invalidatesTags: (res, err, arg) => {
				if (res) {
					return [
						{ type: "Notification", id: "LIST" },
						...res?.ids.map((_id) => ({ type: "Notification", id: _id })),
					];
				} else {
					return [{ type: "Notification", id: "LIST" }];
				}
			},
		}),
	}),
});

export const {
	useCreateNotificationMutation,
	useGetNotificationsByUserQuery,
	useDeleteNotificationByIdMutation,
	useDeleteNotificationsByReceiverMutation,
	useDeleteNotifcationsBySenderMutation,
	useDeleteApprovedMutation,
} = notificationsApiSlice;
