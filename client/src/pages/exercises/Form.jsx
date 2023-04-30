import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Formik } from "formik";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import CustomVideoCarousel from "../../components/reusable/CustomVideoCarousel";
import Loading from "../../components/reusable/Loading";
import TextEditor from "../../components/reusable/TextEditor";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useCreateExerciseMutation,
	useUpdateExerciseMutation,
} from "../../redux/exercises/exercisesApi";
import muscleGroups from "../../utils/consts/muscleGorups";

const exerciseSchema = yup.object().shape({
	clips: yup
		.array()
		.required("Please enter the exercise's videos")
		.min(1, "Please enter at least one video"),
	title: yup
		.string()
		.required("Please enter the exercise's title")
		.transform((_, v) => v.trim()),
	// body: yup.string().required("required"),
	muscleGroups: yup
		.array()
		.required("Please enter the muscle groups targeted")
		.min(1, "Please enter the muscle groups targeted by the exercise"),
});

const Form = ({ exercise }) => {
	const user = useSelector(selectCurrentUser);

	const [body, setBody] = useState(exercise?.body || "");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState({
		msg: "Creating the exercise...",
		show: false,
	});
	const [openCarousel, setOpenCarousel] = useState(false);
	const [changed, setChanged] = useState(false);
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const theme = useTheme();
	const navigate = useNavigate();
	const [credentials, setCredentials] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const [err, setErr] = useState(false);
	const [createExercise] = useCreateExerciseMutation();
	const [updateExercise] = useUpdateExerciseMutation();

	const initialValues = {
		clips: exercise?.videos?.map(({ url }) => url) || [],
		title: exercise?.title || "",
		// body: exercise?.body || "",
		muscleGroups: exercise?.muscleGroups || [],
	};
	// if (exercise) {
	// 	const urls = exercise?.videos?.map(({ url }) => url);
	// 	initialValues.clips = urls;
	// }

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

	if (exercise && user?.id !== exercise?.user) {
		navigate("/");
	}

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (body === "" || body.replace(/(<([^>]+)>)/gi, "") === "") {
			setMessage("Plese provide a body to the exercise");
			setCredentials((prev) => ({
				...prev,
				show: true,
				msg: "Plese provide a body to the exercise",
			}));
			setErr(true);
			setTimeout(
				() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
				2000,
			);
		} else {
			if (!exercise) {
				if (values?.clips.length === 0) {
					setCredentials((prev) => ({
						...prev,
						show: true,
						msg: "Please enter at least one video!",
					}));
					onSubmitProps.setFieldError(
						"clips",
						"Please enter at least one video!",
					);
					setTimeout(
						() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
						2000,
					);
				} else {
					try {
						setLoading((prev) => ({
							...prev,
							show: true,
							msg: "Creating the exercise...",
						}));
						const res = await createExercise({
							body,
							videos: values.clips,
							title: values.title.trim(),
							muscleGroups: values.muscleGroups,
						});
						setLoading((prev) => ({ ...prev, show: false }));
						if (res?.error) {
							setCredentials((prev) => ({
								...prev,
								show: true,
								msg: res.error.data.message,
							}));
							setMessage(res.error.data.message);
							onSubmitProps.setFieldError("title", res.error.data.message);
							setTimeout(
								() =>
									setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
								2000,
							);
						} else {
							setMessage("");
							setBody("");
							onSubmitProps.resetForm();
							navigate("/exercises/user", {
								state: {
									open: true,
									severity: "success",
									message: `${values.title.trim()} exercise created`,
								},
							});
						}
					} catch (error) {
						console.log(error);
						onSubmitProps.resetForm();
					}
				}
			} else {
				try {
					setLoading((prev) => ({
						...prev,
						show: true,
						msg: "Updating the exercise...",
					}));
					const res = await updateExercise({
						id: exercise?.id,
						body,
						videos: changed ? values.clips : [],
						title: values.title.trim(),
						muscleGroups: values.muscleGroups,
					});
					setLoading((prev) => ({ ...prev, show: false }));
					if (res?.error) {
						setCredentials((prev) => ({
							...prev,
							show: true,
							msg: res.error.data.message,
						}));
						setMessage(res.error.data.message);
						onSubmitProps.setFieldError("title", res.error.data.message);
						setTimeout(
							() =>
								setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
							2000,
						);
					} else {
						setMessage("");
						setBody("");
						onSubmitProps.resetForm();
						navigate("/exercises/user", {
							state: {
								open: true,
								severity: "success",
								message: `${values.title.trim()} exercise updated`,
							},
						});
					}
				} catch (error) {
					console.log(error);
					onSubmitProps.resetForm();
				}
			}
		}
	};
	return (
		<Box>
			{" "}
			{/* <Loading loading={credentials} type="alert" /> */}
			<Loading loading={loading} />
			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initialValues}
				validationSchema={exerciseSchema}>
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
								setErr(true);
							}
							handleSubmit(e);
						}}>
						<Box
							display="grid"
							gap="30px"
							gridTemplateColumns="repeat(4,minmax(0,1fr))"
							sx={{
								"& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
							}}>
							<TextField
								label="Title"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.title}
								name="title"
								error={Boolean(touched.title) && Boolean(errors.title)}
								helperText={touched.title && errors.title}
								sx={{ gridColumn: "span 2" }}
							/>
							<FormControl
								sx={{ gridColumn: "span 2" }}
								error={
									Boolean(touched.muscleGroups) && Boolean(errors.muscleGroups)
								}>
								<InputLabel htmlFor="select">MuscleGroups</InputLabel>
								<Select
									label="MuscleGroups"
									multiple={true}
									id="select"
									onBlur={handleBlur}
									name="muscleGroups"
									onChange={handleChange}
									value={values.muscleGroups}
									error={
										Boolean(touched.muscleGroups) &&
										Boolean(errors.muscleGroups)
									}
									helperText={touched.muscleGroups && errors.muscleGroups}
									sx={{
										gridColumn: "span 2",
									}}
									inputProps={{
										MenuProps: {
											MenuListProps: {
												sx: {
													color: theme.palette.secondary[300],
													"& .Mui-selected": {
														color: theme.palette.background.alt,
														bgcolor: theme.palette.secondary[300],
														"&:hover": {
															color: theme.palette.secondary[300],
														},
													},
												},
											},
										},
									}}>
									{muscleGroups.map((tag) => (
										<MenuItem key={tag} value={tag}>
											{tag}
										</MenuItem>
									))}
								</Select>
								{Boolean(touched.muscleGroups) &&
									Boolean(errors.muscleGroups) && (
										<FormHelperText>
											{touched.muscleGroups && errors.muscleGroups}
										</FormHelperText>
									)}
							</FormControl>
							<Box
								gridColumn="span 4"
								mb={6}
								display="flex"
								justifyContent="center">
								<TextEditor
									error={err}
									setError={setErr}
									text="Please provide the exercise's body"
									setValue={setBody}
									value={exercise?.body || ""}
								/>
							</Box>
						</Box>
						<Box
							gridColumn="span 4"
							// border={`1px solid ${theme.palette.secondary[200]}`}
							borderRadius="5px"
							// p="1rem"
						>
							<Dropzone
								accept={{ "video/mp4": [".mp4", ".MP4"] }}
								multiple={true}
								onDrop={(acceptedFiles) => {
									Promise.all(
										Array.from(acceptedFiles).map(
											async (i) => await fileBase64(i),
										),
									)
										.then((urls) => {
											// setVideos(urls);
											setFieldValue("clips", urls);
											setChanged(true);
										})
										.catch((error) => {
											console.error(error);
										});
								}}>
								{({ getRootProps, getInputProps }) => (
									<Box
										{...getRootProps()}
										// border={`2px dashed ${theme.palette.primary.main}`}
										p="1rem"
										mt={4}
										borderRadius="5px"
										border={`1px solid ${
											Boolean(touched.clips) &&
											Boolean(errors.clips) &&
											theme.palette.error.main
										}`}
										sx={{ "&:hover": { cursor: "pointer" } }}>
										<input {...getInputProps()} />
										{!values.clips.length > 0 ? (
											!exercise ? (
												<Typography
													variant="h5"
													color={
														Boolean(touched.clips) && Boolean(errors.clips)
															? theme.palette.error.main
															: theme.palette.secondary[200]
													}
													textAlign="center"
													fontWeight="bold">
													Add Videos{" "}
												</Typography>
											) : (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													If no videos are selected the old ones will stay
												</Typography>
											)
										) : (
											<Typography
												variant="h5"
												color={theme.palette.secondary[200]}
												textAlign="center"
												fontWeight="bold">
												{values.clips.length}
												{values.clips.length === 1
													? " video "
													: " videos "}{" "}
												selected
											</Typography>
										)}
										{Boolean(touched.clips) && Boolean(errors.clips) && (
											<FormHelperText sx={{ color: theme.palette.error.main }}>
												{touched.clips && errors.clips}
											</FormHelperText>
										)}
									</Box>
								)}
							</Dropzone>
							{values.clips.length > 0 && (
								<Box
									gridColumn="span 4"
									display="flex"
									flexDirection="column"
									alignItems="center">
									<Button
										variant="outlined"
										onClick={() => setOpenCarousel((prev) => !prev)}
										sx={{ color: theme.palette.secondary[200], width: "50%" }}>
										{openCarousel ? "Hide" : "See"} your{" "}
										{values.clips.length === 1 ? " video" : " videos"}
									</Button>
									{openCarousel && (
										<Box width="100%" p={0.5}>
											<CustomVideoCarousel videos={values.clips} height={250} />
										</Box>
									)}
								</Box>
							)}
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
							{exercise ? "Submit Update" : "Submit your exercise"}
						</Button>
					</form>
				)}
			</Formik>
			{/* {message && (
				<Typography
					variant="h5"
					sx={{ mt: 5, color: theme.palette.secondary[200] }}>
					{message}
				</Typography>
			)} */}
		</Box>
	);
};

export default Form;
