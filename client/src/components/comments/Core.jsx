import { CircularProgress, Container, Stack } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetCommentsQuery } from "../../redux/comments/commentsApi";
import CustomSnack from "../reusable/CustomSnack";
import AddComment from "./AddComment";
import Comment from "./Comment";

const Core = ({ type, id }) => {
	const [snackOpen, setSnackOpen] = useState(false);
	const { data, isLoading } = useGetCommentsQuery(
		{ [type]: id },
		{
			refetchOnMountOrArgChange: true,
			refetchOnReconnect: true,
			refetchOnFocus: true,
		},
	);
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
			<CustomSnack
				open={snackOpen}
				setOpen={setSnackOpen}
				message="Comment deleted"
				severity="error"
			/>
			<Stack spacing={3}>
				{data?.comments?.map((comment) => (
					<Comment
						key={comment.id}
						comment={comment}
						snackOpen={snackOpen}
						setSnackOpen={setSnackOpen}
					/>
				))}
				{user && <AddComment type={type} id={id} />}
			</Stack>
		</Container>
	);
};

export default Core;
