import {
	Box,
	Button,
	FormControl,
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
import CustomCarousel from "../../components/reusable/CustomCarousel";
import Loading from "../../components/reusable/Loading";
import TextEditor from "../../components/reusable/TextEditor";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useCreateExerciseMutation,
	useUpdateExerciseMutation,
} from "../../redux/exercises/exercisesApi";
import muscleGroups from "../../utils/consts/muscleGorups";

const exerciseSchema = yup.object().shape({
	clips: yup.array(),
	title: yup.string().required("Please enter the title"),
	// body: yup.string().required("required"),
	muscleGroups: yup.array().required("Please enter the muscle groups targeted"),
});

const Form = ({ exercise }) => {
	const user = useSelector(selectCurrentUser);

	const [body, setBody] = useState(exercise?.body || "");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState({
		msg: "Creating the exercise...",
		show: false,
	});

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const theme = useTheme();
	const navigate = useNavigate();

	const [createExercise] = useCreateExerciseMutation();
	const [updateExercise] = useUpdateExerciseMutation();

	const initialValues = {
		clips: [],
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
		if (!body) {
			setMessage("Please provide a body to the exercise");
		} else {
			if (!exercise) {
				try {
					setLoading((prev) => ({ ...prev, show: true }));
					const res = await createExercise({
						body,
						videos: values.clips,
						title: values.title,
						muscleGroups: values.muscleGroups,
					});
					setLoading((prev) => ({ ...prev, show: false }));
					if (res.error) {
						setMessage(res.error.data.message);
					} else {
						setMessage("");
						setBody("");
						onSubmitProps.resetForm();
						navigate("/exercises/user");
					}
				} catch (error) {
					console.log(error);
					onSubmitProps.resetForm();
				}
			} else {
				try {
					setLoading((prev) => ({ ...prev, show: true }));
					const res = await updateExercise({
						id: exercise?.id,
						body,
						videos: values.clips,
						title: values.title,
						muscleGroups: values.muscleGroups,
					});
					setLoading((prev) => ({ ...prev, show: false }));
					if (res.error) {
						setMessage(res.error.data.message);
					} else {
						setMessage("");
						setBody("");
						onSubmitProps.resetForm();
						navigate("/exercises/user");
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
					<form onSubmit={handleSubmit}>
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
							<FormControl sx={{ gridColumn: "span 2" }}>
								<InputLabel htmlFor="select">MuscleGroups</InputLabel>
								<Select
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
									}}>
									{muscleGroups.map((tag) => (
										<MenuItem key={tag} value={tag}>
											{tag}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Box
								gridColumn="span 4"
								mb={6}
								display="flex"
								justifyContent="center">
								<TextEditor
									name="body"
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
										sx={{ "&:hover": { cursor: "pointer" } }}>
										<input {...getInputProps()} />
										{!values.clips.length > 0 ? (
											!exercise ? (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
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
									</Box>
								)}
							</Dropzone>
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
							Submit your exercise
						</Button>
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
	);
};

export default Form;
