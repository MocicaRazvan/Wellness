import { useTheme } from "@emotion/react";
import { Visibility } from "@mui/icons-material";
import {
	Button,
	InputAdornment,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { Formik } from "formik";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import Loading from "../../components/reusable/Loading";
import { useResetPasswordMutation } from "../../redux/auth/authApiSlice";

const schema = yup.object().shape({
	password: yup.string().min(6).max(25).required("Please enter the password"),
	retypePassword: yup
		.string()
		.required("Please retype your password.")
		.oneOf([yup.ref("password")], "Your passwords do not match."),
});
const initialValues = { password: "", retypePassword: "" };

const ResetPassword = () => {
	const [message, setMessage] = useState("");
	const [resetPassword] = useResetPasswordMutation();
	const navigate = useNavigate();
	const theme = useTheme();
	const { resetToken } = useParams();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const [err, setErr] = useState(false);
	const [show, setShow] = useState({ password: false, retype: false });

	const handleFormSubmit = async (values, onSubmitProps) => {
		try {
			const res = await resetPassword({
				resetToken,
				password: values.password,
			});
			if (res?.error) {
				setAlert((prev) => ({
					...prev,
					show: true,
					msg: res.error.data.message + "!",
				}));

				setTimeout(
					() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
					2000,
				);
				setErr(true);
			} else {
				navigate("/login");
			}
			onSubmitProps.resetForm();
		} catch (error) {
			console.log(error);
			onSubmitProps.resetForm();
		}
	};

	return (
		<Box>
			<Loading loading={alert} type="alert" />
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Formik
					onSubmit={handleFormSubmit}
					initialValues={initialValues}
					validationSchema={schema}>
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
								height="fit-content"
								display="flex"
								flexDirection="column"
								alignItems="center"
								justifyContent="space-around"
								gap={3}>
								<Typography
									variant="h3"
									color={theme.palette.secondary[200]}
									fontWeight="bold">
									Type your new password
								</Typography>
								<TextField
									label="Password"
									type={!show.password ? "password" : "text"}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.password}
									name="password"
									error={Boolean(touched.password) && Boolean(errors.password)}
									helperText={touched.password && errors.password}
									sx={{ width: "80%" }}
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
															color: theme.palette.secondary[300],
														},
													}}
												/>
											</InputAdornment>
										),
									}}
								/>
								<TextField
									label="Retype Password"
									type={!show.retype ? "password" : "text"}
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.retypePassword}
									name="retypePassword"
									error={
										Boolean(touched.retypePassword) &&
										Boolean(errors.retypePassword)
									}
									helperText={touched.retypePassword && errors.retypePassword}
									sx={{ width: "80%" }}
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
															color: theme.palette.secondary[300],
														},
													}}
												/>
											</InputAdornment>
										),
									}}
								/>
								<Button
									type="submit"
									sx={{
										mt: 2,
										width: "50%",
										p: "1rem",
										backgroundColor: theme.palette.background.default,
										color: theme.palette.secondary[300],
										"&:hover": { color: theme.palette.primary.main },
									}}>
									Reset
								</Button>
							</Box>
						</form>
					)}
				</Formik>
				{message && (
					<Typography
						variant="h5"
						sx={{ mt: 5, color: theme.palette.secondary[200] }}>
						{message}
					</Typography>
				)}
				{err && (
					<Typography
						onClick={() => navigate("/forgotPassword")}
						sx={{
							mt: 4,
							textDecoration: "underline",
							color: theme.palette.secondary[200],
							width: "fit-content",
							"&:hover": {
								cursor: "pointer",
								color: theme.palette.primary.light,
							},
						}}>
						Make a new password reset request!
					</Typography>
				)}
			</Box>
		</Box>
	);
};

export default ResetPassword;
