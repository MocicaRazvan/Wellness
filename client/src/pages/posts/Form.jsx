import {
	Button,
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
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
	useCreatePostMutation,
	useUpdatePostMutation,
} from "../../redux/posts/postsApiSlice";
import tags from "../../utils/consts/tags";

const postSchema = yup.object().shape({
	tags: yup
		.array()
		.required("Please enter at least one tag")
		.min(1, "Please enter at least one tag"),
	title: yup
		.string()
		.required("Please enter the post's title")
		.transform((_, v) => v.trim()),
	pictures: yup
		.array()
		.required("Please enter the post's title")
		.min(1, "Please enter at least one picture"),
});

const Form = ({ post }) => {
	const user = useSelector(selectCurrentUser);
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState({
		msg: "Creating the post...",
		show: false,
	});
	const [createPost, { isLoading }] = useCreatePostMutation();
	const [updatePost, { isLoading: isUpdateLoading }] = useUpdatePostMutation();
	const [body, setBody] = useState(post?.body || "");
	const [openCarousel, setOpenCarousel] = useState(false);
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const theme = useTheme();
	const navigate = useNavigate();
	const [changed, setChanged] = useState(false);
	const [credentials, setCredentials] = useState({
		show: false,
		msg: "",
		color: "red",
	});
	const initalValues = {
		tags: post?.tags || [],
		title: post?.title || "",
		pictures: post?.images?.map(({ url }) => url) || [],
	};
	const [err, setErr] = useState(false);
	const handleFormSubmit = async (values, onSubmitProps) => {
		if (body === "" || body.replace(/(<([^>]+)>)/gi, "") === "") {
			setMessage("Plese provide a body to the post");
			setCredentials((prev) => ({
				...prev,
				show: true,
				msg: "Plese provide a body to the post",
			}));
			setErr(true);

			setTimeout(
				() => setCredentials((prev) => ({ ...prev, show: false, msg: "" })),
				2000,
			);
		} else {
			const { pictures, title, tags } = values;
			if (!post) {
				if (pictures.length === 0) {
					setCredentials((prev) => ({
						...prev,
						show: true,
						msg: "Please enter at least one picture!",
					}));
					onSubmitProps.setFieldError(
						"pictures",
						"Please enter at least one picture!",
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
							msg: "Creating the post...",
						}));
						const res = await createPost({
							body,
							title: title.trim(),
							tags,
							images: pictures,
						});
						setLoading((prev) => ({ ...prev, show: false }));
						console.log({ res });
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
							navigate("/posts/user", {
								state: {
									open: true,
									severity: "success",
									message: `${title} post created`,
								},
							});
						}
					} catch (error) {
						console.log(error);
						setBody("");
						onSubmitProps.resetForm();
					}
				}
			} else {
				try {
					setLoading((prev) => ({
						...prev,
						show: true,
						msg: "Updating the post...",
					}));
					const res = await updatePost({
						id: post.id,
						body,
						title: title.trim(),
						tags,
						images: changed ? pictures : [],
					});
					setLoading((prev) => ({
						...prev,
						show: false,
					}));
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
						navigate("/posts/user", {
							state: {
								open: true,
								severity: "success",
								message: `${title} post updated`,
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
	if (user && post && user?.id !== post?.user?._id) {
		navigate("/");
	}

	return (
		<Box>
			{/* <Loading loading={credentials} type="alert" /> */}
			<Loading loading={loading} />
			<Formik
				onSubmit={handleFormSubmit}
				initialValues={initalValues}
				validationSchema={postSchema}>
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
								mb={2}
								display="flex"
								justifyContent="center">
								<TextEditor
									error={err}
									setError={setErr}
									text="Please provide the post's body"
									setValue={setBody}
									value={post?.body || ""}
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
											mt={4}
											borderRadius="5px"
											border={`1px solid ${
												Boolean(touched.pictures) &&
												Boolean(errors.pictures) &&
												theme.palette.error.main
											}`}
											sx={{ "&:hover": { cursor: "pointer" } }}>
											<input {...getInputProps()} />
											{!values.pictures.length > 0 ? (
												!post ? (
													<Typography
														variant="h5"
														color={
															Boolean(touched.pictures) &&
															Boolean(errors.pictures)
																? theme.palette.error.main
																: theme.palette.secondary[200]
														}
														textAlign="center"
														fontWeight="bold">
														Add Picture
													</Typography>
												) : (
													<Typography
														variant="h5"
														color={theme.palette.secondary[200]}
														textAlign="center"
														fontWeight="bold">
														If not pictures are added the old ones will stay
													</Typography>
												)
											) : (
												<Typography
													variant="h5"
													color={theme.palette.secondary[200]}
													textAlign="center"
													fontWeight="bold">
													{values.pictures.length}
													{values.pictures.length === 1
														? " picture"
														: " pictures"}{" "}
													selected
												</Typography>
											)}
											{Boolean(touched.pictures) &&
												Boolean(errors.pictures) && (
													<FormHelperText
														sx={{ color: theme.palette.error.main }}>
														{touched.pictures && errors.pictures}
													</FormHelperText>
												)}
										</Box>
									)}
								</Dropzone>
							</Box>
							{values.pictures.length > 0 && (
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
							{post ? "Submit Update" : "Submit your post"}
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
