import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../redux/auth/authSlice";
import { useCreateSupportConversationMutation } from "../../redux/conversation/conversationApi";
import { useTheme } from "@mui/material";
import blackHug from "../../images/hug/blackHug.svg";
import whiteHug from "../../images/hug/whiteHug.svg";
import { useEffect, useRef } from "react";
import { setNotReload } from "../../redux/messages/messagesSlice";
const SmokingHero = () => {
	const navigate = useNavigate();
	const user = useSelector(selectCurrentUser);
	const [createConv] = useCreateSupportConversationMutation();
	const { palette } = useTheme();
	const heroRef = useRef();
	const dispatch = useDispatch();

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					e.target.classList.add("show");
				} else {
					e.target.classList.remove("show");
				}
			});
		});
		observer.observe(heroRef.current);
	}, [heroRef]);

	const handleSupport = async () => {
		if (!user) {
			navigate("/login");
		} else if (user?.role !== "admin") {
			dispatch(setNotReload(true));
			// dispatch(setShow(true));
			await createConv({ id: user?.id });
			navigate("/messenger", { state: true });
		} else if (user?.role === "admin") {
			dispatch(setNotReload(true));
			// dispatch(setShow(true));
			navigate("/messenger", { state: true });
		}
	};
	return (
		<Container
			component="section"
			ref={heroRef}
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				my: 9,
				opacity: 0,
				filter: "blur(5px)",
				transform: `translateY(100%)`,
				transition: "all 1.5s",
				"&.show": {
					opacity: 1,
					filter: "blur(0)",
					transform: `translateY(0)`,
				},
			}}>
			<Button
				sx={{
					border: `4px solid ${palette.secondary[200]}`,
					borderRadius: 0,
					height: "auto",
					py: 2,
					px: 5,
				}}
				onClick={handleSupport}>
				<Typography
					variant="h4"
					component="span"
					color={palette.secondary[200]}
					fontWeight="bold"
					letterSpacing={1.5}>
					Got any questions? Need help?
				</Typography>
			</Button>
			<Typography
				variant="subtitle1"
				sx={{ my: 3, letterSpacing: 2 }}
				color={palette.secondary[200]}>
				We are here to help. Get in touch!
			</Typography>
			<Box
				component="img"
				src={palette.mode === "dark" ? whiteHug : blackHug}
				alt="buoy"
				sx={{ width: 60 }}
			/>
		</Container>
	);
};

export default SmokingHero;
