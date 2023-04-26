import React, { useState, useMemo } from "react";
import {
	Box,
	FormControl,
	Select,
	MenuItem,
	InputLabel,
	ListSubheader,
	TextField,
	InputAdornment,
	useTheme,
	Autocomplete,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const containsText = (text, searchText) =>
	text.trim().toLowerCase().indexOf(searchText.trim().toLowerCase()) > -1;

export default function SearchSelect({
	label = "Options",
	allOptions = [
		{ option: "leg", value: 1 },
		{ option: "bicep", value: 2 },
		// option=title, value=id
	],
}) {
	const [option, setOption] = React.useState(null);
	const [inputValue, setInputValue] = React.useState("");
	const [value, setValue] = useState(null);

	console.log({ value, inputValue, option });

	const theme = useTheme();

	return (
		<Autocomplete
			value={option}
			onChange={(event, newValue) => {
				setOption(newValue);
				setValue(allOptions.find(({ option }) => option === newValue).option);
			}}
			inputValue={inputValue}
			onInputChange={(event, newInputValue) => {
				setInputValue(newInputValue);
			}}
			disablePortal
			id="combo-box-demo"
			inputProps={{
				MenuProps: {
					MenuListProps: {
						sx: {
							color: theme.palette.secondary[300],
							"& .Mui-selected": {
								color: theme.palette.background.alt,
								bgcolor: theme.palette.secondary[300],
								"&:hover": {
									color: theme.palette.secondary[300],
								},
							},
						},
					},
				},
			}}
			options={allOptions.map(({ option }) => option)}
			sx={{ width: 300 }}
			renderInput={(params) => <TextField {...params} label={label} />}
		/>
	);
}
