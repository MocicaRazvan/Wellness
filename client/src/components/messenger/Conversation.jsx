import { alpha, Box, styled, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useGetUserByIdQuery } from "../../redux/user/userApi";
import blankUser from "../../images/profile/blank-profile-picture-g212f720fb_640.png";
import { useSelector } from "react-redux";
import { selectNotifications } from "../../redux/notifications/notificationsSlice";

const Conversation = ({ conversation, currentUser, currentChat }) => {
	const { palette } = useTheme();
	// const { data: user } = useGetUserByIdQuery({
	// 	id: conversation?.members?.find((m) => m !== currentUser.id),
	// });
	const user = conversation?.members?.find(({ _id }) => _id !== currentUser.id);
	const amountNotif = useSelector(selectNotifications);

	useEffect(() => {
		const scrollElem = document.getElementById(`${conversation?.id}`);
		if (scrollElem?.id === currentChat?.id) {
			scrollElem.scrollIntoView({
				behavior: "instant",
				block: "nearest",
				inline: "nearest",
			});
		}
	});

	return (
		<ConversationWrapper>
			<img
				src={user?.image?.url || blankUser}
				alt=""
				className="conversationImg"
			/>
			<Typography
				variant="body1"
				fontWeight="bold"
				color={palette.secondary[300]}>
				{user?.username}
			</Typography>
			{amountNotif[conversation.id] && (
				<Typography
					variant="body1"
					fontWeight="bold"
					sx={{ textAlign: "end", flex: 1, color: palette.secondary[200] }}>
					{amountNotif[conversation.id]}
				</Typography>
			)}
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
