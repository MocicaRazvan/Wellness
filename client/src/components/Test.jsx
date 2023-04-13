import { Box, Button, TextField, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import Header from "./reusable/Header";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../redux/auth/authSlice";
import Loading from "./reusable/Loading";
import { Formik } from "formik";
import TextEditor from "./reusable/TextEditor";

const trainingSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("Please enter the email"),
	subject: yup.string().required("Please provide a subject"),
});

const Test = () => {
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState({
		msg: "Sendig the email...",
		show: false,
	});
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const initialValues = {
		email: "",
		subject: "",
	};
	const handleFormSubmit = async (values, onSubmitProps) => {};
	return (
		<Box m="1.5rem 2.5rem">
			<Header title="Email" subtitle="Write on behalf of the company." />
			<Loading loading={alert} type="alert" />
			<Loading loading={loading} />
			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				validationSchema={trainingSchema}>
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
							<TextField
								label="Email"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.email}
								name="email"
								error={Boolean(touched.email) && Boolean(errors.email)}
								helperText={touched.email && errors.email}
								sx={{ gridColumn: "span 2" }}
							/>
							<TextField
								label="Subject"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.subject}
								name="subject"
								error={Boolean(touched.subject) && Boolean(errors.subject)}
								helperText={touched.subject && errors.subject}
								sx={{ gridColumn: "span 2" }}
							/>

							<Box
								gridColumn="span 4"
								mb={4}
								display="flex"
								justifyContent="center">
								<TextEditor name="body" setValue={setBody} />
							</Box>
						</Box>
						<Button
							fullWidth
							type="submit"
							sx={{
								m: "2rem 0",
								p: "1rem",
								backgroundColor: theme.palette.background.default,
								color: theme.palette.secondary[300],
								"&:hover": { color: theme.palette.primary.main },
							}}>
							Send the email
						</Button>
					</form>
				)}
			</Formik>
		</Box>
	);
};

export default Test;
