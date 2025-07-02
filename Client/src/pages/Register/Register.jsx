import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./register.module.css";
import axios from "../../API/axiosConfig";

function Register() {
  const usernameDom = useRef();
  const firstnameDom = useRef();
  const lastnameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [validation, setValidation] = useState({
    email: false,
    firstName: false,
    lastName: false,
    userName: false,
    password: false,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const usernameValue = usernameDom.current.value.trim();
    const firstnameValue = firstnameDom.current.value.trim();
    const lastnameValue = lastnameDom.current.value.trim();
    const emailValue = emailDom.current.value.trim();
    const passwordValue = passwordDom.current.value;

    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      setValidation({
        email: !emailValue,
        firstName: !usernameValue,
        lastName: !lastnameValue,
        userName: !usernameValue,
        password: !passwordValue,
      });
      return;
    }

    try {
      await axios.post("/user/register", {
        user_name: usernameValue,
        first_name: firstnameValue,
        last_name: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });
      setShowSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
       setErrorMessage(
        error?.response?.data?.msg || "Invalid credentials"
      );
    }
  }

  return (
    <>
      {showSuccess && (
        <div className={styles.showsuccess}>
          Your account has been successfully registered! You will be redirected
          to the login page shortly.
        </div>
      )}
      <div className={styles.registerCard}>
        <h2>Join the network</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <form onSubmit={handleSubmit}>
          <input
            ref={emailDom}
            type="email"
            placeholder="Email"
            style={{
              border: validation.email ? "1px solid #ff4444" : "",
            }}
          />
          {validation.firstName && (
            <span className={styles.danger}>Please Enter Your First Name</span>
          )}

          <div className={styles.container_name}>
            <div className={styles.container_name_each}>
              <input
                ref={firstnameDom}
                type="text"
                name="first_name"
                id="firstname"
                placeholder="First Name"
                style={{
                  border: validation.firstName ? "1px solid #ff4444" : "",
                }}
              />
              {validation.firstName && (
                <span className={styles.danger}>
                  Please Enter Your First Name
                </span>
              )}
            </div>
            <div className={styles.container_name_each}>
              <input
                ref={lastnameDom}
                type="text"
                name="last_name"
                id="lastname"
                placeholder="Last Name"
                style={{
                  border: validation.lastName ? "1px solid #ff4444" : "",
                }}
              />
              {validation.lastName && (
                <span className={styles.danger}>
                  Please Enter Your Last Name
                </span>
              )}
            </div>
          </div>

          <input
            ref={usernameDom}
            type="text"
            placeholder="Username"
            style={{
              border: validation.userName ? "1px solid #ff4444" : "",
            }}
          />
          {validation.userName && (
            <span className={styles.danger}>Please Enter Your User Name</span>
          )}

          <input
            ref={passwordDom}
            type="password"
            placeholder="Password"
            style={{
              border: validation.password ? "1px solid #ff4444" : "",
            }}
          />
          {validation.password && (
            <span className={styles.danger}>Please Enter Your Password</span>
          )}
          <button type="submit">Agree and Join</button>
        </form>
        <div>
          I agree to <Link>privacy policy</Link> and{" "}
          <Link>terms of service</Link>
        </div>
        <Link to="/login" className={styles.toggleLogin}>
          Already have an account? Login
        </Link>
      </div>
    </>
  );
}

export default Register;
