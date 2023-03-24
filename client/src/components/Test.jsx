import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function ResponsiveDialog({ open, setOpen, handleAgree }) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
					<DialogTitle id="responsive-dialog-title">
						{"Use Google's location service?"}
					</DialogTitle>
					<DialogContent>
						<DialogContentText>
							Let Google help apps determine location. This means sending
							anonymous location data to Google, even when no apps are running.
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button
							onClick={() => {
								(async () => await handleAgree())();
								handleClose();
							}}
							sx={{ color: theme.palette.secondary[300] }}>
							Disagree
						</Button>
						<Button
							onClick={handleClose}
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
