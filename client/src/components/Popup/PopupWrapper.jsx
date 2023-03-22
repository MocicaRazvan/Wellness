import React, { useEffect, useState } from "react";
import PopUp from "./Popup";
import { useSelector } from "react-redux";
import { selectSocket } from "../../redux/socket/socketSlice";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetNotificationsByUserQuery } from "../../redux/notifications/notificationsApi";

const PopupWrapper = () => {
	const socketRedux = useSelector(selectSocket);
	const [skip, setSkip] = useState(true);
	const user = useSelector(selectCurrentUser);
	const [notifications, setNotifications] = useState([]);
	// const messages = useSelector(selectMessageNotification);
	// const dispatch = useDispatch();

	const { data, isLoading } = useGetNotificationsByUserQuery(
		{ receiverId: user?.id },
		{ skip },
	);

	useEffect(() => {
		if (user?.id) void setSkip(false);
	}, [user?.id]);
	useEffect(() => void setNotifications(data), [data]);

	useEffect(() => {
		if (socketRedux && user?.id) {
			socketRedux.on("getNotification", ({ type, sender, ref }) => {
				//console.log(socketRedux);
				setNotifications((prev) => [
					...prev,
					{
						receiver: user?.id,
						sender,
						type,
						ref,
						createdAt: new Date().getTime(),
					},
				]);
				//dispatch(addMessage({ value: 1 }));
			});
		}
	}, [socketRedux, user?.id]);

	if ([!socketRedux, isLoading, notifications, user?.id].every(Boolean))
		return <></>;

	return (
		<PopUp
			notifications={notifications}
			userId={user?.id}
			setNotifications={setNotifications}
		/>
	);
};

export default PopupWrapper;
