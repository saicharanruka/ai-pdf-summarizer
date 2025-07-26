"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { deleteSummaryAction } from "~/actions/summary-actions";
import { Button } from "../ui/button";

export default function DeleteButton({ summaryId }: { summaryId: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDelete = async () => {
		startTransition(async () => {
			const res = await deleteSummaryAction({ summaryId });
			if (!res.success) {
				toast.error("Error deleting the summary");
			}

			setIsOpen(false);
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="bg-gray-50 border border-gray-200 hover:text-rose-600 hover:bg-rose-200 transition-colors"
				>
					<Trash2 className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Deleter Summary</DialogTitle>
					<DialogDescription>
						Are you sure you want to delete this summary ? This action cannot be
						undone.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button
						variant="ghost"
						className="bg-gray-50 border border-gray-200 hover:text-gray-600 hover:bg-gray-50"
						onClick={() => {
							setIsOpen(false);
						}}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						className="bg-gray-900 border border-gray-800 hover:text-gray-800 hover:bg-gray-50"
						onClick={handleDelete}
					>
						{isPending ? "Deleting..." : "Delete"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
