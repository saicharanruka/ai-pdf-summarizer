import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { FileText } from "lucide-react";
import NavLink from "./NavLink";

export default function Header() {
	return (
		<nav className="container mx-auto flex items-center justify-between px-2 py-4 lg:px-8">
			<div className="">
				<NavLink href="/" className="shink-0 flex items-center gap-1 lg:gap-2">
					<FileText className="h-5 w-5 transform text-gray-900 transition hover:rotate-12 lg:h-8 lg:w-8" />
					<span className="font-extrabold lg:text-xl text-gray-900">
						PDF Summarizer
					</span>
				</NavLink>
			</div>
			<div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
				<SignedIn>
					<NavLink href="/dashboard">Your Summaries</NavLink>
				</SignedIn>
				<SignedOut>
					<NavLink href="/#pricing">Pricing</NavLink>
				</SignedOut>
			</div>

			<div className="flex lg:justify-end">
				<SignedIn>
					<div className="flex gap-2 items-center">
						<NavLink href="/upload">Upload a PDF</NavLink>
						<div>Pro</div>
						<UserButton />
					</div>
				</SignedIn>
				<div>
					<SignedOut>
						<NavLink href="sign-in">Sign In</NavLink>
					</SignedOut>
				</div>
			</div>
		</nav>
	);
}
