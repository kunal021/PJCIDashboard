import { Link } from "react-router-dom";

function DeleteUserData() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ whiteSpace: "pre-wrap", padding: "20px", fontSize: "1.5rem" }}
      >
        <p>
          To delete your data please send a mail on{" "}
          <span style={{ fontWeight: "bold" }}>
            pankajjoshicareerinstitute@gmail.com
          </span>{" "}
          requesting to delete all your data.
        </p>
        <p>
          All your data will be deleted within 30 days except transaction
          details.
        </p>
        <p>Transaction details is used for TAX purposes only.</p>
        <Link to={"/contact-us"}>Contact Us</Link>
      </div>
    </div>
  );
}

export default DeleteUserData;
