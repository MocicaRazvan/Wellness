import { apiSlice } from "../api/apiSlice";

export const exercisesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createExercise: builder.mutation({
			query: (exercise) => ({
				url: "/exercises/create",
				method: "POST",
				body: exercise,
			}),
			transformResponse: ({ exercise }) => ({ ...exercise, id: exercise._id }),
			invalidatesTags: (result, err, arg) => [
				{ type: "Exercise", id: arg.id },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getUsersExercises: builder.query({
			query: ({ id, page, pageSize, sort, search }) => ({
				url: `/exercises/user/${id}`,
				method: "GET",
				params: { page, pageSize, sort, search },
			}),
			transformResponse: ({ exercises, total }) => {
				const loadedExercises = exercises.map((exercise) => ({
					...exercise,
					id: exercise._id,
				}));
				return { exercises: loadedExercises, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Exercise", id: "LIST" },
						...result.exercises.map((exercise) => ({
							type: "Exercise",
							id: exercise.id,
						})),
					];
				} else return [{ type: "Exercise", id: "LIST" }];
			},
		}),
		deleteExercise: builder.mutation({
			query: ({ id }) => ({
				url: `/exercises/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Exercise", id: arg.id },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getExerciseById: builder.query({
			query: ({ id }) => ({ url: `/exercises/${id}` }),
			transformResponse: ({ exercise }) => ({ ...exercise, id: exercise._id }),
			providesTags: (result, err, arg) => [{ type: "Exercise", id: arg.id }],
		}),
		updateExercise: builder.mutation({
			query: ({ id, ...rest }) => ({
				url: `/exercises/${id}`,
				method: "PUT",
				body: rest,
			}),
			transformResponse: ({ updatedExercise }) => ({
				...updatedExercise,
				id: updatedExercise._id,
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Exercise", id: arg.id },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getAllExercisesIdsByUser: builder.query({
			query: ({ id }) => `/exercises/user/ids/${id}`,
			transformResponse: ({ ids }) =>
				ids.map(({ _id, title }) => ({ id: _id, title })),
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Exercise", id: "LIST" },
						...result.map((exercise) => ({
							type: "Exercise",
							id: exercise.id,
						})),
					];
				} else return [{ type: "Exercise", id: "LIST" }];
			},
		}),
	}),
});

export const {
	useCreateExerciseMutation,
	useGetUsersExercisesQuery,
	useDeleteExerciseMutation,
	useGetExerciseByIdQuery,
	useUpdateExerciseMutation,
	useGetAllExercisesIdsByUserQuery,
} = exercisesApiSlice;
