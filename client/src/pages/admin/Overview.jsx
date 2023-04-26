import { FormControl, MenuItem, InputLabel, Box, Select } from "@mui/material";
import React, { useMemo, useState } from "react";
import OverviewChart from "../../components/admin/OverviewChart";
import Header from "../../components/reusable/Header";
import { useOutletContext } from "react-router-dom";

const Overview = ({
	admin = true,
	title = "Overview",
	subtitle = "Overview of general revenue and profit.",
	sales = "Sales",
	isProfile = false,
	maxYear = new Date().getFullYear() - 9,
	small = "false",
}) => {
	const [view, setView] = useState("units");
	const [year, setYear] = useState(new Date().getFullYear());
	const isSideBarOpen = useOutletContext();

	const years = useMemo(() => {
		const items = [];
		for (let i = new Date().getFullYear(); i >= maxYear; i--) {
			items.push(<MenuItem value={i}>{i}</MenuItem>);
		}
		return items;
	}, [maxYear]);
	return (
		<Box m="1.5rem 2.5rem">
			<Header title={title} subtitle={subtitle} small={small} />
			<Box height="75vh">
				<FormControl sx={{ mt: "1rem" }}>
					<InputLabel>View</InputLabel>
					<Select
						value={view}
						label="View"
						onChange={(e) => setView(e.target.value)}>
						<MenuItem value="sales">{sales}</MenuItem>
						<MenuItem value="units">Units</MenuItem>
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
				<OverviewChart
					view={view}
					year={year}
					admin={admin}
					isProfile={isProfile}
				/>
			</Box>
		</Box>
	);
};

export default Overview;
