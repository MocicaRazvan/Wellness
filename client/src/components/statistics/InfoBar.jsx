import React, { useMemo, useState } from "react";
import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from "@mui/material";
import months from "../../utils/consts/months";
import noData from "../../utils/lottie/noData.json";
import Lottie from "react-lottie-player";
import { useGetTotalUserMonthQuery } from "../../redux/orders/orderApi";
import Header from "../reusable/Header";
import Bar from "./Bar";
const InfoBar = ({
	userId,
	maxYear = new Date().getFullYear() - 9,
	title = "Spendings by month",
	subtitle = "Bar of monthly Spendings and Units",
	small = "false",
	height = "75vh",
}) => {
	const [year, setYear] = useState(new Date().getFullYear());
	const years = useMemo(() => {
		const items = [];
		for (let i = new Date().getFullYear(); i >= maxYear; i--) {
			items.push(<MenuItem value={i}>{i}</MenuItem>);
		}
		return items;
	}, [maxYear]);
	const { data, isLoading } = useGetTotalUserMonthQuery(
		{ year, userId },
		{ refetchOnReconnect: true },
	);

	const formatedData = useMemo(
		() =>
			data?.map(({ _id, total: t, units }) => ({
				month: months[_id - 1],
				total: t / 100,
				"units*10": units * 10,
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

	return (
		<Box width="100%" height={height} m="1.5rem 2.5rem">
			<Header title={title} subtitle={subtitle} small={small} />
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
				<Bar formatedData={formatedData} />
			)}
		</Box>
	);
};

export default InfoBar;
