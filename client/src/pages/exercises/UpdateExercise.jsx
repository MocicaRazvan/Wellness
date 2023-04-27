import { useTheme } from "@emotion/react";
import {
	Box,
	CircularProgress,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useSelector } from "react-redux";
import {
	Navigate,
	useLocation,
	useNavigate,
	useParams,
} from "react-router-dom";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useGetExerciseByIdQuery } from "../../redux/exercises/exercisesApi";
import Form from "./Form";

const UpdateExercise = () => {
	const exerciseId = useParams()?.exerciseId;
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
	const { data: exercise, isLoading } = useGetExerciseByIdQuery(
		{ id: exerciseId },
		{ skip: !exerciseId },
	);

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	if (user?.id !== exercise?.user) {
		navigate("/");
	}

	return user ? (
		<Box>
			<Box
				width={isNonMobileScreens ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={theme.palette.background.alt}>
				<Typography
					fontWeight="bold"
					textAlign="center"
					color={theme.palette.secondary[200]}
					letterSpacing={1.5}
					variant="h3"
					sx={{ mb: "1.5rem" }}>
					Update the exercise {exercise?.title}
				</Typography>
				<Form exercise={exercise} />
			</Box>
		</Box>
	) : (
		<></>
	);
};

export default UpdateExercise;
