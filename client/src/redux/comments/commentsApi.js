import { apiSlice } from "../api/apiSlice";

export const commentsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createComment: builder.mutation({
			query: (comment) => ({
				url: "/comments",
				method: "POST",
				body: comment,
			}),
			transformResponse: ({ comment }) => ({ ...comment, id: comment._id }),
			invalidatesTags: [{ type: "Comment", id: "LIST" }],
		}),
		getComments: builder.query({
			query: (params) => ({
				url: "/comments",
				params: params,
			}),
			transformResponse: ({ comments }) => {
				const loadedComments = comments.map((comment) => ({
					...comment,
					id: comment._id,
				}));
				return { comments: loadedComments };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Comment", id: "LIST" },
						...result.comments.map((comment) => ({
							type: "Comment",
							id: comment.id,
						})),
					];
				} else return [{ type: "Comment", id: "LIST" }];
			},
		}),

		commentActions: builder.mutation({
			query: ({ id, action }) => ({
				url: `/comments/action/${action}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: (result, err, arg) => [{ type: "Comment", id: arg.id }],
		}),
		deleteComment: builder.mutation({
			query: ({ id }) => ({
				url: `/comments/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Comment", id: arg.id },
				//{ type: "Post", id: "LIST" },
			],
		}),
		updateComment: builder.mutation({
			query: ({ id, body }) => ({
				url: `/comments/${id}`,
				method: "PUT",
				body: { body },
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Comment", id: arg.id },
				//{ type: "Post", id: "LIST" },
			],
		}),
	}),
});

export const {
	useCreateCommentMutation,
	useGetCommentsQuery,
	useCommentActionsMutation,
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} = commentsApiSlice;
