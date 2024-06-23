import { Loader2 } from "lucide-react";

function Loader() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      <p className="mt-2 text-sm text-slate-400">Loading</p>
    </div>
  );
}

export default Loader;
