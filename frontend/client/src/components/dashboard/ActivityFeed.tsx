import { Clock } from "lucide-react";

interface Props {
  logs: { message: string; createdAt?: string }[];
}

export default function ActivityFeed({ logs }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 border shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <h3 className="font-semibold text-gray-800">
          Recent Activity
        </h3>
      </div>

      {logs?.length ? (
        <ul className="space-y-4">
          {logs.slice(0, 6).map((log, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="mt-1 h-2 w-2 rounded-full bg-gray-400" />

              <div>
                <p className="text-gray-700">
                  {log.message}
                </p>

              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          No recent activity
        </p>
      )}
    </div>
  );
}
