import { Link } from "react-router-dom"

// eslint-disable-next-line react/prop-types
function LinkButton({ to, children, use }) {
    return (
        <Link
            to={to}
            className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${use === "close" ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"} `}
        >
            {children}
        </Link>
    )
}

export default LinkButton