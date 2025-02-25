import {
	Box,
	Button,
	FormHelperText,
	TextField,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import * as yup from "yup";
import CustomSnack from "../../components/reusable/CustomSnack";
import Header from "../../components/reusable/Header";
import Loading from "../../components/reusable/Loading";
import { useSendEmailAdminMutation } from "../../redux/user/userApi";

const trainingSchema = yup.object().shape({
	email: yup.string().email("invalid email").required("Please enter the email"),
	subject: yup.string().required("Please provide a subject"),
});

const Test = () => {
	const [body, setBody] = useState("");
	const [loading, setLoading] = useState({
		msg: "Email was sent!",
		show: false,
	});
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const theme = useTheme();
	const [sendEmail] = useSendEmailAdminMutation();
	const [error, setError] = useState(false);

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const initialValues = {
		email: "",
		subject: "",
	};

	const modules = {
		toolbar: [["bold", "italic", "underline", "strike"]],
	};
	const { quill, quillRef } = useQuill({ modules });
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (quill) {
			if (body === "") {
				quill.clipboard.dangerouslyPasteHTML(body);
			}
			quill.on("text-change", () => {
				setBody(quillRef.current.firstChild.innerHTML);
				if (error) {
					setError(false);
				}
			});
		}
	}, [body, error, quill, quillRef]);

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (body === "" || body.replace(/(<([^>]+)>)/gi, "") === "") {
			setAlert((prev) => ({
				...prev,
				show: true,
				msg: "Please provide a body",
			}));
			setError(true);
			setTimeout(
				() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
				2000,
			);
		} else {
			setLoading((prev) => ({ ...prev, show: true }));
			// setTimeout(() => {
			// 	setOpen(true);
			// }, 300);
			const res = await sendEmail({
				body,
				email: values.email.trim(),
				subject: values.subject,
			});
			onSubmitProps.resetForm();
			setBody("");
			setTimeout(() => setLoading((prev) => ({ ...prev, show: false })), 1500);

			if (res?.data?.error) {
				setAlert((prev) => ({
					...prev,
					show: true,
					msg: res?.data?.error.message,
				}));

				setTimeout(
					() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
					2000,
				);
			}
		}
	};
	return (
		<Box m="1.5rem 2.5rem" pb={2}>
			<CustomSnack
				open={open}
				setOpen={setOpen}
				message="Email was sent"
				severity="success"
			/>
			<Header title="Email" subtitle="Write on behalf of the company." />
			<Box
				sx={{
					zIndex: 2000,
					position: "relative",
				}}>
				{/* <Loading loading={alert} type="alert" /> */}
				<Loading loading={loading} type="alert" />
			</Box>
			<Box
				mt={1}
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%">
				<Box
					mt={6}
					sx={{
						bgcolor: {
							sm: theme.palette.background.default,
							md: theme.palette.background.alt,
						},
						p: { sm: 0, md: 5 },
						borderRadius: { sm: 0, md: 10 },
					}}>
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
							<form
								onSubmit={(e) => {
									if (body === "" || body.replace(/(<([^>]+)>)/gi, "") === "") {
										setError(true);
									}
									handleSubmit(e);
								}}>
								<Box
									display="grid"
									gap="30px"
									gridTemplateColumns="repeat(4,minmax(0,1fr))"
									sx={{
										"& > div": {
											gridColumn: isNonMobile ? undefined : "span 4",
										},
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
										<Box
											sx={{
												width: { xs: 250, sm: 500, md: 600 },
												height: { xs: 350, sm: 400 },
												"& .ql-toolbar.ql-snow, .ql-container.ql-snow ": {
													border: `1px solid ${
														error
															? theme.palette.error.main
															: theme.palette.primary[
																	theme.palette.mode === "dark"
																		? "light"
																		: "dark"
															  ]
													} `,
												},
											}}>
											<div
												style={{
													width: "100%",
													height: "100%",
													color: theme.palette.secondary[300],
												}}>
												<div ref={quillRef} />
											</div>
										</Box>
									</Box>
								</Box>
								{error && (
									<FormHelperText
										sx={{ mt: 2, ml: 2, color: theme.palette.error.main }}>
										{`Please proivde the email's body`}
									</FormHelperText>
								)}
								<Box textAlign="center" mt={6}>
									<Button
										type="submit"
										sx={{
											color: theme.palette.background.default,
											bgcolor: theme.palette.secondary[300],
											"&:hover": {
												bgcolor: theme.palette.primary.main,
												color: theme.palette.secondary[300],
											},
										}}>
										Send the email
									</Button>
								</Box>
							</form>
						)}
					</Formik>
				</Box>
			</Box>
		</Box>
	);
};

export default Test;
