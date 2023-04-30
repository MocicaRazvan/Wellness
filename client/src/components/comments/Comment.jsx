import { Delete, Edit } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Card,
	FormHelperText,
	Stack,
	TextField,
	Tooltip,
	Typography,
	styled,
	useTheme,
} from "@mui/material";
import Perspective from "perspective-api-client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "timeago.js";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	useDeleteCommentMutation,
	useUpdateCommentMutation,
} from "../../redux/comments/commentsApi";
import UserAgreement from "../reusable/UserAgreement";
import Actions from "./Actions";

const perspective = new Perspective({
	apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
});

const Comment = ({ comment, setSnackOpen }) => {
	const [loading, setLoading] = useState({
		show: false,
		msg: "You were nice last time!",
		color: "red",
	});
	const user = useSelector(selectCurrentUser);
	const isAuth = user?.id === comment?.user?._id || user?.role === "admin";
	const theme = useTheme();
	const navigate = useNavigate();

	const [deleteComment] = useDeleteCommentMutation();
	const [updateComment] = useUpdateCommentMutation();
	const [open, setOpen] = useState(false);
	const [editingComm, setEditingComm] = useState(false);
	const [body, setBody] = useState(comment?.body || "");
	const [err, setErr] = useState({ show: false, msg: "" });

	const handleDeleteComment = async () => {
		try {
			await deleteComment({ id: comment?.id }).unwrap();
			setTimeout(() => {
				setSnackOpen(true);
			}, 400);
		} catch (error) {
			console.log(error);
		}
	};

	const handleBodyChange = (e) => {
		console.log("object");
		if (err.show) {
			setErr({ show: false, msg: "" });
		}
		setBody(e.target.value);
	};

	useEffect(() => {
		if (!user) {
			setEditingComm(false);
		}
	}, [user]);

	const handleUpdateComment = async () => {
		try {
			const result = await perspective.analyze({
				comment: { text: body },
				requestedAttributes: { TOXICITY: { scoreThreshold: 0.6 } },
			});
			if (result?.attributeScores?.TOXICITY) {
				setLoading((prev) => ({ ...prev, show: true }));

				setBody(comment?.body);
				setErr((prev) => ({ show: true, msg: "You were nice last time!" }));
				// setEditingComm(false);

				setTimeout(() => {
					setLoading((prev) => ({ ...prev, show: false }));
				}, 2500);
				return;
			}
			await updateComment({ id: comment.id, body }).unwrap();
			setEditingComm(false);
		} catch (error) {
			console.log(error);

			setBody(comment?.body);
			// setEditingComm(false);
			setErr((prev) => ({ show: true, msg: "Please write in english!" }));

			setLoading((prev) => ({
				...prev,
				show: true,
				msg: "Please write in english!",
			}));

			setTimeout(() => {
				setLoading((prev) => ({
					...prev,
					show: false,
					msg: "You were nice last time!",
				}));
			}, 2500);
			return;
		}
	};

	console.log(comment?.createdAt !== comment?.updatedAt);
	console.log({ comment });

	return (
		<Card sx={{ bgcolor: theme.palette.primary.main }}>
			{/* <Loading loading={loading} type="alert" /> */}

			<UserAgreement
				open={open}
				setOpen={setOpen}
				title={"Confirm delete"}
				text={
					"Are you sure you want to delete this comment? You can't undo after you press Agree, be careful what you want."
				}
				handleAgree={async () => await handleDeleteComment()}
				loader={false}
			/>

			<Box sx={{ p: "15px" }}>
				<Stack spacing={2} direction="row">
					<Box>
						<Actions comment={comment} />
					</Box>

					<Box sx={{ width: "100%" }}>
						<Stack
							spacing={{ xs: 0, sm: 2 }}
							direction={{ xs: "column", sm: "row" }}
							justifyContent="space-between"
							alignItems="center">
							<Stack
								spacing={{ xs: 1, sm: 2 }}
								direction="row"
								alignItems="center"
								justifyContent={{ xs: "space-between", sm: "flex-start" }}
								width="100%">
								<Avatar src={comment?.user?.image?.url} />
								{user?.id !== comment?.user?._id ? (
									<Tooltip title="Go to profile" arrow placement="top">
										<Typography
											fontWeight="bold"
											sx={{
												color: theme.palette.secondary[200],
												fontWeight: "600",
												cursor: "pointer",
												"&:hover": { color: theme.palette.background.default },
											}}
											onClick={() =>
												void navigate("/user/author", {
													state: comment?.user?._id,
												})
											}>
											{comment?.user?.username}
										</Typography>
									</Tooltip>
								) : (
									<Typography
										fontWeight="bold"
										sx={{
											color: theme.palette.secondary[200],
											fontWeight: "600",
										}}>
										{comment?.user?.username}
									</Typography>
								)}
								<Typography
									textAlign="center"
									sx={{ color: theme.palette.secondary[300] }}>
									{format(comment?.createdAt)}
								</Typography>
							</Stack>
							<Stack direction="row" spacing={1}>
								{" "}
								{user?.id === comment?.user?._id && (
									<Button
										variant="text"
										// disabled={editingComm}
										sx={{
											fontWeight: 500,
											textTransform: "capitalize",
											color: editingComm
												? theme.palette.secondary[500]
												: theme.palette.secondary[200],
										}}
										startIcon={<Edit />}
										onClick={() => {
											if (editingComm) {
												setBody(comment?.body);
												if (err.show) {
													setErr({ show: false, msg: "" });
												}
											}
											setEditingComm((prev) => !prev);
										}}>
										Edit
									</Button>
								)}
								{isAuth && (
									<Button
										startIcon={<Delete />}
										sx={{
											color: theme.palette.secondary[200],
											fontWeight: 500,
											textTransform: "capitalize",
										}}
										onClick={() => {
											setOpen((prev) => !prev);
										}}>
										Delete
									</Button>
								)}
							</Stack>
						</Stack>
						{editingComm ? (
							<>
								<TextField
									multiline
									fullWidth
									minRows={4}
									id="outlined-multilined"
									placeholder="Don't leave this blank!"
									value={body}
									onChange={(e) => {
										handleBodyChange(e);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											handleUpdateComment();
										}
									}}
									error={err.show}
									inputProps={{
										style: { color: theme.palette.secondary[400] },
									}}
									sx={{
										p: "20px 0",
										"& label.Mui-focused": {
											color: theme.palette.secondary[400],
										},
										" & .MuiOutlinedInput-root": {
											"&.Mui-focused fieldset": {
												borderColor: err.show
													? theme.palette.error.main
													: theme.palette.background.default,
											},
										},
									}}
								/>

								<Box
									width="100%"
									display="flex"
									alignItems="center"
									justifyContent="space-between">
									<Box>
										{err.show && (
											<FormHelperText
												sx={{
													fontSize: 12,
													color: theme.palette.error.main,
												}}>
												{err.msg}
											</FormHelperText>
										)}
									</Box>
									{body && (
										<UpdateBtn
											onClick={() => {
												handleUpdateComment();
											}}>
											Update
										</UpdateBtn>
									)}
								</Box>
							</>
						) : (
							<Typography
								sx={{ color: theme.palette.secondary[300], p: "20px 0" }}>
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
