import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:7777"; // change this as needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log("Login success:", res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">Login</h2>

          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Email</span>
            </div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          <label className="form-control w-full max-w-xs my-2">
            <div className="label">
              <span className="label-text">Password</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full max-w-xs"
            />
          </label>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="card-actions justify-center mt-2">
            <button className="btn btn-primary w-full" onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
