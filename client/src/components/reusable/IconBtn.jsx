import { Badge, IconButton } from "@mui/material";

const IconBtn = ({ badgeContent, icon, onClick, stopPropagation = "true" }) => {
	return (
		<IconButton
			size="large"
			color="inherit"
			onClick={(e) => {
				if (stopPropagation === "true") {
					e.stopPropagation();
				}
				onClick();
			}}>
			<Badge badgeContent={badgeContent} color="error">
				{icon}
			</Badge>
		</IconButton>
	);
};

export default IconBtn;
