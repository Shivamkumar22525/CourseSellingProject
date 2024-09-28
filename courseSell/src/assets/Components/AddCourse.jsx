import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

function AddCourse() {
  const [title, setTitle] = React.useState();
  const [description, setDescription] = React.useState();
  const [courses, setCourses] = React.useState([]);

  useEffect(() => {
    
    const display = async () => {
      await fetch("http://localhost:3000/admin/courses", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },        
      }).then((res) => {
        res.json().then((data) => {
          // console.log(data);
          setCourses(data.course);
          console.log(data);
        });
      });
    };
    display();
    
  },[courses]);

  
  return (
    <div
      style={{ width: "100wh", height: "100vh", backgroundColor: "#eeeeee" }}
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
          You can add courses here
        </Typography>

        <Card
          variant="outlined"
          style={{ marginLeft: 480, width: 400, padding: 40 }}
        >
          <TextField
            fullWidth={true}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            id="outlined-basic"
            label="Title"
            variant="outlined"
          />

          <br />
          <br />

          <TextField
            fullWidth={true}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            id="outlined-basic"
            label="Description"
            variant="outlined"
          />

          <br />
          <br />

          <Button
            variant="contained"
            onClick={() => {
              fetch("http://localhost:3000/admin/course", {
                method: "POST",
                body: JSON.stringify({
                  title: title,
                  description: description,
                  imageLink: "",
                  published: true,
                }),
                headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + localStorage.getItem("token"),
                },
              }).then((res) => {
                res.json().then((data) => {
                  // localStorage.setItem("token", data.token);
                  console.log(data);
                });
              });
            }}
          >
            Add
          </Button>
        </Card>
      </div>

      {/* <div>
        {course.map(item=>{
          return <div key={item.id}>
            {item.title}
            {item.description}
            {item.imageLink}
            {item.published}
          </div>
        })}
      </div> */}
      {/* <div>
        <Typography variant="h5">Courses List:</Typography>
        {courses.length > 0 ? (
          courses.map((item) => (
            <div key={item._id}>
              <Card
                variant="outlined"
                style={{ margin: 10, padding: 10, backgroundColor: "#f9f9f9" }}
              >
                <Typography variant="h6">{item.title}</Typography>
                <Typography>{item.description}</Typography>
                {item.imageLink && (
                  <img
                    src={item.imageLink}
                    alt={item.title}
                    style={{ width: "100px", height: "100px" }}
                  />
                )}
                <Typography>
                  {item.published ? "Published" : "Not Published"}
                </Typography>
              </Card>
            </div>
          ))
        ) : (
          <Typography>No courses found</Typography>
        )}
      </div> */}
      <div>
      <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {courses.map((item, index) => (
          <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
            <Item>{item.title}</Item>
            <Item>{item.description}</Item>            

          </Grid>
        ))}
      </Grid>
    </Box>
      </div>
    </div>
  );
}
export default AddCourse;
