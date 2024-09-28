import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography, Button } from "@mui/material";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";

function Course() {
  let { courseId } = useParams();
  // console.log(courseId);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("http://localhost:3000/admin/courses/", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }).then((res) => {
          res.json().then((data) => {
            setCourses(data.course);
          });
        });
        // const data = await res.json();
        // setCourses(data.course); // Make sure the data structure is correct
        // Set loading to false once data is loaded
      } catch (err) {
        console.log("kuch nhi aa rha !!!!");
      }
    };

    fetchCourses();
  }, []);

  // Find the course by ID
  const res1 = courses.find((course) => course._id === courseId);
  console.log(res1)
  if (!res1) {
    return <div>Course not found or may not exist...</div>; // Show this if the course isn't found
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Centers horizontally
              alignItems: "center", // Centers vertically
              flexDirection: "column", // Stacks the divs vertically (optional if you want them in a column)
            }}
          >
            <div>{res1.title}</div>
            <div>{res1.description}</div>
          </div>
        </Grid>
      </Box>

      <UpdateCourse courses={courses} course={res1} setCourses={setCourses} />
    </>
  );
}

function UpdateCourse({ courses, course, setCourses }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  console.log("before : ", courses);

  const updateHandle = async () => {
    fetch("http://localhost:3000/admin/course/" + course._id, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        description: description,
        imageLink: "",
        published: true,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }).then((res) => {
      res.json().then((data) => {
        console.log(data);
        let updatedCourses = [];
        for (let i = 0; i < courses.length; i++) {
          if (courses[i]._id == course._id) {
            console.log("i ma in the water");
            updatedCourses.push({
              _id:course._id,
              title: title,
              description: description,
              imageLink: "",
              published: true,
            });
          } else {
            updatedCourses.push(courses[i]);
          }
        }
        setCourses(updatedCourses);
        console.log("after: ", courses);
      });
    });
  };

  return (
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
        You can update courses here
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
            updateHandle();
          }}
        >
          Update
        </Button>
      </Card>
    </div>
  );
}

export default Course;
