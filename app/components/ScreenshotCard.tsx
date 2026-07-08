type Screenshot = {
    id: string;
    file_url: string;
    file_name: string;
    created_at: string;
    extracted_text?: string | null;
    category?: string | null;
    tags?: string[] | null;
    description?: string | null;
    status?: string | null;
  };
  
  type Props = {
    screenshot: Screenshot;
  };
  
  const categoryColors: Record<string, string> = {
    recipe: "bg-orange-100 text-orange-700",
    fashion: "bg-pink-100 text-pink-700",
    travel: "bg-blue-100 text-blue-700",
    shopping: "bg-green-100 text-green-700",
    quote: "bg-purple-100 text-purple-700",
    receipt: "bg-yellow-100 text-yellow-700",
    document: "bg-indigo-100 text-indigo-700",
    other: "bg-gray-100 text-gray-700",
  };
  
  export default function ScreenshotCard({ screenshot }: Props) {
    const color =
      categoryColors[screenshot.category ?? "other"] ||
      categoryColors["other"];
  
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <img
          src={screenshot.file_url}
          alt={screenshot.file_name}
          className="h-56 w-full object-cover"
        />
  
        <div className="space-y-3 p-4">
          {screenshot.status === "failed" ? (
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
              Failed
            </span>
          ) : (
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${color}`}>
              {screenshot.category ?? "Processing"}
            </span>
          )}
  
          <div className="flex flex-wrap gap-2">
            {screenshot.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
  
            {screenshot.tags && screenshot.tags.length > 3 && (
              <span className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-600">
                +{screenshot.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }