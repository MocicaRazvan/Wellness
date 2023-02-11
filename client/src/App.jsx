import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentMode } from "./redux/auth/authSlice";
import { themeSettings } from "./theme";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Test from "./components/Test";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/home/Home";
import Register from "./pages/RegisterLogin/Register";
import FrogotPassword from "./pages/RegisterLogin/FrogotPassword";
import ResetPassword from "./pages/RegisterLogin/ResetPassword";
import ProtectedLayout from "./layouts/ProtectedLayout";
import CreatePost from "./pages/posts/CreatePost";
import AllPosts from "./pages/posts/AllPosts";
import SinglePost from "./pages/posts/SinglePost";
import UsersPosts from "./pages/posts/UsersPosts";
import UpdatePost from "./pages/posts/UpdatePost";
import CreateExercise from "./pages/exercises/CreateExercise";
import SingleExercise from "./pages/exercises/SingleExercise";
import UserExercises from "./pages/exercises/UserExercises";
import UpdateExercise from "./pages/exercises/UpdateExercise";
import CreateTraining from "./pages/trainings/CreateTraining";
import SingleTraining from "./pages/trainings/SingleTraining";
import UserTrainings from "./pages/trainings/UserTrainings";
import AllTrainings from "./pages/trainings/AllTrainings";
import Cart from "./pages/Cart/Cart";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import Orders from "./pages/orders/Orders";
import UserProfile from "./pages/user/UserProfile";
import MessengerWrapper from "./pages/messenger/MessengerWrapper";
import NotFound from "./pages/notFound/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AllPostsAdmin from "./pages/admin/AllPostsAdmin";
import Dashboard from "./pages/admin/Dashboard";
import AllUsers from "./pages/admin/AllUsers";
import AllOrders from "./pages/admin/AllOrders";
import Geography from "./pages/admin/Geography";
import Overview from "./pages/admin/Overview";
import Daily from "./pages/admin/Daily";
import Breakdown from "./pages/admin/Breakdown";

function App() {
	const mode = useSelector(selectCurrentMode);
	const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

	return (
		<div className="app">
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Routes>
						<Route element={<MainLayout />}>
							<Route index element={<Home />} />
							<Route path="/register" element={<Register />} />
							<Route path="/login" element={<Register />} />
							<Route path="/forgotPassword" element={<FrogotPassword />} />
							<Route
								path="/resetPassword/:resetToken"
								element={<ResetPassword />}
							/>
							<Route path="/posts">
								<Route index element={<AllPosts />} />
								<Route path="find/:postId" element={<SinglePost />} />
							</Route>
							<Route path="/trainings">
								<Route path="/trainings" element={<AllTrainings />} />
								<Route path="find/:trainingId" element={<SingleTraining />} />
							</Route>
							<Route element={<ProtectedLayout />}>
								<Route path="/posts">
									<Route path="create" element={<CreatePost />} />
									<Route path="user" element={<UsersPosts />} />
									<Route path="user/edit/:postId" element={<UpdatePost />} />
								</Route>
								<Route path="/exercises">
									<Route path="create" element={<CreateExercise />} />
									<Route path="user" element={<UserExercises />} />
									<Route path="find/:exerciseId" element={<SingleExercise />} />
									<Route
										path="update/:exerciseId"
										element={<UpdateExercise />}
									/>
								</Route>
								<Route path="/trainings">
									<Route path="user" element={<UserTrainings />} />
									<Route path="create" element={<CreateTraining />} />
								</Route>
								<Route path="/cart" element={<Cart />} />
								<Route path="/checkout-success" element={<CheckoutSuccess />} />
								<Route path="/orders" element={<Orders />} />
								<Route path="/user">
									<Route path="profile" element={<UserProfile />} />
									<Route path="update" element={<Register />} />
								</Route>
								<Route path="/messenger">
									<Route index element={<MessengerWrapper />} />
								</Route>
							</Route>
							<Route path="/admin" element={<AdminLayout />}>
								<Route path="dashboard" element={<Dashboard />} />
								<Route path="posts" element={<AllPostsAdmin />} />
								<Route path="users" element={<AllUsers />} />
								<Route path="orders" element={<AllOrders />} />
								<Route path="geography" element={<Geography />} />
								<Route path="overview" element={<Overview />} />
								<Route path="daily" element={<Daily />} />
								<Route path="breakdown" element={<Breakdown />} />
							</Route>
							<Route path="*" element={<NotFound />} />
						</Route>
						<Route path="/test" element={<Test />} />
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
