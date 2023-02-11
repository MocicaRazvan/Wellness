import { Badge, IconButton } from "@mui/material";

const IconBtn = ({ badgeContent, icon, onClick }) => {
	return (
		<IconButton
			size="large"
			color="inherit"
			onClick={(e) => {
				e.stopPropagation();
				onClick();
			}}>
			<Badge badgeContent={badgeContent} color="error">
				{icon}
			</Badge>
		</IconButton>
	);
};

export default IconBtn;
