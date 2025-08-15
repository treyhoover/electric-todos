import { Link } from "@tanstack/react-router";

export function NotFound() {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50">
			<div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
				<div className="mb-4 font-bold text-6xl text-gray-300">404</div>
				<h1 className="mb-4 font-bold text-2xl text-gray-800">
					Page Not Found
				</h1>
				<p className="mb-8 text-gray-600">
					The page you're looking for doesn't exist or has been moved.
				</p>

				<div className="space-y-4">
					<Link to="/" className="block w-full">
						<button
							type="button"
							className="w-full rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
						>
							Go Home
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
