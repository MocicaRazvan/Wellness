import { alpha, Container, styled } from "@mui/material";

export const CartItems = styled("div")(({ theme }) => ({
	p: 2,
	display: "flex",
	backgroundColor: alpha(theme.palette.primary.main, 0.15),
	height: "auto",
	padding: "50px 0",
	gap: 10,
	"& .img": {
		width: 200,
		height: 200,
		marginRight: 20,
	},
	"& img": {
		width: "100%",
		height: "100%",
		objectFit: "contain",
	},
	"& h4 span": {
		color: theme.palette.secondary.main,
		ml: 20,
		fontWeight: 500,
	},
	[theme.breakpoints.down("md")]: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
}));

export const StackContainer = styled(Container)(({ theme }) => ({
	width: "100%",
	display: "flex",
	gap: 8,
	alignItems: "center",
	justifyContent: "space-between",
	flexDirection: "column",
	[theme.breakpoints.down("sm")]: {
		justifyContent: "center",
	},
}));

export const CartTotal = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: "8px",
	boxShadow: "rgb(3 0 71 / 9%) 0px 1px 3px",
	m: 10,
	mt: 30,
	ml: 30,
	height: "fit-content",
	p: 10,
	width: "30%",
	"& h4": {
		fontSize: 15,
		fontWeight: 400,
	},
	"& h3": {
		fontSize: 20,
		fontWeight: 500,
		color: theme.palette.secondary.main,
	},
	"& h2": {
		fontSize: 18,
		mt: 20,
		//borderBottom: `1px solid ${theme.palette.secondary.light}`,
		pb: 10,
		color: theme.palette.secondary.main,
	},
	[theme.breakpoints.down("md")]: {
		width: "90%",
	},
}));
