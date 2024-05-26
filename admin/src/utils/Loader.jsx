import { Loader2 } from "lucide-react"

function Loader() {
    return <>
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
        <p className="mt-2 text-sm text-slate-400">
            Loading
        </p>
    </>;
}

export default Loader;
