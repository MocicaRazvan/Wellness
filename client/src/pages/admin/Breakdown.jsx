import { Box } from "@mui/system";
import React, { useMemo, useState } from "react";
import BreakdownChart from "../../components/admin/BreakdownChart";
import OrdersTagRadarChart from "../../components/admin/OrdersTagRadarChart";
import Header from "../../components/reusable/Header";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	useMediaQuery,
} from "@mui/material";
import months from "../../utils/consts/months";
import { useOutletContext } from "react-router-dom";

const Breakdown = () => {
	const isSideBarOpen = useOutletContext();
	const [month, setMonth] = useState(new Date().getMonth() + 1);
	const [year, setYear] = useState(new Date().getFullYear());
	const isNonSmallScreens = useMediaQuery("(min-width: 620px)");
	const isClose = !isNonSmallScreens && isSideBarOpen;
	const years = useMemo(() => {
		const items = [];
		for (
			let i = new Date().getFullYear();
			i >= new Date().getFullYear() - 9;
			i--
		) {
			items.push(<MenuItem value={i}>{i}</MenuItem>);
		}
		return items;
	}, []);
	const monthsArr = useMemo(() => {
		const items = [];
		// const maxMonth =
		// 	year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12;
		for (
			let i = 0;
			i < (year === new Date().getFullYear() ? new Date().getMonth() + 1 : 12);
			i++
		) {
			items.push(<MenuItem value={i + 1}>{months[i]}</MenuItem>);
		}
		return items;
	}, [year]);

	return (
		<Box m="1.5rem 2.5rem" display="column" overflow="hidden">
			<Box flex={1} overflow="hidden">
				<Header
					title="Breakdown"
					subtitle="Breakdown of month by category"
					small="true"
				/>
				<Box mt="40px" height="75vh" display={isClose ? "none" : "block"}>
					<FormControl sx={{ mt: "1rem" }}>
						<InputLabel>Month</InputLabel>
						<Select
							value={month}
							label="Month"
							inputProps={{
								MenuProps: {
									MenuListProps: {
										sx: {
											maxHeight: 220,
										},
									},
								},
							}}
							onChange={(e) => setMonth(e.target.value)}>
							{monthsArr}
						</Select>
					</FormControl>
					<FormControl
						sx={{ mt: "1rem", ml: { xs: isSideBarOpen ? 0 : 2, sm: 2 } }}>
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

					<BreakdownChart year={year} month={month} />
				</Box>
			</Box>
			<Box flex={1} overflow="hidden" display={isClose ? "none" : "block"}>
				<OrdersTagRadarChart />
			</Box>
		</Box>
	);
};

export default Breakdown;
