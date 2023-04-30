import { Visibility } from "@mui/icons-material";
import {
	Box,
	Button,
	InputAdornment,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import Loading from "../../components/reusable/Loading";
import {
	useLoginMutation,
	useRegisterMutation,
} from "../../redux/auth/authApiSlice";
import { useUpdateUserMutation } from "../../redux/user/userApi";

const registerSchema = yup.object().shape({
	firstName: yup
		.string()
		.required("Please enter your first name")
		.transform((_, v) => v.trim()),
	lastName: yup
		.string()
		.required("Please enter your last name")
		.transform((_, v) => v.trim()),
	email: yup
		.string()
		.email("invalid email")
		.required("Please enter the email")
		.transform((_, v) => v.trim()),
	password: yup.string().required("Please enter the password"),
	retypePassword: yup
		.string()
		.required("Please retype your password.")
		.oneOf([yup.ref("password")], "Your passwords do not match."),
	location: yup
		.string()
		.required("Please enter your location")
		.transform((_, v) => v.trim()),
	occupation: yup
		.string()
		.required("Please enter your occupation")
		.transform((_, v) => v.trim()),
	picture: yup.string(),
	phoneNumber: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			"Phone number is not valid",
		)
		.required("Please enter your phone")
		.transform((_, v) => v.trim()),
});

const loginSchema = yup.object().shape({
	email: yup
		.string()
		.email("invalid email")
		.required("Please enter the email")
		.transform((_, v) => v.trim()),
	password: yup.string().required("Please enter the password"),
});

const initialValuesLogin = {
	email: "",
	password: "",
};

