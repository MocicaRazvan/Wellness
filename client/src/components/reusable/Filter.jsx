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
	checkboxClasses,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FlexBetween from "./FlexBetween";
import SelectTags from "./SelectTags";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Filter = ({
	sorting,
	isLoading,
	setSorting,
	isError,
	tags,
	setTags,
	type = "post",
}) => {
	console.log(sorting);
	const theme = useTheme();
	const isNonMobile = useMediaQuery("(min-width:600px)");
	const [first, setFirst] = useState(true);

	const srotingBy =
		type === "post" ? ["createdAt", "title"] : ["createdAt", "title", "price"];

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
					flexDirection={isNonMobile ? "row" : "column"}
					flexWrap="wrap"
					justifyContent="start"
					alignItems="center"
					mb={isNonMobile ? 0 : 2}
					gap={5}>
					{srotingBy.map((el, i) => (
						<Box key={el}>
							<Typography
								variant="h5"
								color={theme.palette.secondary[200]}
								fontWeight="600">
								{el.toLocaleUpperCase()}
							</Typography>
							<FlexBetween>
								<FormControlLabel
									label={<ArrowUpwardIcon />}
									control={
										<Checkbox
											color="secondary"
											checked={
												sorting[el] === "asc" ? true : false
												//|| (i === 0 && first)
											}
											onChange={() => {
												setSorting((prev) => ({ ...prev, [el]: "asc" }));
												// if (first && i === 0) {
												// 	setFirst(false);
												// }
												if (
													//i !== 0&&
													sorting[el] === "asc"
												) {
													setSorting((prev) => {
														delete prev[el];
														return prev;
													});
												}
											}}
										/>
									}
								/>
								<FormControlLabel
									label={<ArrowDownwardIcon />}
									control={
										<Checkbox
											color="secondary"
											checked={sorting[el] === "desc" ? true : false}
											onChange={() => {
												setSorting((prev) => ({ ...prev, [el]: "desc" }));
												// if (first && i === 0) {
												// 	setFirst(false);
												// }
												if (
													//i !== 0 &&
													sorting[el] === "desc"
												) {
													setSorting((prev) => {
														delete prev[el];
														return prev;
													});
												}
											}}
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
