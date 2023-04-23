import { apiSlice } from "../api/apiSlice";

export const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessagesByConversation: builder.query({
			query: ({ id }) => ({ url: `/messages/${id}` }),
			transformResponse: ({ messages }) =>
				messages?.map((message) => ({ ...message, id: message._id })),
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Message", id: "LIST" },
						...result.map(({ id }) => ({ type: "Message", id })),
					];
				}
			},
		}),
		createMessage: builder.mutation({
			query: (body) => ({ url: "/messages", method: "POST", body }),
			transformResponse: ({ savedMessage }) => ({
				...savedMessage,
				id: savedMessage._id,
			}),
			invalidatesTags: [{ type: "Message", id: "LIST" }],
		}),
	}),
});

export const { useGetMessagesByConversationQuery, useCreateMessageMutation } =
	messagesApi;
