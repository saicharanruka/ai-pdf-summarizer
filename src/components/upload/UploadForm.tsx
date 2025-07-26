"use client";

//  TODO : use server side validation for file upload

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
	generatePdfSummary,
	storePdfSummaryAction,
} from "~/actions/upload-actions";
import { useUploadThing } from "~/utils/uploadthing";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const schema = z.object({
	file: z
		.instanceof(File, { error: "Inavlid file" })
		.refine(
			(file) => file.size <= 20 * 1024 * 1024,
			"File size must be less than 20mb"
		)
		.refine(
			(file) => file.type.startsWith("application/pdf"),
			"File must be a PDF"
		),
});

const UploadForm = () => {
	const formRef = useRef<HTMLFormElement>(null);
	const [isLoading, setisLoading] = useState(false);
	const router = useRouter();

	const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
		onClientUploadComplete: () => {
			console.log("uploaded successfully!");
		},
		onUploadError: (err) => {
			console.error("error occurred while uploading", err);
			toast.error(err.message);
		},
		onUploadBegin: ({ file }) => {
			console.log("upload has begun for", file);
		},
	});

	const handleSumit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			setisLoading(true);

			const formData = new FormData(e.currentTarget);
			const file = formData.get("file") as File;

			// validate the form data
			const result = schema.safeParse({ file });
			if (!result.success) {
				const errorMessage = z.treeifyError(result.error).properties?.file
					?.errors[0];
				toast.error(errorMessage);
				return;
			}

			toast.info(" 📦 Processing PDF", {
				description: "Hang tight! Our AI is reading through your document",
			});

			const response = await startUpload([file]);
			if (!response) {
				toast.error("Something went wrong", {
					description: "Please use a different file",
				});

				return;
			}

			toast.info("📨 Uploading PDF", {
				description: "We are uploading your PDF",
			});

			// parsing pdf using lang chain
			const summary = await generatePdfSummary(response);
			const { data = null, message = null } = summary || {};

			let storeResult: any;

			if (data) {
				toast.info("🗃️ Saving PDF...", {
					description: "Hang tight! We are saving your PDF ✨",
				});
			}
			if (data?.summary) {
				storeResult = await storePdfSummaryAction({
					summary: data.summary,
					title: data.title,
					fileName: file.name,
					fileUrl: response[0]?.serverData.file.ufsUrl,
				});

				toast.success("✅ Summary Generated!", {
					description: "Your PDF has been saved and summarized successfully",
				});
				formRef.current?.reset();
				console.log("Store Result", storeResult);
				router.push(`/summaries/${storeResult.data.id}`);
			}
		} catch (error) {
			console.error(error);
			formRef.current?.reset();
		} finally {
			setisLoading(false);
		}
	};

	return (
		<form
			className="flex flex-col gap-6 max-w-4xl w-full"
			onSubmit={handleSumit}
			ref={formRef}
		>
			<div
				className={`flex justify-end items-center gap-2 ${
					isLoading && "cursor-not-allowed opacity-50"
				}`}
			>
				<Input
					id="file"
					name="file"
					accept="application/pdf"
					required
					type="file"
					disabled={isLoading}
					className=""
				/>

				<Button disabled={isLoading}>
					{isLoading ? (
						<div className="flex gap-1">
							<Loader2 className="animate-spin" />
							<span className="animate-pulse">Processing...</span>
						</div>
					) : (
						"Upload your PDF"
					)}
				</Button>
			</div>
		</form>
	);
};

export default UploadForm;
