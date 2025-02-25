import SearchIcon from "@mui/icons-material/Search";
import { InputBase, useMediaQuery } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
	selectCurrentSearch,
	setSearch,
} from "../../redux/searchState/searchSlice";

//getLimitTagsText
function SearchBar() {
	const isNonMobile = useMediaQuery("(min-width:900px)");
	const searchVal = useSelector(selectCurrentSearch);
	const [auto, setAuto] = useState(
		(localStorage["searchHistory"] &&
			JSON.parse(localStorage["searchHistory"])) ||
			[],
	);
	const { pathname } = useLocation();
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setSearch(""));
	}, [dispatch, pathname]);

	const handleSearchChange = (e, prop) => {
		e.stopPropagation();
		dispatch(setSearch(e.target[prop]));
		//console.log(e.target.value);
	};

	const handleBlur = (e) => {
		if (e.target.value !== "") {
			localStorage["searchHistory"]
				? (localStorage["searchHistory"] = JSON.stringify([
						...new Set(
							[
								e.target.value,
								...JSON.parse(localStorage["searchHistory"]),
							].filter((_, i, arr) => arr.length <= 10 || i < 10),
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
				options={auto}
				getOptionLabel={(option) => option}
				style={{ width: isNonMobile ? 300 : 140 }}
				freeSolo
				inputValue={searchVal}
				renderInput={({ InputLabelProps, InputProps, ...rest }) => {
					InputProps.endAdornment = null;
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
