import {
	Avatar,
	Button,
	Card,
	Stack,
	TextField,
	ThemeProvider,
	Box,
} from "@mui/material";
import { useState } from "react";
import { useCreateCommentMutation } from "../../redux/comments/commentsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";

const AddComment = ({ type, id }) => {
	const [createComment] = useCreateCommentMutation();
	const [body, setBody] = useState("");
	const user = useSelector(selectCurrentUser);

	const handleAddComment = async () => {
		try {
			await createComment({ body, [type]: id }).unwrap();
			setBody("");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card>
			<Box sx={{ p: "15px" }}>
				<Stack direction="row" spacing={2} alignItems="flex-start">
					<Avatar src={user?.image?.url || blankUser} variant="rounded" />
					<TextField
						multiline
						fullWidth
						minRows={4}
						id="outlined-multilined"
						placeholder="Add a comment"
						value={body}
						onChange={(e) => {
							setBody(e.target.value);
						}}
					/>
					{body && (
						<Button
							size="large"
							sx={{
								bgcolor: "secondary.main",
								color: "primary.main",
								p: "8px 25px",
							}}
							onClick={(e) => {
								handleAddComment();
							}}>
							Send
						</Button>
					)}
				</Stack>
			</Box>
		</Card>
	);
};

export default AddComment;
