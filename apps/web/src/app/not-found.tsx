import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4">
        <Activity className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">
        The requested digital twin page could not be located.
      </p>
      <Link
        href="/"
        className="mt-6 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
