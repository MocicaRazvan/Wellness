import { CircularProgress, Container, Stack } from "@mui/material";
import { useGetCommentsQuery } from "../../redux/comments/commentsApi";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Core = ({ type, id }) => {
	const { data, isLoading } = useGetCommentsQuery({ [type]: id });

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
				<AddComment type={type} id={id} />
			</Stack>
		</Container>
	);
};

export default Core;
