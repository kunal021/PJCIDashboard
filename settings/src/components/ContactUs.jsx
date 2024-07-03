function ContactUs() {
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
        style={{
          whiteSpace: "pre-wrap",
          padding: "20px",
          fontSize: "3rem",
          fontWeight: "bold",
        }}
      >
        Contact Us
      </div>
      <div
        style={{ whiteSpace: "pre-wrap", padding: "20px", fontSize: "1.5rem" }}
      >
        <p>
          Mobile Number:{" "}
          <span style={{ fontWeight: "bold" }}>+91 9714310310</span>
        </p>
        <p>
          Email:{" "}
          <span style={{ fontWeight: "bold" }}>
            pankajjoshicareerinstitute@gmail.com
          </span>
        </p>
        <p>
          Address:{" "}
          <span style={{ fontWeight: "bold" }}>
            12, First Floor, The Capital Building, Top-Three Circle, Bhavnagar
            364002.
          </span>
        </p>
      </div>
    </div>
  );
}

export default ContactUs;
