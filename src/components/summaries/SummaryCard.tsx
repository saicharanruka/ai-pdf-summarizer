import { FileIcon, FileText, FileX2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Card } from "../ui/card";
import DeleteButton from "./DeleteButton";

// import StatusBadge from "./StatusBadge";

// type SummaryType = {
// 	id: string;
// 	title: string;
// 	created_at: string;
// 	summary_text: string;
// };
function formatTimeAgo(dateString: string): string {
	const pastDate = new Date(dateString);
	const now = new Date();

	// Calculate the difference in milliseconds
	const diffMilliseconds = now.getTime() - pastDate.getTime();

	// Convert milliseconds to minutes, hours, and days
	const minutes = Math.floor(diffMilliseconds / (1000 * 60));
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30); // Approximate months
	const years = Math.floor(days / 365); // Approximate years

	if (minutes < 60) {
		if (minutes <= 1) {
			return "just now";
		}
		return `${minutes} mins ago`;
	} else if (hours < 24) {
		if (hours === 1) {
			return "1 hour ago";
		}
		return `${hours} hours ago`;
	} else if (days < 30) {
		// Less than a month
		if (days === 1) {
			return "1 day ago";
		}
		return `${days} days ago`;
	} else if (months < 12) {
		// Less than a year
		if (months === 1) {
			return "1 month ago";
		}
		return `${months} months ago`;
	} else {
		if (years === 1) {
			return "1 year ago";
		}
		return `${years} years ago`;
	}
}

const SummaryCardHeader = ({
	title,
	createdAt,
}: {
	title: string;
	createdAt: string;
}) => {
	return (
		<div className="flex items-start gap-4">
			<FileText className="w-6 h-6 sm:w-8 sm:h-8 text-rose-400" />
			<div className="flex-1 min-w-0">
				<h3 className="text-base xl:text-lg font-semibold text-gray-900 truncate w-5/6  ">
					{title}
				</h3>
				<p className="text-sm text-gray-500">{formatTimeAgo(createdAt)}</p>
			</div>
		</div>
	);
};

const StatusBadge = ({ status }: { status: string }) => {
	return (
		<span
			className={cn(
				"px-3 py-1 text-xs font-medium rounded-full capitalize",
				status === "completed"
					? "bg-green-100 text-green-800"
					: "bg-yellow-100 text-yellow-800"
			)}
		>
			{status}
		</span>
	);
};

const SummaryCard = ({ summary }: { summary: any }) => {
	return (
		<div>
			<Card className="h-full relative">
				<div className="flex w-full px-3">
					<SummaryCardHeader
						title={summary.title}
						createdAt={summary.created_at}
					/>
					<div className="absolute top-2 right-2">
						<DeleteButton summaryId={summary.id} />
					</div>
				</div>

				<Link href={`summaries/${summary.id}`} className="block p-2 pl-3">
					<p className="text-gray-600 line-clamp-2 text-sm ">
						{summary.summary_text}
					</p>
					<div className="flex justify-between items-center mt-2">
						<StatusBadge status={summary.status} />
					</div>
				</Link>
			</Card>
		</div>
	);
};

export default SummaryCard;
