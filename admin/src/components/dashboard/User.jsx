import { NavLink } from "react-router-dom";

function User() {
    return (
        <div>
            <div>
                <NavLink to="/get-users">All Users</NavLink>
            </div>
            {/* <div>
                <NavLink to="/get-full-course">Full User</NavLink>
            </div> */}
        </div>
    );
}

export default User;
