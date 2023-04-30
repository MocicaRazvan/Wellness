import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	useMediaQuery,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import Lottie from "react-lottie-player";
import { useGetEarningsQuery } from "../../redux/orders/orderApi";
import noData from "../../utils/lottie/noData.json";
import Header from "../reusable/Header";
import Bar from "../statistics/Bar";

const MonthBar = ({
	maxYear = new Date().getFullYear() - 9,
	admin = true,
	color = "dark2",
	groupMode = "grouped",
}) => {
	const [year, setYear] = useState(new Date().getFullYear());
	const isNonMobile = useMediaQuery("(min-width:1000px)");
	const years = useMemo(() => {
		const items = [];
		for (let i = new Date().getFullYear(); i >= maxYear; i--) {
			items.push(<MenuItem value={i}>{i}</MenuItem>);
		}
		return items;
	}, [maxYear]);
	const { data, isLoading } = useGetEarningsQuery(
		{ year, admin },
		{ refetchOnReconnect: true },
	);

	const formatedData = useMemo(
		() =>
			data?.map(({ month, totalSales, totalUnits }) => ({
				month,
				total: totalSales / 100,
				"units*10": totalUnits * 10,
			})),
		[data],
	);
	if (isLoading || !data)
		return (
			<CircularProgress
				sx={{ position: "absolute", top: "50%", left: "50%" }}
				size="3rem"
				thickness={7}
			/>
		);
	console.log({ data, formatedData });
	return (
		<Box width="100%" height="75vh" m="1.5rem 2.5rem">
			<Header
				title={"Overviw Per Month"}
				subtitle={"Overview of general revenue and profit per month"}
			/>
			<FormControl sx={{ mt: "1rem", ml: 2 }}>
				<InputLabel>Year</InputLabel>
				<Select
					value={year}
					label="Year"
					inputProps={{
						MenuProps: {
							MenuListProps: {
								sx: {
									maxHeight: 220,
								},
							},
						},
					}}
					onChange={(e) => setYear(e.target.value)}>
					{years}
				</Select>
			</FormControl>
			{!data || data?.length === 0 ? (
				<Box
					width="100%"
					height="100%"
					display="flex"
					justifyContent="center"
					alignItems="center">
					<Lottie
						loop
						animationData={noData}
						play
						style={{ width: "65%", height: "65%", margin: 0, padding: 0 }}
					/>
				</Box>
			) : (
				// <Box>
				<Box width="100%" height="100%" m="0 auto" sx={{ overflow: "hidden" }}>
					<Bar
						formatedData={formatedData}
						layout={isNonMobile ? "vertical" : "horizontal"}
						color={color}
						groupMode={groupMode}
					/>
				</Box>

				// </Box>
			)}
		</Box>
	);
};

export default MonthBar;
