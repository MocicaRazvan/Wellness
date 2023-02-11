import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { selectSocket } from "../../redux/socket/socketSlice";
import Messenger from "./Messenger";

const MessengerWrapper = ({ admin = false }) => {
	const mounted = useRef(false);
	const socketRedux = useSelector(selectSocket);
	const user = useSelector(selectCurrentUser);
	const theme = useTheme();

	useEffect(() => {
		mounted.current = true;

		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (socketRedux && user?.id) {
			socketRedux.emit("mountUser", user?.id);
		}
		return () => {
			if (socketRedux && user?.id) {
				socketRedux.emit("unMountUser", user?.id);
			}
		};
	}, [socketRedux, user?.id]);

	if (!socketRedux || !user?.id) return <></>;

	return (
		<Box
			m={{ xs: 0, md: 2 }}
			p={{ xs: 0, md: 5 }}
			borderRadius={{ xs: 0, md: 20 }}
			height={{ xs: "100%", md: "90%" }}
			sx={{ mt: "80px !important" }}
			bgcolor={theme.palette.background.alt}>
			<Messenger ws={socketRedux} mounted={mounted} admin={admin} />
		</Box>
	);
};

export default MessengerWrapper;
