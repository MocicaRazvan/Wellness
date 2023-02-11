import { styled, alpha } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { format } from "timeago.js";

const Message = ({ message, own }) => {
	return (
		<MessageWrapper own={own}>
			<div className="messageTop">
				<div className="messageText">{message?.text}</div>
			</div>
			<div className="messageBottom">{format(message?.createdAt)}</div>
		</MessageWrapper>
	);
};

export default Message;

const MessageWrapper = styled(Box)(({ theme, own }) => ({
	display: "flex",
	flexDirection: "column",
	marginTop: 20,
	alignItems: own && "flex-end",
	"& .messageTop": { display: "flex", gap: 10 },
	"& .messageImg": {
		width: 32,
		height: 32,
		borderRadius: "50%",
		objectFit: "cover",
	},
	"& .messageText": {
		padding: 10,
		borderRadius: 20,
		backgroundColor: own
			? theme.palette.secondary[400]
			: theme.palette.neutral[400],
		color: "black",
		fontWeight: 500,
		fontSize: 15,
		maxWidth: 300,
	},
	"& .messageBottom": {
		fontSize: 12,
		marginTop: 10,
	},
}));
