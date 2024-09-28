import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import {  useNavigate } from "react-router-dom";

function SignIn() {
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
          {" "}
          Welcome to Rapid Courses
        </Typography>
        <Card variant="outlined" style={{ width: 400, padding: 40 }}>
          <TextField
            fullWidth={true}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            id="outlined-basic"
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
            id="outlined-basic"
            label="Password"
            variant="outlined"
          />
          <br />
          <br />
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const sta = await fetch("http://localhost:3000/admin/login", {
                  method: "POST",
                  body: JSON.stringify({
                    username: email, // Assuming email is a state or variable
                    password: password, // Assuming password is a state or variable
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                const data = await sta.json(); // Await the JSON response

                if (sta.ok) {
                  localStorage.setItem("token", data.token); // Store the token in localStorage
                  console.log(data); // Log the response data
                  console.log(sta); // Log the fetch response

                  // Navigate to '/addCourse' after successful login
                  // navigate("/addCourses");
                  window.location='/addCourses';
                } else {
                  console.log("Login failed", data);
                }
              } catch (error) {
                console.log("An error occurred during login:", error); // Better error handling message
              }
            }}
          >
            SignIn
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default SignIn;
