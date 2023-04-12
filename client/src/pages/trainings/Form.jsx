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
import { useGetAllExercisesIdsByUserQuery } from "../../redux/exercises/exercisesApi";
import { useCreateTriningMutation } from "../../redux/trainings/trainingsApi";
import tags from "../../utils/consts/tags";

const trainingSchema = yup.object().shape({
	title: yup.string().required("Please enter the title"),
	tags: yup
		.array()
		.required("Please enter the tags")
		.min(1, "Please enter at least one tag"),
	exercises: yup
		.array()
		.required("Please enter the exercises")
		.min(1, "Please enter at least one exercise"),
	price: yup.number().required("Please enter the price").min(0),
	pictures: yup.array().required("Please enter pictures"),
});

const Form = ({ training }) => {
	const [description, setDescription] = useState(training?.description || "");
	const [loading, setLoading] = useState({
		msg: "Creating the training...",
		show: false,
	});
	const [openCarousel, setOpenCarousel] = useState(false);
	const [message, setMessage] = useState("");
	const [alert, setAlert] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();

	const [createTraining] = useCreateTriningMutation();
	const { data: ids } = useGetAllExercisesIdsByUserQuery(
		{ id: user?.id },
		{ skip: !user?.id },
	);

	console.log(ids);
	if (!ids) {
		return <></>;
	}

	const initialValues = {
		title: training?.title || "",
		tags: training?.tags || [],
		exercises: training?.exercises || [],
		price: training?.price || null,
		pictures: training?.images || [],
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

	const handleFormSubmit = async (values, onSubmitProps) => {
		if (description === "") {
			setMessage("Please provide a description");
			setAlert((prev) => ({
				...prev,
				show: true,
				msg: "Please provide a description",
			}));

			setTimeout(
				() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
				2000,
			);
		} else {
			const { title, tags, exercises, price, pictures } = values;
			if (!training) {
				if (pictures?.length === 0) {
					setAlert((prev) => ({
						...prev,
						show: true,
						msg: "Please enter at least 1 picture!",
					}));

					setTimeout(
						() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
						2000,
					);
				} else {
					try {
						setLoading((prev) => ({ ...prev, show: true }));
						const res = await createTraining({
							title,
							tags,
							exercises,
							price,
							description,
							images: pictures,
						});
						setLoading((prev) => ({ ...prev, show: false }));
						if (res?.error) {
							setAlert((prev) => ({
								...prev,
								show: true,
								msg: res.error.data.message,
							}));
							setMessage(res.error.data.message);
							onSubmitProps.setFieldError("title", res.error.data.message);
							setTimeout(
								() => setAlert((prev) => ({ ...prev, show: false, msg: "" })),
								2000,
							);
						} else {
							setMessage("");
							onSubmitProps.resetForm();
							navigate("/trainings/user");
						}
					} catch (error) {
						console.log(error);
						setDescription("");
						onSubmitProps.resetForm();
					}
				}
			}
		}
	};

	return (
		<Box>
			{" "}
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
								label="Title"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.title}
								name="title"
								error={Boolean(touched.title) && Boolean(errors.title)}
								helperText={touched.title && errors.title}
								sx={{ gridColumn: "span 2" }}
							/>
							<TextField
								label="Price"
								onBlur={handleBlur}
								onChange={handleChange}
								value={values.price}
								name="price"
								type="number"
								InputProps={{
									inputProps: { min: 0, step: 1, type: "number" },
								}}
								error={Boolean(touched.price) && Boolean(errors.price)}
								helperText={touched.price && errors.price}
								sx={{ gridColumn: "span 2" }}
							/>
							<FormControl sx={{ gridColumn: "span 2" }}>
								<InputLabel htmlFor="select">Tags</InputLabel>
								<Select
									multiple={true}
									id="select"
									onBlur={handleBlur}
									name="tags"
									onChange={handleChange}
									value={values.tags}
									error={Boolean(touched.tags) && Boolean(errors.tags)}
									helperText={touched.tags && errors.tags}
									sx={{
										gridColumn: "span 2",
									}}>
									{tags.map((tag) => (
										<MenuItem key={tag} value={tag}>
											{tag}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl sx={{ gridColumn: "span 2" }}>
								<InputLabel htmlFor="selectEx">Exercises</InputLabel>
								<Select
									multiple={true}
									id="selectEx"
									onBlur={handleBlur}
									name="exercises"
									onChange={handleChange}
									value={values.exercises}
									error={
										Boolean(touched.exercises) && Boolean(errors.exercises)
									}
									helperText={touched.exercises && errors.exercises}
									sx={{
										gridColumn: "span 2",
									}}>
									{ids.map((tag) => (
										<MenuItem key={tag.id} value={tag.id}>
											{tag.title}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<Box
								gridColumn="span 4"
								mb={4}
								display="flex"
								justifyContent="center">
								<TextEditor name="body" setValue={setDescription} />
							</Box>
							<Box
								gridColumn="span 4"
								// border={`1px solid ${theme.palette.secondary[200]}`}
								borderRadius="5px"
								// p="1rem"
							>
								<Dropzone
									accept={{
										"image/*": [".jpg", ".jpeg", ".png"],
									}}
									multiple={true}
									onDrop={(acceptedFiles) => {
										Promise.all(
											Array.from(acceptedFiles).map(
												async (i) => await fileBase64(i),
											),
										)
											.then((urls) => {
												setFieldValue("pictures", urls);
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
											{!values.pictures.length > 0 ? (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													Add Pictures
												</Typography>
											) : (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													{values.pictures.length} pictures selected
												</Typography>
											)}
										</Box>
									)}
								</Dropzone>
								{values.pictures.length > 0 && (
									<Box
										gridColumn="span 4"
										display="flex"
										flexDirection="column"
										alignItems="center">
										<Button
											variant="outlined"
											onClick={() => setOpenCarousel((prev) => !prev)}
											sx={{
												color: theme.palette.secondary[200],
												width: "50%",
											}}>
											{openCarousel ? "Hide" : "See"} your pictures
										</Button>
										{openCarousel && (
											<CustomCarousel images={values.pictures} height={250} />
										)}
									</Box>
								)}
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
							Submit your training
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
