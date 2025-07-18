import type { Route } from "./+types/$";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Page Not Found" },
    { name: "description", content: "The requested page could not be found." },
  ];
}

export default function CatchAllRoute({ params }: Route.ComponentProps) {
  // Handle Chrome DevTools requests silently
  if (params["*"]?.includes(".well-known/appspecific/com.chrome.devtools")) {
    return new Response("Not Found", { status: 404 });
  }

  // Handle other 404s with a proper UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div>
          <h1 className="text-6xl font-bold text-gray-300">404</h1>
          <h2 className="mt-4 text-2xl font-semibold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <div className="space-y-3">
          <a
            href="/operations"
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Operations Dashboard
          </a>
          <a
            href="/"
            className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Go to Home
          </a>
        </div>
      </div>
    </div>
  );
}
