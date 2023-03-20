import Categories from "../../components/Home/Categories";
import SmokingHero from "../../components/Home/SmokingHero";
import Hero from "../../components/Home/Hero";
import Values from "../../components/Home/Values";
import BookIcon from "@mui/icons-material/Book";
import SportsHandballIcon from "@mui/icons-material/SportsHandball";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PaidIcon from "@mui/icons-material/Paid";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import HeroCarousel from "../../components/Home/HeroCarousel";
import UserDialog from "../../components/Home/UserDialog";
import { useEffect } from "react";

const iconSize = 60;

const values1 = [
	{
		title: "The best posts about fitness",
		body: "From the best trainers and from tested sources, so you do not get the BRO bullshit and stop being stuck. ",
		icon: <BookIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Training Programs",
		body: "Specially designed training programs that target what you are looking for, so you can start see results right away.",
		icon: <SportsHandballIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Exclusive rates",
		body: "Best prices, because we want you to buy a program, not to sell a kidney.",
		icon: <ProductionQuantityLimitsIcon sx={{ fontSize: iconSize }} />,
	},
];

const values2 = [
	{
		title: "Register",
		body: "Sing Up and start.",
		icon: <HowToRegIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "WYSIWYG",
		body: "Buy a training that you enjoy.",
		icon: <PaidIcon sx={{ fontSize: iconSize }} />,
	},
	{
		title: "Work",
		body: "Start working on your dream.",
		icon: <DirectionsRunIcon sx={{ fontSize: iconSize }} />,
	},
];

const Home = () => {
	return (
		<>
			{/* <Hero /> */}
			<HeroCarousel />
			<Values values={values1} links={["/posts", "/trainings", "/trainings"]} />
			<Categories />
			<Values
				values={values2}
				links={["/register", "/trainings", "/trainings"]}
			/>
			<SmokingHero />
			<UserDialog />
		</>
	);
};

export default Home;
