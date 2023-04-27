import {
	useTheme,
	useMediaQuery,
	Box,
	Typography,
	CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../../redux/posts/postsApiSlice";
import Form from "./Form";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const UpdatePost = () => {
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();

	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	const { postId } = useParams();

	const { data, isLoading } = useGetPostByIdQuery(
		{ id: postId },
		{ skip: !postId },
	);

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	if (user.id !== data?.post?.user?._id) {
		navigate("/");
	}

	return user ? (
		<Box>
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Typography
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[200]}
					letterSpacing={1.5}
					variant="h3"
					sx={{ mb: "1.5rem" }}>
					Update the post {data?.post?.title}
				</Typography>
				<Form post={data?.post} />
			</Box>
		</Box>
	) : (
		<></>
	);
};

export default UpdatePost;
