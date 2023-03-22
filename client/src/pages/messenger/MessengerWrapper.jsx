import { Box, CircularProgress, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import {
	selectNotReload,
	setNotReload,
} from "../../redux/messages/messagesSlice";
import { selectSocket } from "../../redux/socket/socketSlice";
import Messenger from "./Messenger";

const MessengerWrapper = ({ admin = false }) => {
	// const mounted = useRef(false);
	const socketRedux = useSelector(selectSocket);
	const user = useSelector(selectCurrentUser);
	const theme = useTheme();
	const dispatch = useDispatch();
	const notReload = useSelector(selectNotReload);

	useEffect(() => {
		return () => {
			dispatch(setNotReload(false));
		};
	}, [dispatch]);

	useEffect(() => {
		if (socketRedux && user?.id && notReload) {
			socketRedux.emit("mountUser", user?.id);
		}
		return () => {
			if (socketRedux && user?.id) {
				socketRedux.emit("unMountUser", user?.id);
			}
		};
	}, [notReload, socketRedux, user?.id]);

	if (!socketRedux || !user?.id)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	return (
		<Box
			m={{ xs: 0, md: 2 }}
			p={{ xs: 0, md: 5 }}
			borderRadius={{ xs: 0, md: 20 }}
			height={{ xs: "100%", md: "90%" }}
			sx={{ mt: "80px !important" }}
			bgcolor={theme.palette.background.alt}>
			{/* <Messenger ws={socketRedux} mounted={mounted} admin={admin} /> */}
			<Messenger ws={socketRedux} mounted={notReload} admin={admin} />
		</Box>
	);
};

export default MessengerWrapper;
