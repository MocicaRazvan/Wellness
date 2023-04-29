import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { Box } from "@mui/system";
import { FormHelperText, useTheme } from "@mui/material";

const TextEditor = ({
	setValue,
	value = "",
	error = false,
	text = "",
	setError = () => {},
}) => {
	const modules = {
		toolbar: [["bold", "italic", "underline", "strike"]],
	};
	const { quill, quillRef } = useQuill({ modules });
	const theme = useTheme();

	useEffect(() => {
		if (quill) {
			quill.clipboard.dangerouslyPasteHTML(value);
			quill.on("text-change", () => {
				setValue(quillRef.current.firstChild.innerHTML);
				if (error) {
					setError(false);
				}
			});
		}
	}, [error, quill, quillRef, setError, setValue, value]);

	return (
		<Box
			sx={{
				width: { xs: 250, sm: 500, md: 600 },
				height: { xs: 350, sm: 400 },
				"& .ql-toolbar.ql-snow, .ql-container.ql-snow ": {
					border: `1px solid ${
						error
							? theme.palette.error.main
							: theme.palette.primary[
									theme.palette.mode === "dark" ? "light" : "dark"
							  ]
					} `,
				},
			}}>
			<div
				style={{
					width: "100%",
					height: "100%",
					color: theme.palette.secondary[300],
				}}>
				<div ref={quillRef} />
			</div>
			{error && (
				<FormHelperText
					sx={{ mt: 5.5, ml: 2, color: theme.palette.error.main }}>
					{text}
				</FormHelperText>
			)}
		</Box>
	);
};

export default TextEditor;
