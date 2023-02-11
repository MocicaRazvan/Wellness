import { useContext, useState } from "react";
import {
	Avatar,
	Button,
	Card,
	Stack,
	Typography,
	ThemeProvider,
	TextField,
	Box,
	styled,
	useTheme,
} from "@mui/material";
import YouTag from "./YouTag";
import Actions from "./Actions";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { Delete, Edit } from "@mui/icons-material";
import {
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} from "../../redux/comments/commentsApi";
import { format } from "timeago.js";

const Comment = ({ comment }) => {
	const user = useSelector(selectCurrentUser);
	const isAuth = user.id === comment.user._id || user.role === "admin";
	const theme = useTheme();

	const [deleteComment] = useDeleteCommentMutation();
	const [updateComment] = useUpdateCommentMutation();

	const [editingComm, setEditingComm] = useState(false);
	const [body, setBody] = useState(comment?.body || "");

	const handleDeleteComment = async () => {
		try {
			await deleteComment({ id: comment.id }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};

	const handleBodyChange = (e) => {
		console.log(e.target.value);
		setBody(e.target.value);
	};

	const handleUpdateComment = async () => {
		try {
			await updateComment({ id: comment.id, body }).unwrap();
			setEditingComm(false);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Card>
			<Box sx={{ p: "15px" }}>
				<Stack spacing={2} direction="row">
					<Box>
						<Actions comment={comment} />
					</Box>
					<Box sx={{ width: "100%" }}>
						<Stack
							spacing={2}
							direction="row"
							justifyContent="space-between"
							alignItems="center">
							<Stack spacing={2} direction="row" alignItems="center">
								<Avatar src={comment?.user?.image?.url} />
								<Typography
									fontWeight="bold"
									sx={{
										color: theme.palette.secondary[200],
										fontWeight: "600",
									}}>
									{comment?.user?.username}
								</Typography>
								<Typography sx={{ color: theme.palette.secondary[300] }}>
									{format(comment?.createdAt)}
								</Typography>
							</Stack>
							{isAuth ? (
								<Stack direction="row" spacing={1}>
									<Button
										startIcon={<Delete />}
										sx={{
											color: theme.palette.secondary[200],
											fontWeight: 500,
											textTransform: "capitalize",
										}}
										onClick={() => {
											handleDeleteComment();
										}}>
										Delete
									</Button>
									<Button
										variant="text"
										disabled={editingComm}
										sx={{
											fontWeight: 500,
											textTransform: "capitalize",
											color: theme.palette.primary[200],
										}}
										startIcon={<Edit />}
										onClick={() => setEditingComm(!editingComm)}>
										Edit
									</Button>
								</Stack>
							) : null}
						</Stack>
						{editingComm ? (
							<>
								<TextField
									sx={{ p: "20px 0" }}
									multiline
									fullWidth
									minRows={4}
									id="outlined-multilined"
									placeholder="Don't leave this blank!"
									value={body}
									onChange={(e) => {
										handleBodyChange(e);
									}}
								/>
								{body && (
									<UpdateBtn
										onClick={() => {
											handleUpdateComment();
										}}>
										Update
									</UpdateBtn>
								)}
							</>
						) : (
							<Typography
								sx={{ color: theme.palette.secondary[200], p: "20px 0" }}>
								{body}
							</Typography>
						)}
					</Box>
				</Stack>
			</Box>
		</Card>
	);
};
const UpdateBtn = styled(Button)(({ theme }) => ({
	float: "right",
	backgroundColor: theme.palette.secondary[200],
	p: "8px 25px",
}));

export default Comment;
