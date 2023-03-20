import { apiSlice } from "../api/apiSlice";
import { setTrainingsValues } from "./trainingsSlice";

export const trainingApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createTrining: builder.mutation({
			query: (training) => ({
				url: "/trainings/create",
				method: "POST",
				body: training,
			}),
			invalidatesTags: [
				{ type: "Training", id: "LIST" },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		getTrainings: builder.query({
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
					url: "/trainings",
					params: params,
				};
			},
			transformResponse: ({ trainings, page, pages, count }) => {
				const loadedTrainings = trainings.map((training) => ({
					...training,
					id: training._id,
				}));

				return { trainings: loadedTrainings, page, pages, count };
			},
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setTrainingsValues(data));
				} catch (error) {
					console.log(error);
				}
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Training", id: "LIST" },
						...result.trainings.map((training) => ({
							type: "Training",
							id: training.id,
						})),
					];
				} else return [{ type: "Training", id: "LIST" }];
			},
		}),
		getUserTrainings: builder.query({
			query: (credentials) => ({
				url: `/trainings/user`,
				method: "GET",
				params: credentials,
			}),
			transformResponse: ({ trainings, total }) => {
				const loadedTrainings = trainings.map((training) => ({
					...training,
					id: training._id,
				}));
				return { trainings: loadedTrainings, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Training", id: "LIST" },
						...result.trainings.map((training) => ({
							type: "Training",
							id: training.id,
						})),
					];
				} else return [{ type: "Training", id: "LIST" }];
			},
		}),
		getBoughtUserTrainings: builder.query({
			query: (credentials) => ({
				url: `/trainings/user/bought`,
				method: "GET",
				params: credentials,
			}),
			transformResponse: ({ trainings, total }) => {
				const loadedTrainings = trainings.map((training) => ({
					...training,
					id: training._id,
				}));
				return { trainings: loadedTrainings, total };
			},
			providesTags: (result, err, arg) => {
				if (result) {
					return [
						{ type: "Training", id: "LIST" },
						...result.trainings.map((training) => ({
							type: "Training",
							id: training.id,
						})),
					];
				} else return [{ type: "Training", id: "LIST" }];
			},
		}),

		deleteTraining: builder.mutation({
			query: ({ id }) => ({
				url: `/trainings/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Training", id: arg.id },
				{ type: "Training", id: "LIST" },
				{ type: "Exercise", id: "LIST" },
			],
		}),
		trainingActions: builder.mutation({
			query: ({ id, action }) => ({
				url: `/trainings/action/${action}/${id}`,
				method: "PUT",
			}),
			invalidatesTags: (result, err, arg) => [
				{ type: "Training", id: arg.id },
				//{ type: "Post", id: "LIST" },
			],
		}),
		getSingleTraining: builder.query({
			query: ({ id }) => ({
				url: `/trainings/${id}`,
			}),
			transformResponse: ({ training }) => ({ ...training, id: training._id }),
			providesTags: (result, err, arg) => [
				{ type: "Training", id: arg.id },
				{ type: "Training", id: "LIST" },
			],
		}),
		getTrainingsByOrder: builder.query({
			query: ({ orderId }) => ({ url: `/trainings/orders/${orderId}` }),
			transformResponse: ({ trainings, total, user }) => ({
				trainings: trainings?.map((t) => ({ ...t, id: t._id })),
				total,
				user,
			}),
			providesTags: (result, err, arg) => [
				{ type: "Training", id: arg.id },
				{ type: "Training", id: "LIST" },
			],
		}),
	}),
});

export const {
	useCreateTriningMutation,
	useGetUserTrainingsQuery,
	useDeleteTrainingMutation,
	useTrainingActionsMutation,
	useGetSingleTrainingQuery,
	useGetTrainingsQuery,
	useGetBoughtUserTrainingsQuery,
	useGetTrainingsByOrderQuery,
} = trainingApiSlice;
