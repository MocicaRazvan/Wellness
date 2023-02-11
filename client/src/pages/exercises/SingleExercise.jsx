import {
	Box,
	Button,
	ButtonGroup,
	Chip,
	CircularProgress,
	Container,
	Stack,
	styled,
	Typography,
	useTheme,
} from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	useDeleteExerciseMutation,
	useGetExerciseByIdQuery,
} from "../../redux/exercises/exercisesApi";
import CustomVideoCarousel from "../../components/reusable/CustomVideoCarousel";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";

const SingleExercise = ({ id = null }) => {
	const { exerciseId } = useParams();
	const { data: exercise, isLoading } = useGetExerciseByIdQuery({
		id: exerciseId || id,
	});
	const [deleteExercise] = useDeleteExerciseMutation();
	const navigate = useNavigate();
	const theme = useTheme();
	const user = useSelector(selectCurrentUser);
	const isAuthor = user?.id === exercise?.user;

	const handleDeleteExercise = async (id) => {
		try {
			await deleteExercise({ id }).unwrap();
			navigate("/exercises/user", { replace: true });
		} catch (error) {
			console.log(error);
		}
	};

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);

	const urls = exercise?.videos?.map(({ url }) => url);

	return (
		<Box m="1.5rem 1rem">
			<Typography
				variant="h2"
				color={theme.palette.secondary[200]}
				fontWeight="600"
				textAlign="center"
				gutterBottom>
				{exercise?.title}
			</Typography>
			<Box mb={4}>
				<CustomVideoCarousel videos={urls} height={500} />
			</Box>
			<Box p="1rem" display="flex" justifyContent="center">
				<Typography
					variant="h4"
					lineHeight={1.5}
					color={theme.palette.secondary[100]}
					width={{ xs: "100%", md: "50%" }}
					textAlign="center"
					dangerouslySetInnerHTML={{ __html: exercise?.body }}
				/>
			</Box>
			{isAuthor && (
				<Box
					mb={3}
					display="flex"
					justifyContent="center"
					alignItems="center"
					gap={5}
					sx={{
						"& .btnDel": {
							color: theme.palette.secondary[200],
						},
					}}>
					<Button
						variant="contained"
						className="btnDel"
						onClick={() => handleDeleteExercise(exercise?.id)}>
						Delete Exercise
					</Button>
					<Button
						variant="contained"
						className="btnUpdate"
						onClick={() =>
							navigate(`/exercises/update/${exercise?.id}`, { state: exercise })
						}>
						Update Exercise
					</Button>
				</Box>
			)}
		</Box>
	);
};



export default SingleExercise;
