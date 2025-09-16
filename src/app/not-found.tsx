import Link from "next/link";

export default function Forbidden() {
  return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-dark mb-4">
            404 Not Found
          </h1>
          <p className="text-text-secondary mb-6">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
}