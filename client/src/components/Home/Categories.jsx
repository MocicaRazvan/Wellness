import React, { useEffect, useRef } from "react";
import biceps from "../../images/categories/Biceps.jpg";
import triceps from "../../images/categories/Triceps.jpg";
import chest from "../../images/categories/Chest.png";
import shoulders from "../../images/categories/Shoulder.jpg";
import back from "../../images/categories/Back.jpg";
import quades from "../../images/categories/Quads.jpg";
import glutes from "../../images/categories/Glutes.jpg";
import femural from "../../images/categories/Femural.jpg";
import abs from "../../images/categories/Abs.jpg";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import { Divider, Typography } from "@mui/material";
import { useTheme } from "@mui/material";

const images = [
	{
		url: biceps,
		title: "Biceps",
		width: "40%",
	},
	{
		url: triceps,
		title: "Triceps",
		width: "20%",
	},
	{
		url: chest,
		title: "Chest",
		width: "40%",
	},
	{
		url: shoulders,
		title: "Shoulders",
		width: "38%",
	},
	{
		url: back,
		title: "Back",
		width: "38%",
	},
	{
		url: quades,
		title: "Quades",
		width: "24%",
	},
	{
		url: glutes,
		title: "Glutes",
		width: "40%",
	},
	{
		url: femural,
		title: "Femural",
		width: "20%",
	},
	{
		url: abs,
		title: "Abs",
		width: "40%",
	},
];

const Categories = () => {
	const { palette } = useTheme();
	const catRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("show");
				}
			});
		});
		observer.observe(catRef.current);
	}, [catRef]);

	return (
		<Container
			component="section"
			sx={{
				mt: 8,
				mb: 4,
				opacity: 0,
				filter: "blur(5px)",
				transform: `translateX(-100%)`,
				transition: "all 1.5s",
				"&.show": {
					opacity: 1,
					filter: "blur(0)",
					transform: `translateX(0)`,
				},
			}}
			ref={catRef}>
			<Typography
				variant="h4"
				marked="center"
				align="center"
				component="h2"
				color={palette.secondary[200]}
				gutterBottom>
				For all your body
			</Typography>
			<CustomDivider color={palette.secondary[800]} />
			<Box sx={{ mt: 8, display: "flex", flexWrap: "wrap" }}>
				{images.map((image) => (
					<ImageIconButton
						key={image.title}
						style={{
							width: image.width,
						}}>
						<Box
							sx={{
								position: "absolute",
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								backgroundSize: "cover",
								backgroundPosition: "center 40%",
								backgroundImage: `url(${image.url})`,
							}}
						/>
						<ImageBackdrop className="imageBackdrop" />
						<Box
							sx={{
								position: "absolute",
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								color: "common.white",
							}}>
							<Typography
								component="h3"
								variant="h6"
								color={palette.secondary[200]}
								className="imageTitle">
								{image.title}
								<div className="imageMarked" />
							</Typography>
						</Box>
					</ImageIconButton>
				))}
			</Box>
		</Container>
	);
};

const CustomDivider = styled(Divider)(({ theme }) => ({
	width: "25%",
	position: "relative",
	transform: "translateX(150%)",
	borderBottomWidth: 5,
	fontWeight: "bold",
}));

const ImageBackdrop = styled("div")(({ theme }) => ({
	position: "absolute",
	left: 0,
	right: 0,
	top: 0,
	bottom: 0,
	background: "#00000085",
	opacity: 0.5,
	transition: theme.transitions.create("opacity"),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
	position: "relative",
	display: "block",
	padding: 0,
	borderRadius: 0,
	height: "40vh",
	[theme.breakpoints.down("md")]: {
		width: "100% !important",
		height: 100,
	},
	"&:hover": {
		zIndex: 1,
	},
	"&:hover .imageBackdrop": {
		opacity: 0.15,
	},
	"&:hover .imageMarked": {
		opacity: 0,
	},
	"&:hover .imageTitle": {
		border: "4px solid currentColor",
	},
	"& .imageTitle": {
		position: "relative",
		padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
	},
	"& .imageMarked": {
		height: 3,
		width: 18,
		background: theme.palette.secondary[500],
		position: "absolute",
		bottom: -2,
		left: "calc(50% - 9px)",
		transition: theme.transitions.create("opacity"),
	},
}));

export default Categories;
