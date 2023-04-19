import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSingleTrainingQuery } from "../../redux/trainings/trainingsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import UpdateForm from "./UpdateForm";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

const UpdateTraining = () => {
	const params = useParams();
	const user = useSelector(selectCurrentUser);
	const navigate = useNavigate();
	const theme = useTheme();
	const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

	const { data: training, isLoading } = useGetSingleTrainingQuery({
		id: params?.trainingId,
	});

	if (!params?.trainingId || !training || isLoading) return;
	if (user?.id !== training?.user) navigate("/");
	console.log(training.description);
	return (
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
					Update the training {training?.title}
				</Typography>
				<UpdateForm training={training} />
			</Box>
		</Box>
	);
};

export default UpdateTraining;
