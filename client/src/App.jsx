import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Test from "./components/Test";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./layouts/MainLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Cart from "./pages/Cart/Cart";
import FrogotPassword from "./pages/RegisterLogin/FrogotPassword";
import Register from "./pages/RegisterLogin/Register";
import ResetPassword from "./pages/RegisterLogin/ResetPassword";
import OurStory from "./pages/aboutUs/OurStory";
import TermsAndConditions from "./pages/aboutUs/TermsAndConditions";
import AdminTrainings from "./pages/admin/AdminTrainings";
import AllOrders from "./pages/admin/AllOrders";
import AllPostsAdmin from "./pages/admin/AllPostsAdmin";
import AllUsers from "./pages/admin/AllUsers";
import Breakdown from "./pages/admin/Breakdown";
import Daily from "./pages/admin/Daily";
import Dashboard from "./pages/admin/Dashboard";
import Email from "./pages/admin/Email";
import Geography from "./pages/admin/Geography";
import Overview from "./pages/admin/Overview";
import Calculator from "./pages/calculator/Calculator";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";
import Faq from "./pages/customerCare/Faq";
import OrderTroubleshoot from "./pages/customerCare/OrderTroubleshoot";
import CreateExercise from "./pages/exercises/CreateExercise";
import SingleExercise from "./pages/exercises/SingleExercise";
import UpdateExercise from "./pages/exercises/UpdateExercise";
import UserExercises from "./pages/exercises/UserExercises";
import Home from "./pages/home/Home";
import MessengerWrapper from "./pages/messenger/MessengerWrapper";
import NotFound from "./pages/notFound/NotFound";
import Orders from "./pages/orders/Orders";
import SingleOrder from "./pages/orders/SingleOrder";
import AllPosts from "./pages/posts/AllPosts";
import CreatePost from "./pages/posts/CreatePost";
import SinglePost from "./pages/posts/SinglePost";
import UpdatePost from "./pages/posts/UpdatePost";
import UsersPosts from "./pages/posts/UsersPosts";
import Earnings from "./pages/statistics/Earnings";
import Spendings from "./pages/statistics/Spendings";
import AllTrainings from "./pages/trainings/AllTrainings";
import BoughtTrainings from "./pages/trainings/BoughtTrainings";
import CreateTraining from "./pages/trainings/CreateTraining";
import SingleTraining from "./pages/trainings/SingleTraining";
import UpdateTraining from "./pages/trainings/UpdateTraining";
import UserTrainings from "./pages/trainings/UserTrainings";
import AutorProfile from "./pages/user/AutorProfile";
import UserProfile from "./pages/user/UserProfile";
import { selectCurrentMode } from "./redux/auth/authSlice";
import { themeSettings } from "./theme";

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
									<Route path="bought" element={<BoughtTrainings />} />
									<Route
										path="user/edit/:trainingId"
										element={<UpdateTraining />}
									/>
								</Route>
								<Route path="/cart" element={<Cart />} />
								<Route path="/checkout-success" element={<CheckoutSuccess />} />
								<Route path="/orders">
									<Route index element={<Orders />} />
									<Route path=":orderId" element={<SingleOrder />} />
								</Route>
								<Route path="/user">
									<Route path="profile" element={<UserProfile />} />
									<Route path="update" element={<Register />} />
									<Route path="author" element={<AutorProfile />} />
								</Route>
								<Route path="/messenger">
									<Route index element={<MessengerWrapper />} />
								</Route>
								<Route path="/statistics">
									<Route path="spendings" element={<Spendings />} />
									<Route path="earnings" element={<Earnings />} />
								</Route>
								<Route path="/calculator" element={<Calculator />} />
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
								<Route path="trainings" element={<AdminTrainings />} />
								<Route path="email" element={<Email />} />
							</Route>
							<Route path="/about-us">
								<Route
									path="terms-conditions"
									element={<TermsAndConditions />}
								/>
								<Route path="our-story" element={<OurStory />} />
							</Route>
							<Route path="/customer-care">
								<Route path="faq" element={<Faq />} />
								<Route
									path="order-troubleshoot"
									element={<OrderTroubleshoot />}
								/>
							</Route>
							<Route path="*" element={<NotFound />} />
							{/* <Route path="test" element={<Test />} /> */}
						</Route>
					</Routes>
				</ThemeProvider>
			</BrowserRouter>
		</div>
	);
}

export default App;
