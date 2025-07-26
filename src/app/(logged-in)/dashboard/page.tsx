import { currentUser } from "@clerk/nextjs/server";
import { Plus, SquareArrowOutUpRight } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";
import Link from "next/link";
import SummaryCard from "~/components/summaries/SummaryCard";
import { Button } from "~/components/ui/button";
import { getSummaries } from "~/lib/summaries";

const DashboardPage = async () => {
	const uploadsLimit = 5;
	const user = await currentUser();
	if (!user?.id) return redirect("/sign-in");
	const userId = user.id;

	const summaries = await getSummaries(userId);

	return (
		<main className="min-h-screen">
			<div className="container mx-auto flex flex-col max-w-6xl ">
				<div className="px-2 pt-12 pb-3 flex justify-between items-center  ">
					<div className="flex flex-col justify-start">
						<h1 className="text-4xl font-semibold tracking-wide">
							Your Summaries
						</h1>
						<p>Transofrm your PDFs into concise, actionable insights</p>
					</div>

					<div>
						<Button
							asChild
							className="hover:scale-105 transition duration-200 text-white"
						>
							<Link href="/upload">
								{" "}
								<Plus className="w-5 h-5 mr-1" />
								New Summary
							</Link>
						</Button>
					</div>
				</div>
				<div className="mb-6">
					<div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-rose-800">
						<p className="text-sm">
							You've reached the limit of {uploadsLimit} uploads on the Basic
							plan.{" "}
							<Link
								href="/#pricing"
								className="hover:underline underline-offset-2 transition"
							>
								Click here to upgrade to Pro{" "}
								<SquareArrowOutUpRight className="w-3 h-3 inline-block" />
							</Link>{" "}
							for unlimited uploads.
						</p>
					</div>
				</div>
				{summaries.length === 0 ? (
					<div>No summaries found.</div>
				) : (
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{summaries.map((summary) => (
							<SummaryCard key={summary.id} summary={summary} />
						))}
					</div>
				)}
			</div>
		</main>
	);
};

export default DashboardPage;
