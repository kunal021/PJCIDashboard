import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  // console.log(open);
  return (
    <nav className="top-0 flex justify-between items-center m-6">
      <div className="flex justify-between items-center w-full border-4 border-transparent rounded-full px-14 py-2 bg-blue-600/60 duration-1000">
        <ul>
          <li className="text-black text-lg font-semibold cursor-pointer">
            E-Academy
          </li>
        </ul>
        <ul>
          <li
            className="flex gap-2 text-black text-lg font-semibold cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <p>Admin</p>
            <p className="text-xl">{open ? "-" : "+"}</p>
          </li>
        </ul>
        {open && (
          <div className="absolute mt-40 ml-[82%] flex flex-col items-center font-medium border-4 border-transparent rounded-3xl px-4 py-2 bg-blue-600/60 transition-all duration-1000">
            <p className="text-black p-2 cursor-pointer">Change Password</p>
            <p className="text-black p-2 cursor-pointer">Log Out</p>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
