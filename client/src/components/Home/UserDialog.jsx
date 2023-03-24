import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const UserDialog = () => {
	const [open, setOpen] = useState(false);
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const theme = useTheme();
	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		if (!user && sessionStorage["showDialog"] !== "false") {
			const delay = setTimeout(() => {
				setOpen(true);
				sessionStorage["showDialog"] = false;
			}, 2000);
			return () => clearTimeout(delay);
		}
	}, [user]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<Box sx={{ bgcolor: theme.palette.background.alt }}>
				<DialogTitle
					id="alert-dialog-title"
					sx={{
						fontSize: "25px",
						color: theme.palette.secondary[300],
						fontWeight: "bold",
						letterSpacing: 1.5,
					}}>
					It seems that you are not logged in
				</DialogTitle>
				<DialogContent>
					<DialogContentText
						id="alert-dialog-description"
						sx={{
							fontSize: "20px",
							color: theme.palette.secondary[200],
							fontWeight: "600",
						}}>
						Login or create an account in just 1 minute to embrace the full
						experience of the site without any long term obligations!
					</DialogContentText>
				</DialogContent>
				<DialogActions
					sx={{
						"& .btn": {
							color: theme.palette.secondary[200],
						},
					}}>
					<Button onClick={handleClose} variant="contained" className="btn">
						Maybe Later
					</Button>
					<Button
						onClick={() => {
							navigate("/login");
							handleClose();
						}}
						autoFocus
						variant="contained"
						className="btn">
						Login
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default UserDialog;
