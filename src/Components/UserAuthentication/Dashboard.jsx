import React, { useEffect, useState } from "react";
import { Container, Grid, Card, Typography, CircularProgress } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";

const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [familiesCount, setFamiliesCount] = useState(0);
  const [projectsProgress, setProjectsProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:61002/dashboard/project/count"),
      axios.get("http://localhost:61002/dashboard/beneficiary/count"),
      axios.get("http://localhost:61002/dashboard/project/progress"),
    ])
      .then(([projectCountRes, familyCountRes, projectProgressRes]) => {
        setProjectsCount(projectCountRes.data);
        setFamiliesCount(familyCountRes.data);
        setProjectsProgress(projectProgressRes.data);
      })
      .catch((err) => {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", mt: 10 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      {/* First Row: Statistics */}
      <Grid container spacing={3}>
        {/* OUR ON-GOING PROJECTS */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f3f4f6",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              OUR ON-GOING PROJECTS
            </Typography>
            <Typography variant="h4" color="primary">
              {projectsCount}
            </Typography>
          </Card>
        </Grid>

        {/* FAMILY BENEFITED */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#f3f4f6",
              boxShadow: 2,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              FAMILY BENEFITED
            </Typography>
            <Typography variant="h4" color="secondary">
              {familiesCount}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row: Projects Progress */}
      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
        Project Progress
      </Typography>
      <Grid container spacing={3}>
        {projectsProgress.map((project) => (
          <Grid item xs={12} sm={6} md={3} key={project.projectName}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 2,
                height: "120px",
                backgroundColor: "#ffffff",
                boxShadow: 3,
                borderRadius: 2,
              }}
            >
              {/* Left Side: Project Name */}
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "#333", flex: 1 }}
              >
                {project.projectName}
              </Typography>

              {/* Right Side: Circular Progress */}
              <div style={{ width: "50px", height: "50px" }}>
                <CircularProgressbar
                  value={project.progressPercentage || 0}
                  text={`${project.progressPercentage?.toFixed(0) || 0}%`}
                  styles={buildStyles({
                    pathColor: "#3f51b5",
                    textColor: "#3f51b5",
                    trailColor: "#e0e0e0",
                  })}
                />
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
