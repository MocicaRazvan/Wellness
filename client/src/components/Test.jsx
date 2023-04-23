import {
	Box,
	Button,
	CircularProgress,
	Fab,
	Fade,
	Typography,
	Zoom,
	styled,
	useTheme,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, selectCartItems } from "../redux/cart/cartSlice";
import { selectCurrentUser } from "../redux/auth/authSlice";
import { useGetSingleTrainingQuery } from "../redux/trainings/trainingsApi";
import CustomCarousel from "./reusable/CustomCarousel";
import CustomVideoCarousel from "./reusable/CustomVideoCarousel";
import { useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

const SingleTraining = () => {
	const [actie, setActie] = useState(false);
	return (
		<Box p={32}>
			<ActiveTypograpghy
				active={actie}
				onClick={() => setActie((prev) => !prev)}>
				sdfkjjdskfsasldf
			</ActiveTypograpghy>
		</Box>
	);
};

const ActiveTypograpghy = styled(Typography, {
	shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => ({
	display: "inline-block",
	color: theme.palette.secondary[200],
	position: "relative",
	"&::after": {
		content: "''",
		position: "absolute",
		width: "100%",
		transform: `scaleX(${active ? "1" : "0"})`,
		height: "2px",
		bottom: "0",
		left: "0",
		backgroundColor: theme.palette.secondary[200],
		transformOrigin: "bottom right",
		transition: "transform 0.25s ease-out",
	},
	"&:hover::after": {
		transform: "scaleX(1)",
		transformOrigin: "bottom left",
	},
}));

export default SingleTraining;
