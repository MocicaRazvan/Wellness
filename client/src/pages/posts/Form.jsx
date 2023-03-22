import {
	Checkbox,
	ListItemText,
	Select,
	TextField,
	useMediaQuery,
	MenuItem,
	InputLabel,
	FormControl,
	Button,
	Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { Formik } from "formik";
import { useState } from "react";
import * as yup from "yup";
import tags from "../../utils/consts/tags";
import {
	useCreatePostMutation,
	useUpdatePostMutation,
} from "../../redux/posts/postsApiSlice";
import TextEditor from "../../components/reusable/TextEditor";
import Dropzone from "react-dropzone";
import CustomCarousel from "../../components/reusable/CustomCarousel";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/reusable/Loading";

const postSchema = yup.object().shape({
	tags: yup.array().required("Please enter the tags"),
	title: yup.string().required("Please enter the title"),
	pictures: yup.array(),
});

const Form = ({ post }) => {
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

	const initalValues = {
		tags: post?.tags || [],
		title: post?.title || "",
		pictures: [],
	};
	const handleFormSubmit = async (values, onSubmitProps) => {
		if (!body) {
			setMessage("Plese provide a body to the post");
		} else {
			const { pictures, title, tags } = values;
			if (!post) {
				try {
					setLoading((prev) => ({ ...prev, show: true }));
					const res = await createPost({ body, title, tags, images: pictures });
					setLoading((prev) => ({ ...prev, show: false }));
					if (res?.error) {
						setMessage(res.error.data.message);
					} else {
						setMessage("");
						setBody("");
						onSubmitProps.resetForm();
						navigate("/posts/user");
					}
				} catch (error) {
					console.log(error);
					setBody("");
					onSubmitProps.resetForm();
				}
			} else {
				try {
					setLoading((prev) => ({ ...prev, show: true }));
					const res = await updatePost({
						id: post.id,
						body,
						title,
						tags,
						images: pictures,
					});
					setLoading((prev) => ({ ...prev, show: false }));
					if (res?.error) {
						setMessage(res.error.data.message);
					} else {
						setMessage("");
						setBody("");
						onSubmitProps.resetForm();
						navigate("/posts/user");
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

	return (
		<Box>
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
							<Box
								gridColumn="span 4"
								mb={2}
								display="flex"
								justifyContent="center">
								<TextEditor name="body" setValue={setBody} />
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
													Add Picture
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
										{openCarousel ? "Hide" : "See"} your pictures
									</Button>
									{openCarousel && (
										<CustomCarousel images={values.pictures} height={250} />
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
							Submit your post
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
