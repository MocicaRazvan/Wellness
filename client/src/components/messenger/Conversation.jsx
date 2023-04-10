import { alpha, Box, styled, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useGetUserByIdQuery } from "../../redux/user/userApi";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";

const Conversation = ({ conversation, currentUser, setScroll }) => {
	const { data: user } = useGetUserByIdQuery({
		id: conversation?.members?.find((m) => m !== currentUser.id),
	});
	useEffect(() => {
		const scrollElem = document.getElementById(`${conversation?.id}`);
		if (scrollElem) {
			setScroll(scrollElem.offsetTop);
		}
	});

	return (
		<ConversationWrapper>
			<img
				src={user?.image?.url || blankUser}
				alt=""
				className="conversationImg"
			/>
			<Typography variant="body1" fontWeight="bold">
				{user?.username}
			</Typography>
		</ConversationWrapper>
	);
};

export default Conversation;

const ConversationWrapper = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: 10,
	gap: 20,
	margin: 10,
	":hover": { backgroundColor: alpha(theme.palette.primary.main, 0.35) },
	cursor: "pointer",
	"& .conversationImg": {
		width: 40,
		height: 40,
		borderRadius: "50%",
		objectFit: "cover",
	},
}));
