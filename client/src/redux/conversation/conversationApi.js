import { apiSlice } from "../api/apiSlice";

export const conversationApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversationsByUser: builder.query({
			query: ({ id, search }) => ({
				url: `/conversations/${id}`,
				params: { search },
			}),
			transformResponse: ({ userConversations }) =>
				userConversations.map((conversation) => ({
					...conversation,
					id: conversation._id,
				})),
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Conversation", id: "LIST" },
						...result.map(({ id }) => ({ type: "Conversation", id })),
					];
				}
			},
		}),
		getConversationById: builder.query({
			query: ({ id }) => ({ url: `/conversations/find/${id}` }),
			transformResponse: ({ conversation }) => ({
				...conversation,
				id: conversation._id,
			}),
			providesTags: (result, err, arg) => {
				if (result) {
					return [{ type: "Conversation", id: result?.id }];
				}
			},
		}),
		createSupportConversation: builder.mutation({
			query: ({ id }) => ({
				url: "/conversations/support",
				method: "POST",
				body: { senderId: id },
			}),
			invalidatesTags: [{ type: "Conversation", id: "LIST" }],
		}),
	}),
});
export const {
	useGetConversationsByUserQuery,
	useCreateSupportConversationMutation,
	useGetConversationByIdQuery,
} = conversationApiSlice;
