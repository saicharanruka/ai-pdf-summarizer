import { notFound } from "next/navigation";
import SourceInfo from "~/components/summaries/SourceInfo";
import SummaryHeader from "~/components/summaries/SummaryHeader";
import { getSummaryById } from "~/lib/summaries";

export default async function SummaryPage(props: {
	params: Promise<{ id: string }>;
}) {
	const params = await props.params;
	const summaryId = params.id;

	const summary = await getSummaryById(summaryId);
	if (!summary) return notFound();

	const { title, summary_text, file_name, word_count } = summary;

	return (
		<div className="relative isolate min-h-screen bg-linear-tob from-rose-50/40 to-white">
			<div className="container mx-auto flex flex-col max-w-6xl ">
				<div className="px-2 pt-12 pb-3 flex justify-between items-center">
					<div className="flex flex-col">
						<SummaryHeader title={title} />
						{file_name && <SourceInfo fileName={file_name} />}
						<div className="relative mt-4">{word_count} words</div>
					</div>
				</div>
			</div>
		</div>
	);
}
