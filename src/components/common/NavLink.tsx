"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface LinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
}

const NavLink: React.FC<LinkProps> = ({ href, children, className }) => {
	const pathname = usePathname();
	const isActive =
		pathname === href || (pathname.startsWith(href) && href !== "/");

	return (
		<Link
			className={cn(
				"transition-colors text-sm duration-200 text-gray-600 hover:text-rose-500",
				className,
				isActive && "text-rose-500"
			)}
			href={href}
		>
			{children}
		</Link>
	);
};

export default NavLink;
