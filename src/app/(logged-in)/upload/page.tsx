import { Badge } from "~/components/ui/badge";
import UploadForm from "~/components/upload/UploadForm";

function UploadPage() {
	return (
		<section className="min-h-screen">
			<div className="mx-auto max-w-7xl px-6 py-24 ms:py-32 lg:px-8">
				<div className="flex flex-col justify-center items-center text-center gap-3">
					<Badge variant="secondary">AI-Powered Content Creation</Badge>
					<h1 className="text-5xl">Start Uploading Your PDFs</h1>
					<p className="text-base">
						Upload your PDF and let our AI do the magic!
					</p>
					<UploadForm />
				</div>
			</div>
		</section>
	);
}

export default UploadPage;
