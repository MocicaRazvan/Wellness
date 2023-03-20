import { useState } from "react";
import {
	Box,
	Button,
	TextField,
	useMediaQuery,
	Typography,
	useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate, useLocation } from "react-router-dom";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/reusable/FlexBetween";
import {
	useLoginMutation,
	useRegisterMutation,
} from "../../redux/auth/authApiSlice";
import { useUpdateUserMutation } from "../../redux/user/userApi";
import Loading from "../../components/reusable/Loading";
import CustomCarousel from "../../components/reusable/CustomCarousel";

const registerSchema = yup.object().shape({
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
	retypePassword: yup
		.string()
		.required("Please retype your password.")
		.oneOf([yup.ref("password")], "Your passwords do not match."),
	location: yup.string().required("required"),
	occupation: yup.string().required("required"),
	picture: yup.string(),
	phoneNumber: yup
		.string()
		.matches(
			/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
			"Phone number is not valid",
		),
});

const loginSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
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

	const [loginUser] = useLoginMutation();
	const [registerUser] = useRegisterMutation();
	const [updateUser] = useUpdateUserMutation();

	const initialValuesRegister = {
		firstName: user?.username.split(" ")[0] || "",
		lastName: user?.username.split(" ")[1] || "",
		email: user?.email || "",
		password: "",
		location: user?.location || "",
		occupation: user?.occupation || "",
		picture: "",
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
			setLoading((prev) => ({ ...prev, show: true }));
			const res = await loginUser(values).unwrap();
			setLoading((prev) => ({ ...prev, show: false }));
			if (res?.data?.error) {
				console.log(res.error.data.message);
				setMessage(res.error.data.message);
			}
			setMessage("");
			onSubmitProps.resetForm();
			navigate("/");
		} catch (error) {
			console.log(error);
			setLoading((prev) => ({ ...prev, show: false }));
			onSubmitProps.resetForm();
			setCredentials((prev) => ({
				...prev,
				show: true,
				msg: "Credentials are not valid!",
			}));

			setTimeout(
				() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
				800,
			);
		}
	};
	const register = async (values, onSubmitProps) => {
		try {
			let res1, res2;
			if (user) {
				setLoading((prev) => ({ ...prev, show: true }));
				res2 = await updateUser(values).unwrap();
				console.log({ res2 });
				setLoading((prev) => ({ ...prev, show: false }));
				navigate("/");
			} else {
				setLoading((prev) => ({ ...prev, show: true }));
				res1 = await registerUser(values).unwrap();
				console.log({ res1 });
				setLoading((prev) => ({ ...prev, show: false }));
			}
			if (res1?.message && res1?.isError) {
				setLoading((prev) => ({ ...prev, show: false }));

				setMessage("User with this email already exists!");
				setCredentials((prev) => ({
					...prev,
					show: true,
					msg: "Email is taken!",
				}));

				setTimeout(
					() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
					800,
				);
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
			const username = `${values.firstName} ${values.lastName}`;

			const { email, location, occupation, password, picture } = values;
			const phoneNumber = values.phoneNumber || "";
			const credentials = {
				email,
				location,
				occupation,
				password,
				image: picture,
				username,
				phoneNumber,
			};
			await register(credentials, onSubmitProps);
		} else if (isLogin) {
			await login(values, onSubmitProps);
		}
	};

	return (
		<Box>
			<Loading loading={loading} />
			<Loading loading={credentials} type="alert" />
			<Formik
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
										label="PhoneNumber"
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
																If no picture is added the old one will stay
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
														<FlexBetween>
															<Typography>Picture selected</Typography>
															<EditOutlinedIcon />
														</FlexBetween>
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
													{openCarousel ? "Hide" : "See"} your pictures
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
								error={
									(Boolean(touched.email) && Boolean(errors.email)) ||
									message !== ""
								}
								helperText={touched.email && errors.email}
								sx={{ gridColumn: "span 4" }}
							/>
							<TextField
								label="Password"
								type="password"
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
							/>
							{!isLogin && (
								<TextField
									label="Retype Password"
									type="password"
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

							<Typography
								onClick={() => {
									setPageType(isLogin ? "register" : "login");
									resetForm();
								}}
								gutterBottom
								sx={{
									textDecoration: "underline",
									color: palette.primary.main,
									"&:hover": {
										cursor: "pointer",
										color: palette.primary.light,
									},
								}}>
								{isLogin
									? "Don't have an account? Sign Up here."
									: "Already have an account? Login here."}
							</Typography>
							<Typography
								onClick={() => navigate("/forgotPassword")}
								sx={{
									textDecoration: "underline",
									color: palette.primary.main,
									"&:hover": {
										cursor: "pointer",
										color: palette.primary.light,
									},
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
