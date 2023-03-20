import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";
import authReducer from "./auth/authSlice";
import postsReducer from "./posts/postsSlice";
import searchReducer from "./searchState/searchSlice";
import exercisesReducer from "./exercises/exercisesSlice";
import trainingsReducer from "./trainings/trainingsSlice";
import cartReducer from "./cart/cartSlice";
import socketReducer from "./socket/socketSlice";
import notificationsReducer from "./notifications/notificationsSlice";
import messagesReducer from "./messages/messagesSlice";

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		auth: authReducer,
		posts: postsReducer,
		search: searchReducer,
		exercises: exercisesReducer,
		trainings: trainingsReducer,
		cart: cartReducer,
		socket: socketReducer,
		notifications: notificationsReducer,
		messages: messagesReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredPaths: ["socket.socket", "payload.socket"],
				ignoreActions: ["socket/initializeSocket"],
			},
		}).concat(apiSlice.middleware),
	//getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);
