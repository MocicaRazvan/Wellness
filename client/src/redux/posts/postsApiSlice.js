import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import { setValues } from "./postsSlice";

const postAdapter = createEntityAdapter({
	selectId: (post) => post.id,
	sortComparer: (a, b) => (a.createdAt < b.createdAt ? 1 : -1),
});

export const postApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPosts: builder.query({
			query: ({ search, tags, sorting, page, limit }) => {
				const params = {};
				if (search) {
					params.search = search;
				}
				if (tags?.length > 0) {
					params.tags = tags;
				}
				if (sorting) {
					params.sort = JSON.stringify(sorting);
				}
				if (page) {
					params.page = page;
				}
				if (limit) {
					params.limit = limit;
				}
				return {
					url: "/posts",
					params: params,
				};
			},
			transformResponse: ({ posts, page, pages, count }) => {
				const loadedPosts = posts.map((post) => ({
					...post,
					id: post._id,
				}));

				return { posts: loadedPosts, page, pages, count };
			},
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setValues(data));
				} catch (error) {
					console.log(error);
				}
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Post", id: "LIST" },
						...result.posts.map((post) => ({ type: "Post", id: post.id })),
					];
				} else return [{ type: "Post", id: "LIST" }];
			},
		}),
		createPost: builder.mutation({
			query: (post) => ({
				url: "/posts/create",
				method: "POST",
				body: post,
			}),
			invalidatesTags: [{ type: "Post", id: "LIST" }],
		}),
		updatePost: builder.mutation({
			query: ({ id, body, title, images, tags }) => ({
				url: `/posts/${id}`,
				method: "PUT",
				body: { body, title, images, tags },
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Post", id: arg.id },
				{ type: "Post", id: "LIST" },
			],
		}),
		getPostsByUser: builder.query({
			///query: () => ({ url: "/posts/user" }),
			query: ({ search, tags, sorting, page, limit, id }) => {
				console.log(search, tags, sorting);
				const params = {};
				if (search) {
					params.search = search;
				}
				if (tags?.length > 0) {
					params.tags = tags;
				}
				if (sorting) {
					params.sort = JSON.stringify(sorting);
				}
				if (page) {
					params.page = page;
				}
				if (limit) {
					params.limit = limit;
				}
				return {
					url: `/posts/user/${id}`,
					params: params,
				};
			},
			transformResponse: ({ posts, page, pages, count }) => {
				const usersPosts = posts.map((post) => ({ ...post, id: post._id }));
				console.log({ posts: usersPosts, page, pages, count });
				return { posts: usersPosts, page, pages, count };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Post", id: "LIST" },
						...result?.posts?.map((post) => ({ type: "Post", id: post.id })),
					];
				} else return [{ type: "Post", id: "LIST" }];
			},
		}),
		deletePost: builder.mutation({
			query: ({ id }) => ({
				url: `/posts/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Post", id: arg.id },
				{ type: "Post", id: "LIST" },
			],
		}),
		getPostById: builder.query({
			query: ({ id }) => ({ url: `/posts/find/${id}` }),
			transformResponse: ({ post }) => {
				post.id = post._id;
				return { post };
			},
			providesTags: (result, err, arg) => [
				{ type: "Post", id: arg.id },
				{ type: "Post", id: "LIST" },
			],
		}),
		postActions: builder.mutation({
			query: ({ id, action }) => ({
				url: `/posts/action/${action}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Post", id: arg.id },
				//{ type: "Post", id: "LIST" },
			],
		}),
		getPostsAdmin: builder.query({
			query: (params) => ({
				url: "/posts/admin",
				method: "GET",
				params,
			}),
			transformResponse: ({ posts }) => {
				const loadedPosts = posts.map((post) => ({
					...post,
					id: post._id,
				}));
				return { posts: loadedPosts };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Post", id: "LIST" },
						...result.posts.map((post) => ({
							type: "Post",
							id: post.id,
						})),
					];
				} else return [{ type: "Post", id: "LIST" }];
			},
		}),
	}),
});

export const {
	useCreatePostMutation,
	useGetPostsQuery,
	useGetPostsByUserQuery,
	useDeletePostMutation,
	useUpdatePostMutation,
	useGetPostByIdQuery,
	usePostActionsMutation,
	useGetPostsAdminQuery,
} = postApiSlice;

export const postsSelector = postAdapter.getSelectors((state) => state.posts);