const Form = ({ user = null }) => {
	const { pathname } = useLocation();
	const [pageType, setPageType] = useState(pathname.slice(1));
	const [credentials, setCredentials] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const [openCarousel, setOpenCarousel] = useState(false);

	const [message, setMessage] = useState("");
	const [messageUpload, setMessageUpload] = useState("");
	const [loading, setLoading] = useState({
		msg: "Loading...",
		show: false,
	});
	const { palette } = useTheme();
	const navigate = useNavigate();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const isLogin = pageType === "login";
	const isRegister = pageType === "register" || user;
	const [changed, setChanged] = useState(false);
	const [loginUser] = useLoginMutation();
	const [registerUser] = useRegisterMutation();
	const [updateUser] = useUpdateUserMutation();
	const [show, setShow] = useState({ password: false, retype: false });
	useEffect(() => {
		setPageType(pathname.slice(1));
	}, [pathname]);

	const isUpdate = useLocation()
		.pathname?.split("/")
		.some((e) => ["update"].includes(e));

	// useEffect(() => {
	// 	if (pathname.slice(1) === "login") {
	// 		setPageType("login");
	// 		navigate("/login");
	// 	} else if (pathname.slice(1) === "register") {
	// 		setPageType("register");
	// 		navigate("/register");
	// 	}
	// }, [navigate, pathname]);

	console.log({ pageType });

	const initialValuesRegister = {
		firstName: user?.username.split(" ")[0] || "",
		lastName: user?.username.split(" ")[1] || "",
		email: user?.email || "",
		password: "",
		location: user?.location || "",
		occupation: user?.occupation || "",
		picture: user?.image?.url || "",
		phoneNumber: user?.phoneNumber || "",
		retypePassword: "",
	};

	const fileBase64 = (img) => {
		return new Promise((resolve, reject) => {
			let fileReader = new FileReader();
			fileReader.onerror = reject;
			fileReader.onload = function () {
				resolve(fileReader.result);
			};
			fileReader.readAsDataURL(img);
		});
	};

	const login = async (values, onSubmitProps) => {
		try {
			// setLoading((prev) => ({ ...prev, show: true }));
			const res = await loginUser(values).unwrap();
			// setLoading((prev) => ({ ...prev, show: false }));
			if (res?.data?.error) {
				console.log(res.error.data.message);
				setMessage(res.error.data.message);
			}
			setMessage("");

			onSubmitProps.resetForm();
			navigate("/");
		} catch (error) {
			console.log(error);
			// setLoading((prev) => ({ ...prev, show: false }));
			onSubmitProps.setFieldError("email", "Credentials are not valid!");
			onSubmitProps.setFieldError("password", "Credentials are not valid!");
			setCredentials((prev) => ({
				...prev,
				show: true,
				msg: "Credentials are not valid!",
			}));

			setTimeout(
				() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
				2000,
			);
		}
	};
	const register = async (values, onSubmitProps) => {
		try {
			let res1, res2;
			if (user) {
				setLoading((prev) => ({ ...prev, show: true }));
				res2 = await updateUser(values);
				console.log({ res2 });
				setLoading((prev) => ({ ...prev, show: false }));
				if (res2?.error?.data?.isError) {
					if (res2?.error?.data?.error === "credentials") {
						setCredentials((prev) => ({
							...prev,
							show: true,
							msg: "Password is incorect!",
						}));

						onSubmitProps.setFieldError("password", "Password is incorect!");
						onSubmitProps.setFieldError(
							"retypePassword",
							"Password is incorect!",
						);

						setTimeout(
							() =>
								setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
							1200,
						);
					} else if (res2?.error?.data?.error === "username") {
						setCredentials((prev) => ({
							...prev,
							show: true,
							msg: "User with this combinations of names already exists!",
						}));
						onSubmitProps.setFieldError(
							"firstName",
							"User with this combinations of names already exists!",
						);
						onSubmitProps.setFieldError(
							"lastName",
							"User with this combinations of names already exists!",
						);

						setTimeout(
							() =>
								setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
							1800,
						);
					}
				} else {
					navigate("/user/profile", { state: { open: true } });
				}
			} else {
				setLoading((prev) => ({ ...prev, show: true }));
				res1 = await registerUser(values);

				setLoading((prev) => ({ ...prev, show: false }));
				if (res1?.error?.data?.isError) {
					if (res1?.error?.data?.error === "email") {
						setCredentials((prev) => ({
							...prev,
							show: true,
							msg: "Email is taken!",
						}));
						onSubmitProps.setFieldError(
							"email",
							"User with this email already exists!",
						);

						setTimeout(
							() =>
								setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
							1200,
						);
					} else if (res1?.error?.data?.error === "username") {
						setCredentials((prev) => ({
							...prev,
							show: true,
							msg: "User with this combinations of names already exists!",
						}));
						onSubmitProps.setFieldError(
							"firstName",
							"User with this combinations of names already exists!",
						);
						onSubmitProps.setFieldError(
							"lastName",
							"User with this combinations of names already exists!",
						);

						setTimeout(
							() =>
								setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
							1800,
						);
					}
				} else {
					navigate("/");
				}
			}
		} catch (error) {
			console.log(error);
			if (error.data.update) {
				setLoading((prev) => ({ ...prev, show: false }));

				setMessageUpload(
					"If you cant't remember your passwowrd you can reset it!",
				);
				setCredentials((prev) => ({
					...prev,
					show: true,
					msg: "Incorrect password!",
				}));

				setTimeout(
					() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
					800,
				);
			}
		}
	};

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (isRegister) {
			const username = `${values.firstName.trim()} ${values.lastName.trim()}`;

			const { email, location, occupation, password, picture, phoneNumber } =
				values;
			// const phoneNumber = values.phoneNumber || "";
			const isNotChanged = user && !changed;
			const credentials = {
				email: email.trim(),
				location: location.trim(),
				occupation: occupation.trim(),
				password,
				image: isNotChanged ? "" : picture,
				username,
				phoneNumber: phoneNumber.trim(),
			};

			await register(credentials, onSubmitProps);
		} else if (isLogin) {
			const { email, password } = values;
			await login({ email: email.trim(), password }, onSubmitProps);
		}
	};
	return (
		<Box>
			<Loading loading={loading} />
			{/* <Loading loading={credentials} type="alert" /> */}
			<Formik
				enableReinitialize
				onSubmit={handleFormSubmit}
				initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
				validationSchema={isLogin ? loginSchema : registerSchema}>
				{({
					values,
					errors,
					touched,
					handleBlur,
					handleChange,
					handleSubmit,
					setFieldValue,
					resetForm,
				}) => (
					<form onSubmit={handleSubmit}>
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4,minmax(0,1fr))"
							sx={{
								"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
							}}>
							{isRegister && (
								<>
									<TextField
										label="First Name"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.firstName}
										name="firstName"
										error={
											Boolean(touched.firstName) && Boolean(errors.firstName)
										}
										helperText={touched.firstName && errors.firstName}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField
										label="Last Name"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.lastName}
										name="lastName"
										error={
											Boolean(touched.lastName) && Boolean(errors.lastName)
										}
										helperText={touched.lastName && errors.lastName}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField
										label="Location"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.location}
										name="location"
										error={
											Boolean(touched.location) && Boolean(errors.location)
										}
										helperText={touched.location && errors.location}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField
										label="Phone Number"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.phoneNumber}
										name="phoneNumber"
										error={
											Boolean(touched.phoneNumber) &&
											Boolean(errors.phoneNumber)
										}
										helperText={touched.phoneNumber && errors.phoneNumber}
										sx={{ gridColumn: "span 2" }}
									/>
									<TextField
										label="Occupation"
										onBlur={handleBlur}
										onChange={handleChange}
										value={values.occupation}
										name="occupation"
										error={
											Boolean(touched.occupation) && Boolean(errors.occupation)
										}
										helperText={touched.occupation && errors.occupation}
										sx={{ gridColumn: "span 4" }}
									/>
									<Box
										gridColumn="span 4"
										// border={`1px solid ${palette.secondary[200]}`}
										borderRadius="5px"
										// p="1rem"
									>
										<Dropzone
											accept={{
												"image/*": [".jpg", ".jpeg"],
											}}
											multiple={false}
											onDrop={(acceptedFiles) => {
												Promise.all(
													Array.from(acceptedFiles).map(
														async (i) => await fileBase64(i),
													),
												)
													.then((urls) => {
														setFieldValue("picture", urls[0]);
														setChanged(true);
													})
													.catch((error) => {
														console.error(error);
													});
											}}>
											{({ getRootProps, getInputProps }) => (
												<Box
													{...getRootProps()}
													// border={`2px dashed ${palette.primary.main}`}
													p="1rem"
													sx={{ "&:hover": { cursor: "pointer" } }}>
													<input {...getInputProps()} />
													{!values.picture ? (
														user ? (
															<Typography
																variant="h5"
																color={palette.secondary[200]}
																textAlign="center"
																fontWeight="bold">
																{/* If no picture is added the old one will stay */}
																Add picture
															</Typography>
														) : (
															<Typography
																variant="h5"
																color={palette.secondary[200]}
																textAlign="center"
																fontWeight="bold">
																Add Picture
															</Typography>
														)
													) : (
														<Typography
															variant="h5"
															color={palette.secondary[200]}
															textAlign="center"
															fontWeight="bold">
															Picture selected
														</Typography>
													)}
												</Box>
											)}
										</Dropzone>
										{values.picture && (
											<Box
												gridColumn="span 4"
												display="flex"
												flexDirection="column"
												alignItems="center">
												<Button
													variant="outlined"
													onClick={() => setOpenCarousel((prev) => !prev)}
													sx={{
														color: palette.secondary[200],
														width: "50%",
													}}>
													{openCarousel ? "Hide" : "See"} your picture
												</Button>
												{openCarousel && (
													<CustomCarousel
														images={[values.picture]}
														height={250}
													/>
												)}
											</Box>
										)}
									</Box>
								</>
							)}
							<TextField
								label="Email"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								name="email"
								disabled={isUpdate}
								error={Boolean(touched.email) && Boolean(errors.email)}
								helperText={touched.email && errors.email}
								sx={{ gridColumn: "span 4" }}
							/>
							<TextField
								label="Password"
								type={!show.password ? "password" : "text"}
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.password}
								name="password"
								error={
									(Boolean(touched.password) && Boolean(errors.password)) ||
									messageUpload !== ""
								}
								helperText={touched.password && errors.password}
								sx={{ gridColumn: "span 4" }}
								InputProps={{
									endAdornment: (
										<InputAdornment
											position="end"
											sx={{
												cursor: "pointer",
											}}
											onClick={() =>
												setShow((prev) => ({
													...prev,
													password: !prev.password,
												}))
											}>
											<Visibility
												sx={{
													"&:hover": {
														color: palette.secondary[300],
													},
												}}
											/>
										</InputAdornment>
									),
								}}
							/>
							{!isLogin && (
								<TextField
									label="Retype Password"
									type={!show.retype ? "password" : "text"}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.retypePassword}
									name="retypePassword"
									error={
										(Boolean(touched.retypePassword) &&
											Boolean(errors.retypePassword)) ||
										messageUpload !== ""
									}
									helperText={touched.retypePassword && errors.retypePassword}
									sx={{ gridColumn: "span 4" }}
									InputProps={{
										endAdornment: (
											<InputAdornment
												position="end"
												sx={{
													cursor: "pointer",
												}}
												onClick={() =>
													setShow((prev) => ({
														...prev,
														retype: !prev.retype,
													}))
												}>
												<Visibility
													sx={{
														"&:hover": {
															color: palette.secondary[300],
														},
													}}
												/>
											</InputAdornment>
										),
									}}
								/>
							)}
						</Box>
						{/* buttons */}
						<Box>
							<Button
								fullWidth
								type="submit"
								sx={{
									m: "2rem 0",
									p: "1rem",
									backgroundColor: palette.background.default,
									color: palette.secondary[300],
									"&:hover": { color: palette.primary.main },
								}}>
								{isLogin ? "LOGIN" : user ? "UPDATE" : "REGISTER"}
							</Button>

							{!isUpdate && (
								<Typography
									onClick={() => {
										setPageType(isLogin ? "register" : "login");
										navigate(isLogin ? "/register" : "/login");
										resetForm();
									}}
									gutterBottom
									sx={{
										textDecoration: "underline",
										color: palette.secondary[200],
										"&:hover": {
											cursor: "pointer",
											color: palette.primary.light,
										},
										width: "fit-content",
									}}>
									{isLogin
										? "Don't have an account? Sign Up here."
										: "Already have an account? Login here."}
								</Typography>
							)}
							<Typography
								onClick={() =>
									isUpdate
										? navigate("/forgotPassword", { state: user?.email })
										: navigate("/forgotPassword")
								}
								sx={{
									textDecoration: "underline",
									color: palette.secondary[200],
									"&:hover": {
										cursor: "pointer",
										color: palette.primary.light,
									},
									width: "fit-content",
								}}>
								Forgot your password?
							</Typography>
						</Box>
					</form>
				)}
			</Formik>
			{message && (
				<Typography variant="h5" sx={{ mt: 5, color: palette.secondary[200] }}>
					{message}
				</Typography>
			)}
			{messageUpload && (
				<Typography variant="h5" sx={{ mt: 5, color: palette.secondary[200] }}>
					{message}
				</Typography>
			)}
		</Box>
	);
};

export default Form;
