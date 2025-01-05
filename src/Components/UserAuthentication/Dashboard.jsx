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
      axios.get("http://3.111.84.98:61002/dashboard/project/count"),
      axios.get("http://3.111.84.98:61002/dashboard/beneficiary/count"),
      axios.get("http://3.111.84.98:61002/dashboard/project/progress"),
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

  const getProgressColor = (progress) => {
    if (progress <= 30) {
      return "#e57373"; // Red for low progress
    } else if (progress <= 70) {
      return "#ffeb3b"; // Yellow for medium progress
    } else {
      return "#66bb6a"; // Green for high progress
    }
  };

  const getTextColor = (progress) => {
    if (progress <= 30 || progress > 70) {
      return "#ffffff"; // White text for low and high progress
    } else {
      return "#000000"; // Black text for yellow (medium progress)
    }
  };

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
    <Container maxWidth="lg" sx={{ marginTop: 4, backgroundColor: "#f5f5f5" }}>
      {/* First Row: Statistics */}
      <Grid container spacing={3}>
        {/* OUR ON-GOING PROJECTS */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              padding: 3,
              textAlign: "center",
              backgroundColor: "#ffffff",
              boxShadow: 5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              OUR ON-GOING PROJECTS
            </Typography>
            <Typography variant="h4" sx={{ color: "#ffffff" }}>
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
              backgroundColor: "#ffffff",
              boxShadow: 5,
              borderRadius: 2,
              background: "linear-gradient(135deg, #3f51b5 0%, #7986cb 100%)",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: "#ffffff" }}>
              FAMILY BENEFITED
            </Typography>
            <Typography variant="h4" sx={{ color: "#ffffff" }}>
              {familiesCount}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Second Row: Projects Progress */}
      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2, color: "#333" }}>
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
                backgroundColor: getProgressColor(project.progressPercentage),
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
                    pathColor: "#ffffff", // White color for the progress bar path
                    textColor: getTextColor(project.progressPercentage), // Dynamic text color
                    trailColor: "#e0e0e0", // Light grey for the trail
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