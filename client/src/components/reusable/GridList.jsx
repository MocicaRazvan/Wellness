import { Grid, styled } from "@mui/material";
import { Box } from "@mui/system";
import { cloneElement } from "react";
const GridList = ({
	items,
	children,
	type,
	user = "false",
	setDeleteTitle = () => {},
}) => {
	return (
		<Wrapper component="div">
			<Grid container spacing={2} columnSpacing={2} justifyContent="center">
				{items?.map((item) => (
					<Grid
						xl={3}
						lg={4}
						md={6}
						xs={12}
						item
						key={item.id}
						justifyContent="center"
						alignItems="center">
						<Box>
							{cloneElement(children, { item, type, user, setDeleteTitle })}
						</Box>
					</Grid>
				))}
			</Grid>
		</Wrapper>
	);
};
const Wrapper = styled(Box)(({ theme }) => ({
	padding: 40,
	[theme.breakpoints.up("sm")]: {},
}));

export default GridList;
