import { Box, IconButton, Typography, useTheme } from "@mui/material";
import React, { useContext, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
	useCommentActionsMutation,
	useDeleteCommentMutation,
} from "../../redux/comments/commentsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const Actions = ({ comment }) => {
	const [actionComment] = useCommentActionsMutation();

	const user = useSelector(selectCurrentUser);
	const isAuth = user.id === comment.user._id || user.role === "admin";
	const { palette } = useTheme();

	const handleActions = async (action) => {
		try {
			await actionComment({ id: comment.id, action }).unwrap();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				flexDirection: "column",
				borderRadius: "5px",
			}}>
			<IconButton
				disableRipple
				aria-label="like"
				onClick={() => {
					handleActions("likes");
				}}>
				<ThumbUpIcon
					sx={{
						color: comment?.likes.includes(user?.id)
							? palette.secondary[300]
							: palette.success.main,
					}}
				/>
			</IconButton>
			<Typography sx={{ color: palette.secondary[400], fontWeight: 500 }}>
				{comment?.likes?.length - comment?.dislikes?.length}
			</Typography>
			<IconButton
				disableRipple
				aria-label="decrease score"
				onClick={() => {
					handleActions("dislikes");
				}}>
				<ThumbDownIcon
					sx={{
						color: comment?.dislikes.includes(user?.id)
							? palette.secondary[300]
							: palette.error.main,
					}}
				/>
			</IconButton>
		</Box>
	);
};

export default Actions;
