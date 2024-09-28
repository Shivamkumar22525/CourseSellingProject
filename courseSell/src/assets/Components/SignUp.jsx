import React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        width: "100wh",
        height: "100vh",
        backgroundColor: "#eeeeee",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Typography style={{ display: "flex", justifyContent: "center" }}>
          Welcome to Rapid Courses
        </Typography>
        <Card variant="outlined" style={{ width: 400, padding: 40 }}>
          <TextField
            fullWidth={true}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id="username"
            label="Email"
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            fullWidth={true}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            id="password"
            label="Password"
            variant="outlined"
            type="password"
          />
          <br />
          <br />
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const res = await fetch("http://localhost:3000/admin/signup", {
                  method: "POST",
                  body: JSON.stringify({
                    username: email,
                    password: password,
                  }),
                  headers: {
                    "Content-type": "application/json",
                  },
                });

                const data = await res.json();

                if (res.ok) {
                  localStorage.setItem("token", data.token);
                  console.log(data);
                  navigate("/Signin");
                } else {
                  // Handle errors returned from the server
                  console.error(
                    "Sign-up failed:",
                    data.message || "Unknown error"
                  );
                }
              } catch (error) {
                console.error("An error occurred:", error);
              }
            }}
          >
            Signup
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default SignUp;
