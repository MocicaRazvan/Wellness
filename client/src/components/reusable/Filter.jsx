import {
	alpha,
	CircularProgress,
	FormControl,
	FormControlLabel,
	Grid,
	Paper,
	Radio,
	RadioGroup,
	styled,
	Typography,
	Checkbox,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import FlexBetween from "./FlexBetween";
import SelectTags from "./SelectTags";

const Filter = ({ sorting, isLoading, setSorting, isError, tags, setTags }) => {
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");

	const srotingBy = ["title", "createdAt"];

	if (isLoading)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	return (
		<Box m={4} p={1}>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection={isNonMobile ? "row" : "column"}
				m="0 auto"
				width="80%">
				<Box
					flex={2}
					display="flex"
					flexDirection="row"
					flexWrap="wrap"
					justifyContent="start"
					alignItems="center"
					gap={5}>
					{srotingBy.map((el) => (
						<Box key={el}>
							<Typography
								variant="h5"
								color={theme.palette.secondary[200]}
								fontWeight="600">
								{el.toLocaleUpperCase()}
							</Typography>
							<FlexBetween>
								<FormControlLabel
									label="asc"
									control={
										<Checkbox
											checked={sorting[el] === "asc" ? true : false}
											onChange={() =>
												setSorting((prev) => ({ ...prev, [el]: "asc" }))
											}
										/>
									}
								/>
								<FormControlLabel
									label="desc"
									control={
										<Checkbox
											checked={sorting[el] === "desc" ? true : false}
											onChange={() =>
												setSorting((prev) => ({ ...prev, [el]: "desc" }))
											}
										/>
									}
								/>
							</FlexBetween>
						</Box>
					))}
				</Box>
				<Box flex={1} width="100%">
					<FormControl fullWidth>
						<SelectTags tags={tags} setTags={setTags} error={isError} />
					</FormControl>
				</Box>
			</Box>
		</Box>
	);
};

const CustomPaper = styled(Paper)(({ theme }) => ({
	padding: 2,
	marginBottom: 2,
	//backgroundColor: alpha(theme.palette.primary.main, 0.2),
	backgroundColor: "transparent",
}));

export default Filter;
