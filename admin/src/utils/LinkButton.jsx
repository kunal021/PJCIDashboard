import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function LinkButton({ to, children, use }) {
  return (
    <Link
      to={to}
      className={`text-black font-semibold py-2 px-4 rounded-md ${
        use === "close"
          ? "bg-red-50 hover:bg-red-100 border border-red-200"
          : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
      } `}
    >
      {children}
    </Link>
  );
}

export default LinkButton;
