import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
function LinkButton({ to, children, use }) {
    return (
        <Link
            to={to}
            className={`px-3 py-2 text-lg font-bold text-white rounded-lg border-2 border-transparent ${use === "close" ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"} transition-all duration-300`}
        >
            {children}
        </Link>
    )
}

export default LinkButton