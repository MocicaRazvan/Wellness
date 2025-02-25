import {
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	styled,
	useTheme,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { selectExercises } from "../../redux/exercises/exercisesSlice";
import muscleGroupValues from "../../utils/consts/muscleGorups.js";
import tagValues from "../../utils/consts/tags";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const SelectTags = ({ tags, setTags, error, type = "Post" }) => {
	const theme = useTheme();
	const handleChange = (event) => {
		const {
			target: { value },
		} = event;
		setTags(
			// On autofill we get a stringified value.
			typeof value === "string" ? value.split(",") : value,
		);
	};

	const curExercises = useSelector(selectExercises).currentExercises.map(
		({ title, id }) => ({ title, id }),
	);

	let id;
	switch (type) {
		case "Exercise":
			id = "MuscleGroups";
			break;
		case "Posts":
			id = "Tags";
			break;
		case "CurExercises":
			id = "CurEx";
			break;
		default:
			id = "Tags";
			break;
	}

	return (
		<>
			<FormControl>
				<InputLabel htmlFor={id}>{id}</InputLabel>
				<Select
					label={id}
					sx={{ p: 0, m: 0 }}
					disableUnderline
					id={id}
					multiple
					value={tags}
					error={error}
					onChange={handleChange}
					input={<OutlinedInput sx={{ p: 0, m: 0 }} label="Tag" />}
					renderValue={(selected) => selected.join(", ")}
					MenuProps={MenuProps}
					inputProps={{
						MenuProps: {
							MenuListProps: {
								sx: {
									color: theme.palette.secondary[300],
									"& .Mui-checked": {
										color: theme.palette.secondary[300],
									},
									"& .css-8sgh38-MuiButtonBase-root-MuiCheckbox-root.Mui-checked":
										{
											color: theme.palette.secondary[300],
										},
								},
							},
						},
					}}>
					{type === "Post" &&
						tagValues.map((tag) => (
							<MenuItemSelect key={tag} value={tag}>
								<Checkbox checked={tags.indexOf(tag) > -1} />
								<ListItemText primary={tag} />
							</MenuItemSelect>
						))}
					{type === "Exercise" &&
						muscleGroupValues.map((mG) => (
							<MenuItemSelect key={mG} value={mG}>
								<Checkbox checked={tags.indexOf(mG) > -1} />
								<ListItemText primary={mG} />
							</MenuItemSelect>
						))}
					{type === "CurExercises" &&
						curExercises.map(({ title, id }) => (
							<MenuItemSelect key={id} value={id} sx={{ p: 0, m: 0 }}>
								<Checkbox checked={tags.indexOf(id) > -1} />
								<ListItemText primary={title} />
							</MenuItemSelect>
						))}
				</Select>
			</FormControl>
		</>
	);
};

const MenuItemSelect = styled(MenuItem)(({ theme }) => ({
	padding: 0,
	margin: 0,
}));

export default SelectTags;
