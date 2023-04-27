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
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useUpdateTrainingMutation } from "../../redux/trainings/trainingsApi";
import Loading from "../../components/reusable/Loading";
import { Formik } from "formik";
import TextEditor from "../../components/reusable/TextEditor";
import Dropzone from "react-dropzone";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import tags from "../../utils/consts/tags";

const trainingSchema = yup.object().shape({
	price: yup
		.number()
		.required("Please enter the trining's price")
		.min(1, "Please enter a positive price")
		.typeError("Plesase enter the training's price"),
	pictures: yup
		.array()
		.required("Please enter the trining's pcitures")
		.min(1, "Please enter at least one picture"),
	tags: yup
		.array()
		.required("Please enter at least one tag")
		.min(1, "Please enter at least one tag"),
});
const UpdateForm = ({ training }) => {
	const [description, setDescription] = useState(training?.description || "");
	console.log({ description });
	const [loading, setLoading] = useState({
		msg: "Updating the training...",
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
	const [updateTraining] = useUpdateTrainingMutation();
	const [changed, setChanged] = useState(false);
	const [err, setErr] = useState(false);
	const initialValues = {
		price: training?.price || null,
		pictures: training?.images.map(({ url }) => url) || [],
		tags: training?.tags,
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
		if (description === "" || description.replace(/(<([^>]+)>)/gi, "") === "") {
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
			const { price, pictures, tags } = values;

			try {
				setLoading((prev) => ({ ...prev, show: true }));
				const res = await updateTraining({
					id: training?.id,
					price,
					description,
					images: changed ? pictures : [],
					tags,
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
					navigate("/trainings/user", {
						state: {
							open: true,
							severity: "success",
							message: `${training?.title} training updated`,
						},
					});
				}
			} catch (error) {
				console.log(error);
				setDescription("");
				onSubmitProps.resetForm();
			}
		}
	};

	return (
		<Box>
			{" "}
			{/* <Loading loading={alert} type="alert" /> */}
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
					<form
						onSubmit={(e) => {
							if (
								description === "" ||
								description.replace(/(<([^>]+)>)/gi, "") === ""
							) {
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

							<FormControl
								sx={{ gridColumn: "span 2" }}
								error={Boolean(touched.tags) && Boolean(errors.tags)}>
								<InputLabel htmlFor="select">Tags</InputLabel>
								<Select
									label="Tags"
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
									{tags.map((tag) => (
										<MenuItem key={tag} value={tag}>
											{tag}
										</MenuItem>
									))}
								</Select>
								{Boolean(touched.tags) && Boolean(errors.tags) && (
									<FormHelperText>{touched.tags && errors.tags}</FormHelperText>
								)}
							</FormControl>
							<Box
								gridColumn="span 4"
								mb={4}
								display="flex"
								justifyContent="center">
								<TextEditor
									setError={setErr}
									error={err}
									text="Please enter the training's description"
									setValue={setDescription}
									value={training?.description}
								/>
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
											mt={2}
											sx={{ "&:hover": { cursor: "pointer" } }}>
											<input {...getInputProps()} />
											{!values.pictures.length > 0 ? (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													If not pictures are added the old ones will stay
												</Typography>
											) : (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													{values.pictures.length}{" "}
													{values.pictures.length === 1
														? " picture"
														: " pictures"}{" "}
													selected
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
											{openCarousel ? "Hide" : "See"} your{" "}
											{values.pictures.length === 1 ? " picture" : " pictures"}
										</Button>
										{openCarousel && (
											<Box width="100%" p={0.5}>
												<CustomCarousel images={values.pictures} height={250} />
											</Box>
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
							Submit Update
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

export default UpdateForm;
