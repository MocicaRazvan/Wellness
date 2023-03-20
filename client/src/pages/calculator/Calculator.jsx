import React, { useState } from "react";
import * as yup from "yup";
import {
	alpha,
	Box,
	Button,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	styled,
	Switch,
	TextField,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { Formik } from "formik";

const activity = {
	BMR: 1,
	"Sedentary: little or no exercise": 1.2,
	"Light: exercise 1-3 times/week": 1.375,
	"Moderate: exercise 1-3 times/week": 1.455,
	"Active: daily exercise": 1.55,
	"Very Active: daily exercise and physical job": 1.725,
};

const genders = ["male", "female"];

const intakeValues = [
	{ title: "Maintain weight", subtitle: "", procent: 1 },
	{ title: "Mild weight loss", subtitle: "0.25 kg/week", procent: 0.92 },
	{ title: "Weight loss", subtitle: "0.5 kg/week", procent: 0.84 },
	{ title: "Extreme weight loss", subtitle: "1 kg/week", procent: 0.68 },
	{ title: "Mild weight gain", subtitle: "0.25 kg/week", procent: 1.08 },
	{ title: "Weight gain", subtitle: "0.5 kg/week", procent: 1.16 },
	{ title: "Fast Weight gain", subtitle: "1 kg/week", procent: 1.32 },
];

const calcutlatorSchema = yup.object().shape({
	age: yup
		.number()
		.required("required to be between 15 and 18 years")
		.min(15)
		.max(80),
	gender: yup.string().required("required").oneOf(genders),
	height: yup.number().required("required to be gratet then 0").min(0.01),
	weight: yup.number().required("required to be gratet then 0").min(0.01),
	activity: yup.string().required("required").oneOf(Object.keys(activity)),
});

const initialValuesCalculatorSchema = {
	age: 25,
	gender: "male",
	height: "175",
	weight: "65",
	activity: "BMR",
};

const Calculator = () => {
	const [message, setMessage] = useState("");
	const [inInch, setInInch] = useState(false);
	const [inPds, setInPds] = useState(false);
	const [submitted, setSubmitted] = useState({ show: false, BMR: 0 });

	const isNonMobile = useMediaQuery("(min-width:600px)");
	const { palette } = useTheme();

	const handleFormSubmit = async (
		{ age, gender, height, weight, activity: ac },
		onSubmitProps,
	) => {
		try {
			const result =
				10 * weight * (1 - 0.546408 * inPds) +
				6.25 * height * (1 - 0.606299 * inInch) -
				5 * age +
				(gender === "male" ? 5 : -161);
			ac === "BMR"
				? setSubmitted({ show: true, BMR: result })
				: setSubmitted({ show: true, total: result * activity[ac] });
		} catch (error) {
			console.log(error);
			setMessage("Something went wrong!");
		}
	};
	return (
		<Box>
			<Box
				width={isNonMobile ? "50%" : "93%"}
				p="2rem"
				m="2rem auto"
				borderRadius="1.5rem"
				bgcolor={palette.background.alt}>
				<Typography
					fontWeight="500"
					variant="h5"
					sx={{
						mb: "1.5rem",
						color: palette.secondary[300],
						fontWeight: "bold",
					}}>
					Just complete the inputs and find out your calorie in seconds!
				</Typography>
				<Box>
					<Formik
						onSubmit={handleFormSubmit}
						initialValues={initialValuesCalculatorSchema}
						validationSchema={calcutlatorSchema}>
						{({
							values,
							errors,
							touched,
							handleBlur,
							handleChange,
							handleSubmit,
							setFieldValue,
							resetForm,
						}) => (
							<form onSubmit={handleSubmit}>
								<Box
									display="flex"
									justifyContent="center"
									alignItems="start"
									flexDirection="column"
									gap="30px">
									<>
										<Box
											width="100%"
											display="flex"
											justifyContent="space-between"
											alignItems="center">
											<TextField
												label="Age"
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.age}
												name="age"
												error={Boolean(touched.age) && Boolean(errors.age)}
												helperText={touched.age && errors.age}
												sx={{ width: "50%" }}
												InputProps={{
													inputProps: {
														min: 15,
														step: 1,
														max: 80,
														type: "number",
													},
												}}
											/>
											<Typography
												color={palette.secondary[300]}
												fontWeight="bold"
												fontSize={17}>
												Ages 15-80
											</Typography>
										</Box>
										<Box
											width="100%"
											display="flex"
											justifyContent="space-between"
											alignItems="center">
											<TextField
												label="Height"
												type="number"
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.height}
												name="height"
												InputProps={{
													inputProps: { min: 0, step: 1, type: "number" },
												}}
												error={
													Boolean(touched.height) && Boolean(errors.height)
												}
												helperText={touched.height && errors.height}
												sx={{ width: "50%" }}
											/>

											<FormControlLabel
												control={
													<CustomSwitch
														checked={inInch}
														onChange={() => setInInch((prev) => !prev)}
													/>
												}
												label={
													<Typography
														color={palette.secondary[300]}
														fontWeight="bold"
														fontSize={17}>
														{inInch ? "inch" : `  cm`}
													</Typography>
												}
											/>
										</Box>
										<Box
											width="100%"
											display="flex"
											justifyContent="space-between"
											alignItems="center">
											<TextField
												label="Weight"
												type="number"
												onBlur={handleBlur}
												onChange={handleChange}
												value={values.weight}
												name="weight"
												InputProps={{
													inputProps: { min: 0, step: 1, type: "number" },
												}}
												error={
													Boolean(touched.weight) && Boolean(errors.weight)
												}
												helperText={touched.weight && errors.weight}
												sx={{ width: "50%" }}
											/>

											<FormControlLabel
												control={
													<CustomSwitch
														checked={inPds}
														onChange={() => setInPds((prev) => !prev)}
													/>
												}
												label={
													<Typography
														color={palette.secondary[300]}
														fontWeight="bold"
														fontSize={17}>
														{inPds ? "pds" : "  kg"}
													</Typography>
												}
											/>
										</Box>
									</>
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center">
										<FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
											<InputLabel>Activity</InputLabel>
											<Select
												onBlur={handleBlur}
												name="activity"
												onChange={handleChange}
												value={values.activity}
												error={
													Boolean(touched.activity) && Boolean(errors.activity)
												}
												helperText={touched.activity && errors.activity}>
												{Object.keys(activity).map((key, i) => (
													<MenuItem
														key={key}
														value={key}
														defaultValue={i === 0}>
														{key}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>
									<Box
										width="100%"
										display="flex"
										justifyContent="space-between"
										alignItems="center">
										<FormControl sx={{ width: { xs: "100%", md: "50%" } }}>
											<InputLabel>Birth Gender</InputLabel>
											<Select
												onBlur={handleBlur}
												name="gender"
												onChange={handleChange}
												value={values.gender}
												error={
													Boolean(touched.gender) && Boolean(errors.gender)
												}
												helperText={touched.gender && errors.gender}>
												{genders.map((gender) => (
													<MenuItem key={gender} value={gender}>
														{gender}
													</MenuItem>
												))}
											</Select>
										</FormControl>
									</Box>
								</Box>
								<Box>
									<Button
										fullWidth
										type="submit"
										sx={{
											m: "2rem 0",
											p: "1rem",
											backgroundColor: palette.background.default,
											color: palette.secondary[300],
											"&:hover": { color: palette.primary.main },
										}}>
										Calculate
									</Button>
								</Box>
							</form>
						)}
					</Formik>

					{message && (
						<Typography
							variant="h5"
							sx={{ mt: 5, color: palette.secondary[200] }}>
							{message}
						</Typography>
					)}
					{submitted?.show &&
						(submitted?.BMR !== undefined ? (
							<Box mt={2}>
								<Typography
									variant="h5"
									fontWeight="bold"
									sx={{
										color: palette.secondary[300],
										display: "inline",
										mr: 2,
									}}
									component="p">
									BMR:
								</Typography>
								<Typography
									variant="h5"
									sx={{ color: palette.secondary[200], display: "inline" }}
									component="p">
									{Math.ceil(submitted?.BMR).toLocaleString("en")} Calories/day
								</Typography>
							</Box>
						) : (
							<Box
								display="flex"
								alignItems="center"
								justifyContent="space-between"
								flexWrap="wrap"
								gap={4}
								mt={2}
								width="100%">
								{intakeValues.map(({ title, subtitle, procent }) => (
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										width={{ xs: "100%", lg: "40%" }}
										gap={1}>
										<Box>
											<Typography
												variant="h5"
												fontWeight="bold"
												sx={{
													color: palette.secondary[300],
													display: "inline",
													mr: 2,
												}}
												component="p">
												{title}
											</Typography>
											<Typography
												variant="h5"
												sx={{
													color: palette.secondary[100],
												}}
												component="p">
												{subtitle}
											</Typography>
										</Box>
										<Typography
											variant="h5"
											sx={{ color: palette.secondary[200] }}
											component="p">
											{Math.ceil(submitted?.total * procent).toLocaleString(
												"en",
											)}{" "}
											Calories/day
										</Typography>
									</Box>
								))}
							</Box>
						))}
				</Box>
			</Box>
		</Box>
	);
};
const CustomSwitch = styled(Switch)(({ theme }) => ({
	"& .MuiSwitch-switchBase.Mui-checked": {
		color: theme.palette.secondary[300],
		"&:hover": {
			backgroundColor: alpha(
				theme.palette.secondary[300],
				theme.palette.action.hoverOpacity,
			),
		},
	},
	"& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
		backgroundColor: theme.palette.secondary[300],
	},
}));

export default Calculator;
