import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCommentActionsMutation } from "../../redux/comments/commentsApi";

const Actions = ({ comment }) => {
	const [actionComment] = useCommentActionsMutation();

	const user = useSelector(selectCurrentUser);
	const { palette } = useTheme();
	const navigate = useNavigate();
	const handleActions = async (action) => {
		try {
			await actionComment({ id: comment.id, action }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};
	const isAuthor = user && user?.id === comment?.user?._id;

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-around",
				flexDirection: "column",
				height: "100%",
				maxHeight: 100,
				mr: { xs: 1, sm: 2 },
			}}>
			<Box
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="center">
				<IconButton
					disableRipple
					aria-label="like"
					disabled={isAuthor}
					onClick={() => {
						if (!user) {
							navigate("/login");
						} else {
							handleActions("likes");
						}
					}}>
					<ThumbUpIcon
						sx={{
							color: comment?.likes.includes(user?.id)
								? palette.secondary[300]
								: palette.success.main,
						}}
					/>
				</IconButton>
				<Typography sx={{ color: palette.secondary[400], fontWeight: 600 }}>
					{comment?.likes?.length}
				</Typography>
			</Box>

			<Box
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="center">
				<IconButton
					disableRipple
					aria-label="decrease score"
					sx={{ mt: 0.4 }}
					disabled={isAuthor}
					onClick={() => {
						if (!user) {
							navigate("/login");
						} else {
							handleActions("dislikes");
						}
					}}>
					<ThumbDownIcon
						sx={{
							color: comment?.dislikes.includes(user?.id)
								? palette.secondary[300]
								: palette.error.main,
						}}
					/>
				</IconButton>
				<Typography sx={{ color: palette.secondary[400], fontWeight: 600 }}>
					{comment?.dislikes?.length}
				</Typography>
			</Box>
		</Box>
	);
};

export default Actions;
