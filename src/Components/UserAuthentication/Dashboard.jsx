import React, { useEffect, useState } from "react";
import { Container, Grid, Card, Typography, CircularProgress } from "@mui/material";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import axios from "axios";
import { Box } from "@mui/material";
import SnowDots from './SnowDots';

const isNightTime = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};
const isWinterSeason = () => {
  const today = new Date();
  const month = today.getMonth(); // 0 = Jan, 11 = Dec
  const date = today.getDate();

  // Dec 25 – Dec 31
  if (month === 11 && date >= 20) return true;

  // Jan 1 – Jan 5
  if (month === 0 && date <= 5) return true;

  return false;
};
const Dashboard = () => {
  const [projectsCount, setProjectsCount] = useState(0);
  const [familiesCount, setFamiliesCount] = useState(0);
  const [projectsProgress, setProjectsProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("https://projects.ekalavya.net/api/dashboard/project/count"),
      axios.get("https://projects.ekalavya.net/api/dashboard/beneficiary/count"),
      axios.get("https://projects.ekalavya.net/api/dashboard/project/progress"),
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
      <Box
          sx={{
            position: "relative",
            minHeight: "100vh",
            width: "100%",
            background: isNightTime()
              ? "linear-gradient(to bottom, #0d1b2a 0%, #1b263b 55%, #415a77 100%)"
              : "linear-gradient(to bottom, #e3f2fd 0%, #f5faff 45%, #ffffff 100%)",
            overflow: "hidden"
          }}
        >
        { isWinterSeason() && <SnowDots />}
    <Container maxWidth="lg" sx={{ marginTop: 6, position: "relative", zIndex: 2 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
          backdropFilter: "blur(12px)",
          background: isNightTime()
            ? "rgba(20, 30, 48, 0.65)"
            : "rgba(255,255,255,0.75)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
<Typography
  variant="h4"
  sx={{
    fontWeight: 700,
    mb: 3,
    color: isNightTime() ? "#fff" : "#1f2937",
    letterSpacing: "0.5px"
  }}
>
  Dashboard Overview
</Typography>

      {/* First Row: Statistics */}
      <Grid container spacing={3}>
        {/* OUR ON-GOING PROJECTS */}
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              p: 3,
              textAlign: "center",
              borderRadius: 3,
              background: "linear-gradient(135deg, #4caf50 0%, #6adf8b 100%)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                color: "#e9fbe9",
                letterSpacing: "0.8px",
                fontSize: "1rem"
              }}
            >
              OUR ON-GOING PROJECTS
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#fff",
                fontWeight: 800
              }}
            >
              {projectsCount}
            </Typography>
          </Card>
        </Grid>

        {/* FAMILY BENEFITED */}
        <Grid item xs={12} sm={6}>
                      <Card
                        sx={{
                          p: 3,
                          textAlign: "center",
                          borderRadius: 3,
                          background: "linear-gradient(135deg, #3f51b5 0%, #7b9bff 100%)",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#e9fbe9",
                            letterSpacing: "0.8px",
                            fontSize: "1rem"
                          }}
                        >
                          FAMILY BENEFITED
                        </Typography>

                        <Typography
                          variant="h3"
                          sx={{
                            color: "#fff",
                            fontWeight: 800
                          }}
                        >
                          {familiesCount}
                        </Typography>
                      </Card>
        </Grid>
      </Grid>

      {/* Second Row: Projects Progress */}
      <Typography
        variant="h5"
        sx={{
          mt: 4,
          mb: 1,
          fontWeight: 700,
          color: isNightTime() ? "#fff" : "#1f2937"
        }}
      >
        Project Progress
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 2,
          color: isNightTime() ? "#d1d5db" : "#555"
        }}
      >
        Overall progress status of all active projects
      </Typography>
      <Grid container spacing={3}>
        {projectsProgress.map((project) => (
          <Grid item xs={12} sm={6} md={3} key={project.projectName}>
            <Card
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2.2,
                height: 120,
                borderRadius: 3,
                boxShadow: "0 10px 25px rgba(0,0,0,0.20)",
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
      </Box>
    </Container>
    </Box>
  );
};

export default Dashboard;