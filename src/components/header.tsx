import Link from "next/link";

export function Header() {
	return (
		<header className="bg-background sticky top-0 w-full border-b">
			<div className="max-w-md mx-auto w-full px-8">
				<Link href="/" className="flex items-center h-16">
					<h1 className="font-bold text-2xl underline underline-offset-6 bg-background w-full">
						Cheat list
					</h1>
				</Link>
			</div>
		</header>
	);
}
