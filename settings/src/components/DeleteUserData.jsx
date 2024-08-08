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
        <p style={{ fontWeight: "bold", fontSize: "2rem" }}>
          Pankaj Joshi Career Institute
        </p>
        <p>Account Deletion Request Instructions</p>
        <p>
          To request the deletion of your account and personal data, please
          follow these steps:
        </p>
        <ol>
          <li>
            Send an Email:
            <ul>
              <li>
                Email Address:{" "}
                <span style={{ fontWeight: "bold" }}>
                  pankajjoshicareerinstitute@gmail.com
                </span>
              </li>
              <li>Subject: Account Deletion Request</li>
            </ul>
          </li>
          <li>
            Include the Following Information in Your Email:
            <ul>
              <li>Full Name: [Your Full Name]</li>
              <li>Mobile Number: [Your Mobile Number]</li>
              <li>
                Request: Clearly state that you would like to request the
                deletion of your account and all associated personal data.
              </li>
            </ul>
          </li>
          <li>
            Data Retention Notice:
            <ul>
              <li>
                Please be aware that while we will delete your account and
                personal data, we will retain your payment history for
                accounting purposes. This data is necessary for compliance with
                financial regulations and for auditing purposes.
              </li>
            </ul>
          </li>
          <li>
            Confirmation:
            <ul>
              <li>
                Once we receive your request, we will process it promptly and
                send you a confirmation email to acknowledge the deletion
                request. If we require any additional information, we will
                contact you via the email address provided.
              </li>
            </ul>
          </li>
          <li>
            Processing Time:
            <ul>
              <li>
                Please allow 14 business days for us to process your request. If
                you have any questions or need further assistance, do not
                hesitate to contact us at the same email address
              </li>
            </ul>
          </li>
        </ol>
        <p>Thank you for your cooperation.</p>
        <Link to={"/contact-us"}>Contact Us</Link>
      </div>
    </div>
  );
}

export default DeleteUserData;
