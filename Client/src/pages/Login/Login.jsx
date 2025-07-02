import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../API/axiosConfig";
import classes from "./login.module.css";
import { appState } from "../../App";
import { BiHide, BiShow } from "react-icons/bi";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(appState);
  const [showSuccess, setShowSuccess] = useState(false);

  const [validation, setValidation] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const emailValue = emailRef.current.value.trim();
    const passwordValue = passwordRef.current.value;

    if (!emailValue || !passwordValue) {
      setValidation({
        email: !emailValue,
        password: !passwordValue,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/user/login", {
        email: emailValue,
        password: passwordValue,
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_name", response.data.user_name);
        setUser(response.data.user_name);
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.msg || "Invalid credentials");
      setIsLoading(false);
      console.log(error.response.data);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  function handleChange() {
    if (errorMessage) setErrorMessage("");
  }

  return (
    <>
      {showSuccess && (
        <div className={classes.showsuccess}>
           Welcome back, You’ve logged in successfully.
        </div>
      )}
      <div className={classes.loginCard}>
        <h1 className={classes.loginTitle}>Login to your account</h1>
        <p className={classes.loginSubText}>
          Don’t have an account?
          <Link to="/register" className={classes.link}>
            Create a new account
          </Link>
        </p>
        {errorMessage && <p className={classes.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} className={classes.signInForm}>
          <input
            ref={emailRef}
            type="email"
            placeholder="Enter your email"
            className={classes.inputField}
            onChange={handleChange}
            style={{
              border: validation.email ? "1px solid #ff4444" : "",
            }}
          />
          {validation.email && (
            <span className={classes.danger}>Please Enter Your Email</span>
          )}
          <div className={classes.passwordWrapper}>
            <input
              ref={passwordRef}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleChange();
              }}
              className={classes.inputField}
              style={{
                border: validation.password ? "1px solid #ff4444" : "",
              }}
            />

            <button
              type="button"
              className={classes.eyeIcon}
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <BiShow size={20} /> : <BiHide size={20} />}
            </button>
          </div>
          {validation.password && (
            <span className={classes.danger}>Please Enter Your Password</span>
          )}

          <button type="submit" className={classes.loginBtn}>
            {isLoading ? <ClipLoader size={12} color="white" /> : "Sign In"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
