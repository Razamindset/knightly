import Link from "next/link"

export default function NotFound() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-4">Game Not Found</h1>
      <p className="text-gray-400 mb-8">The game you're looking for could not be found or is not available.</p>
      <Link href="/" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">
        Return Home
      </Link>
    </div>
  )
}
