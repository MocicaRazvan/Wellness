import { Box, IconButton, Typography } from "@mui/material";
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
				<ThumbUpIcon sx={{ height: "20px", width: " 20px", color: "" }} />
			</IconButton>
			<Typography sx={{ color: "custom.moderateBlue", fontWeight: 500 }}>
				{comment?.likes?.length - comment?.dislikes?.length}
			</Typography>
			<IconButton
				disableRipple
				aria-label="decrease score"
				onClick={() => {
					handleActions("dislikes");
				}}>
				<ThumbDownIcon sx={{ height: "20px", width: " 20px", color: "" }} />
			</IconButton>
		</Box>
	);
};

export default Actions;
