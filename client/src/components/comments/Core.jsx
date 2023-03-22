import { CircularProgress, Container, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetCommentsQuery } from "../../redux/comments/commentsApi";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Core = ({ type, id }) => {
	const { data, isLoading } = useGetCommentsQuery({ [type]: id });
	const user = useSelector(selectCurrentUser);
	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	console.log({ data });

	return (
		<Container maxWidth="md" sx={{ mt: 2 }}>
			<Stack spacing={3}>
				{data?.comments?.map((comment) => (
					<Comment key={comment.id} comment={comment} />
				))}
				{user && <AddComment type={type} id={id} />}
			</Stack>
		</Container>
	);
};

export default Core;
