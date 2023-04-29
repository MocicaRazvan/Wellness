import {
	Alert,
	Button,
	Grow,
	IconButton,
	Slide,
	Snackbar,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";

const CustomSnack = ({
	setOpen,
	open,
	severity = "success",
	message = "",
	minWidth = 300,
	vertical = "bottom",
	horizontal = "left",
	pathname = "",
}) => {
	const navigate = useNavigate();
	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
		if (pathname !== "") {
			console.log({ pathname });
			navigate(pathname, { replace: true });
		}
	};
	return (
		<Snackbar
			id="customSnack"
			onMouseEnter={(e) => e.stopPropagation()}
			onMouseLeave={(e) => e.stopPropagation()}
			open={open}
			onClose={handleClose}
			autoHideDuration={3000}
			anchorOrigin={{ vertical, horizontal }}
			sx={{ minWidth }}
			action={
				<React.Fragment>
					<Button color="secondary" size="small" onClick={handleClose}>
						UNDO
					</Button>
					<IconButton
						aria-label="close"
						color="inherit"
						sx={{ p: 0.5 }}
						onClick={handleClose}>
						<CloseIcon />
					</IconButton>
				</React.Fragment>
			}>
			<Alert
				// variant="filled"
				iconMapping={{
					success: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
					error: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
					warning: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
					info: <CheckCircleOutlineOutlinedIcon fontSize="inherit" />,
				}}
				onClose={handleClose}
				severity={severity}
				sx={{ width: "100%", minWidth: 200 }}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default CustomSnack;
