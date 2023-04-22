import {
	Box,
	Button,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import * as yup from "yup";
import { useForgotPasswordMutation } from "../../redux/auth/authApiSlice";
import { Formik } from "formik";
import Loading from "../../components/reusable/Loading";

const schema = yup.object().shape({
	email: yup
		.string()
		.email("invalid email")
		.required("Please enter the email")
		.transform((_, v) => v.trim()),
});

const FrogotPassword = () => {
	const { state: userEmail } = useLocation();
	const [message, setMessage] = useState("");
	const [forgotPassword, { isSuccess, isLoading }] =
		useForgotPasswordMutation();
	const user = useSelector(selectCurrentUser);
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	const initialValues = { email: userEmail || "" };

	const handleFormSubmit = async (values, onSubmitProps) => {
		try {
			const res = await forgotPassword(values.email.trim());
			// console.log({ res });
			// if (res?.error) {
			// 	setAlert((prev) => ({
			// 		...prev,
			// 		show: true,
			// 		msg: "This email is not registered",
			// 	}));

			// 	setTimeout(
			// 		() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
			// 		2000,
			// 	);
			// } else {
			// 	setMessage("Check your email!");
			// }
			setMessage("Check your email!");
			onSubmitProps.resetForm();
		} catch (error) {
			setMessage("Check your email!");
			onSubmitProps.resetForm();
		}
	};

	return (
		<Box>
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
								gap={2}>
								<Typography
									variant="h3"
									color={theme.palette.secondary[200]}
									fontWeight="bold">
									Reset your password
								</Typography>
								<TextField
									label="Email"
									onBlur={handleBlur}
									onChange={handleChange}
									value={values.email}
									name="email"
									disabled={user ? true : false}
									error={Boolean(touched.email) && Boolean(errors.email)}
									helperText={touched.email && errors.email}
									sx={{ width: "80%" }}
								/>
								<Button
									type="submit"
									disabled={message ? true : false}
									sx={{
										mt: 2,
										width: "50%",
										p: "1rem",
										backgroundColor: theme.palette.background.default,
										color: theme.palette.secondary[300],
										"&:hover": { color: theme.palette.primary.main },
									}}>
									Send
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
			</Box>
		</Box>
	);
};

export default FrogotPassword;
