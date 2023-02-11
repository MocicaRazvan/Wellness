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

const registerSchema = yup.object().shape({
	firstName: yup.string().required("required"),
	lastName: yup.string().required("required"),
	email: yup.string().email("invalid email").required("required"),
	password: yup.string().required("required"),
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
	const [image, setImage] = useState("");
	const [message, setMessage] = useState("");
	// const { state: user } = useLocation();
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
			const res = await loginUser(values);
			if (res?.error) {
				setMessage(res.error.data.message);
			}
			setMessage("");
			onSubmitProps.resetForm();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};
	const register = async (values, onSubmitProps) => {
		try {
			let res;
			if (user) {
				res = await updateUser(values);
			} else {
				res = await registerUser(values);
			}
			if (res?.error) {
				setMessage(res.error.data.message);
			}
			setMessage("");
			onSubmitProps.resetForm();
			navigate("/");
		} catch (error) {
			console.log(error);
		}
	};

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (isRegister) {
			const username = `${values.firstName} ${values.lastName}`;
			//  console.log(values.picture);

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
			console.log(credentials);
			await register(credentials, onSubmitProps);
		} else if (isLogin) {
			await login(values, onSubmitProps);
		}
	};

	return (
		<Box>
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
														setImage(urls[0]);
													})
													.catch((error) => {
														console.error(error);
													});

												setFieldValue("picture", image);
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
									</Box>
								</>
							)}
							<TextField
								label="Email"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								name="email"
								error={Boolean(touched.email) && Boolean(errors.email)}
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
								error={Boolean(touched.password) && Boolean(errors.password)}
								helperText={touched.password && errors.password}
								sx={{ gridColumn: "span 4" }}
							/>
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
		</Box>
	);
};

export default Form;
