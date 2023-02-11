import Autocomplete from "@mui/material/Autocomplete";
import { alpha, styled } from "@mui/system";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
	selectCurrentSearch,
	setSearch,
} from "../../redux/searchState/searchSlice";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useSelector } from "react-redux";

//getLimitTagsText
function SearchBar() {
	const searchVal = useSelector(selectCurrentSearch);
	const [auto, setAuto] = useState(
		(localStorage["searchHistory"] &&
			JSON.parse(localStorage["searchHistory"])) ||
			[],
	);
	const dispatch = useDispatch();
	const handleSearchChange = (e, prop) => {
		e.stopPropagation();
		dispatch(setSearch(e.target[prop]));
		//console.log(e.target.value);
	};
	const handleBlur = (e) => {
		//console.log(e.target.value);
		if (e.target.value !== "") {
			localStorage["searchHistory"]
				? (localStorage["searchHistory"] = JSON.stringify([
						...new Set(
							[
								...JSON.parse(localStorage["searchHistory"]),
								e.target.value,
							].slice(1, 11),
						),
				  ]))
				: (localStorage["searchHistory"] = JSON.stringify([e.target.value]));

			setAuto(JSON.parse(localStorage["searchHistory"]));
		}
	};

	return (
		<Search>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>

			<Autocomplete
				id="combo-box-demo"
				options={auto}
				getOptionLabel={(option) => option}
				style={{ width: 300 }}
				freeSolo
				inputValue={searchVal}
				renderInput={({ InputLabelProps, InputProps, ...rest }) => {
					return (
						<StyledInputBase
							{...InputProps}
							placeholder="Search..."
							{...rest}
							onChange={(e) => handleSearchChange(e, "value")}
							onBlur={handleBlur}
						/>
					);
				}}
				onChange={(e) => {
					if (e.target.tagName === "LI")
						return handleSearchChange(e, "innerHTML");
					else if (e.target.tagName === "svg" || e.target.tagName === "path")
						dispatch(setSearch(""));
				}}
				//iau cu dqsel acel buton in cel mai rau caz
			/>
		</Search>
	);
}

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.primary.main,
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
	},
	marginRight: theme.spacing(2),
	marginLeft: theme.spacing(1),
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(3),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "20ch",
		},
	},
}));

export default SearchBar;
