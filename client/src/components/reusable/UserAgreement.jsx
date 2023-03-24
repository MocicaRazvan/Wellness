import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { useState } from "react";
import Loading from "./Loading";

export default function UserAgreement({
	open,
	setOpen,
	handleAgree,
	title = "",
	text = "",
}) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
	const [loading, setLoading] = useState({
		msg: "Loading...",
		show: false,
	});

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby="responsive-dialog-title">
				<Box bgcolor={theme.palette.background.default}>
					<Loading loading={loading} />
					<DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
					<DialogContent>
						<DialogContentText>{text}</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={handleClose}
							sx={{ color: theme.palette.secondary[300] }}>
							Disagree
						</Button>
						<Button
							onClick={() => {
								handleAgree();

								setLoading((prev) => ({ ...prev, show: true }));

								setTimeout(() => {
									setLoading((prev) => ({ ...prev, show: false }));
									handleClose();
								}, 1000);
							}}
							sx={{ color: theme.palette.secondary[300] }}
							autoFocus>
							Agree
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</div>
	);
}
