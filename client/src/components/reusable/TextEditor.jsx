import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { useEffect } from "react";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material";

const TextEditor = ({ setValue, value = "" }) => {
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
			});
		}
	}, [quill, quillRef, setValue, value]);

	return (
		<Box
			sx={{
				width: { xs: 250, sm: 500, md: 600 },
				height: { xs: 350, sm: 400 },
			}}>
			<div
				style={{
					width: "100%",
					height: "100%",
					color: theme.palette.secondary[300],
				}}>
				<div ref={quillRef} />
			</div>
		</Box>
	);
};

export default TextEditor;
