import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWallet,
  CheckCircle,
  Close,
  ExpandLess,
  FolderSpecial,
  Groups,
  LocationOn,
  Search,
  TrendingUp,
  Work,
} from "@mui/icons-material";
import SnowDots from "./SnowDots";
import ekalavyaLogo from "../images/logo.png";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE_URL = "https://projects.ekalavya.net/api/dashboard";
const LOGO_BASE_URL = "https://projects.ekalavya.net/api/user/pm/project/logo";
const OFFICIAL_SITE_BACKGROUND =
  "https://ekalavya.net/wp-content/uploads/2025/11/bsldp-scaled.jpg";
const DASHBOARD_FONT =
  "'Poppins', 'Nunito Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const SEARCH_DEBOUNCE_MS = 300;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isNightTime = () => {
  const h = new Date().getHours();
  return h >= 18 || h < 6;
};

const isWinterSeason = () => {
  const today = new Date();
  const m = today.getMonth();
  const d = today.getDate();
  return (m === 11 && d >= 20) || (m === 0 && d <= 5);
};

const clamp = (v) => Math.min(100, Math.max(0, Number(v) || 0));
const fmtPct = (v) => `${clamp(v).toFixed(0)}%`;
const fmtINR = (v) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(v) || 0);

const getLocation = (p) => {
  const s = p.stateName || "State not set";
  const d = p.districtName || "District not set";
  return `${s}, ${d}`;
};

const getKey = (p) => p.projectId || p.id || p.projectName;

// ─── useAnimatedCounter ────────────────────────────────────────────────────────
const useAnimatedCounter = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const n = Number(target) || 0;
    if (n === 0) { setValue(0); return; }
    const fps = 30;
    const frames = Math.max(1, Math.round((duration / 1000) * fps));
    let f = 0;
    const id = setInterval(() => {
      f += 1;
      setValue(Math.round(n * (f / frames)));
      if (f >= frames) { clearInterval(id); setValue(n); }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [target, duration]);
  return value;
};

// ─── useDebounce ──────────────────────────────────────────────────────────────
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
};

// ─── ProjectLogo ─────────────────────────────────────────────────────────────
/**
 * Renders the project logo if one exists and loads successfully.
 * Falls back gracefully to a gradient avatar with project-name initials
 * for projects that:
 *   (a) have no logoKey (created before the logo feature), OR
 *   (b) have a logoKey but the image fails to load (stale S3 key, network error, etc.)
 */
const ProjectLogo = ({ project, size = 48, sx = {} }) => {
  const [imgError, setImgError] = useState(false);

  // Derive initials — up to 2 characters from the project name
  const initials = React.useMemo(() => {
    const name = (project.projectName || "").replace(/_\d+$/, "").trim(); // strip trailing _ID
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length === 0) return "P";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }, [project.projectName]);

  const hasLogo = project.logoKey && !imgError;

  // Gradient palette cycles through a deterministic color based on the project id
  const GRADIENTS = [
    "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
    "linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)",
    "linear-gradient(135deg, #b45309 0%, #f59e0b 100%)",
    "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
    "linear-gradient(135deg, #047857 0%, #10b981 100%)",
    "linear-gradient(135deg, #dc2626 0%, #f97316 100%)",
  ];
  const gradient = GRADIENTS[(Number(project.id) || 0) % GRADIENTS.length];

  const sharedSx = {
    width: size,
    height: size,
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(0,0,0,0.18)",
    ...sx,
  };

  if (hasLogo) {
    return (
      <Avatar
        src={`${LOGO_BASE_URL}/${project.id}`}
        alt={project.projectName}
        imgProps={{ onError: () => setImgError(true) }}
        sx={{
          ...sharedSx,
          border: "2px solid",
          borderColor: "rgba(255,255,255,0.55)",
        }}
      />
    );
  }

  return (
    <Avatar
      sx={{
        ...sharedSx,
        background: gradient,
        border: "2px solid rgba(255,255,255,0.35)",
        fontSize: size * 0.36,
        fontWeight: 800,
        color: "#fff",
        letterSpacing: "0.03em",
      }}
    >
      {initials}
    </Avatar>
  );
};


// ─── Metric cards config ──────────────────────────────────────────────────────
const METRICS = [
  {
    key: "sanctionedFamilies",
    label: "Sanctioned Families",
    icon: <Groups />,
    fmt: (v) => Number(v || 0).toLocaleString("en-IN"),
    gradient: "linear-gradient(135deg, #2563eb 0%, #38bdf8 100%)",
  },
  {
    key: "completedFamilies",
    label: "Completed as on Date",
    icon: <CheckCircle />,
    fmt: (v) => Number(v || 0).toLocaleString("en-IN"),
    gradient: "linear-gradient(135deg, #059669 0%, #6ee7b7 100%)",
  },
  {
    key: "projectProposedCost",
    label: "Sanctioned Financials",
    icon: <AccountBalanceWallet />,
    fmt: fmtINR,
    gradient: "linear-gradient(135deg, #b45309 0%, #fbbf24 100%)",
  },
  {
    key: "currentAchieveCost",
    label: "Completed Financials",
    icon: <TrendingUp />,
    fmt: fmtINR,
    gradient: "linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)",
  },
];

// ─── ProjectProgress ──────────────────────────────────────────────────────────
const ProjectProgress = ({ value, compact = false }) => {
  const pct = clamp(value);
  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 700, fontSize: "0.7rem" }}>
          Overall Completion
        </Typography>
        <Typography variant="caption" sx={{ color: "#0f172a", fontWeight: 800, fontSize: "0.7rem" }}>
          {fmtPct(pct)}
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: compact ? 6 : 9,
          borderRadius: 8,
          backgroundColor: "#e2e8f0",
          "& .MuiLinearProgress-bar": {
            borderRadius: 8,
            background:
              pct >= 100
                ? "linear-gradient(90deg,#16a34a 0%,#22c55e 100%)"
                : "linear-gradient(90deg,#f97316 0%,#facc15 55%,#22c55e 100%)",
          },
        }}
      />
    </Box>
  );
};

// ─── ProjectCard (grid view) ──────────────────────────────────────────────────
const ProjectCard = ({ project, isCompleted, onExpand }) => (
  <Card
    component="article"
    onClick={onExpand}
    sx={{
      height: "100%",
      p: 0,
      borderRadius: 3,
      cursor: "pointer",
      border: "1px solid #e2e8f0",
      background: "#ffffff",
      boxShadow: "0 6px 28px rgba(15,23,42,0.07)",
      transition: "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
      overflow: "hidden",
      "&:hover": {
        transform: "translateY(-5px)",
        borderColor: isCompleted ? "#22c55e" : "#f59e0b",
        boxShadow: "0 18px 40px rgba(15,23,42,0.14)",
      },
    }}
  >
    {/* Color accent top bar */}
    <Box
      sx={{
        height: 5,
        background: isCompleted
          ? "linear-gradient(90deg,#16a34a 0%,#22c55e 100%)"
          : "linear-gradient(90deg,#ea580c 0%,#facc15 100%)",
      }}
    />
    <Stack spacing={2} sx={{ p: 2.4, height: "calc(100% - 5px)" }}>
      {/* Header row: logo + title + chip */}
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <ProjectLogo project={project} size={46} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#0f172a", fontWeight: 800, lineHeight: 1.25, fontSize: "0.95rem" }}
          >
            {project.projectName || "Unnamed Project"}
          </Typography>
          <Stack direction="row" gap={0.5} alignItems="center" sx={{ mt: 0.5, color: "#64748b" }}>
            <LocationOn sx={{ fontSize: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: "0.72rem" }}>
              {getLocation(project)}
            </Typography>
          </Stack>
        </Box>
        <Chip
          size="small"
          label={isCompleted ? "Done" : "Active"}
          sx={{
            flexShrink: 0,
            fontWeight: 800,
            fontSize: "0.65rem",
            height: 20,
            color: isCompleted ? "#166534" : "#9a3412",
            backgroundColor: isCompleted ? "#dcfce7" : "#ffedd5",
          }}
        />
      </Stack>

      {!isCompleted && <ProjectProgress value={project.progressPercentage} />}

      {/* Cost row */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.65rem" }}>
            Proposed Cost
          </Typography>
          <Typography variant="body2" sx={{ color: "#0f172a", fontWeight: 800, fontSize: "0.82rem" }}>
            {fmtINR(project.projectProposedCost)}
          </Typography>
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="caption" sx={{ color: "#94a3b8", fontWeight: 700, fontSize: "0.65rem" }}>
            Achieved
          </Typography>
          <Typography variant="body2" sx={{ color: "#0f766e", fontWeight: 800, fontSize: "0.82rem" }}>
            {fmtINR(project.currentAchieveCost)}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ flexGrow: 1 }} />
      <Button
        onClick={(e) => { e.stopPropagation(); onExpand(); }}
        sx={{
          alignSelf: "flex-start",
          p: 0,
          minWidth: "auto",
          color: "#0f766e",
          fontWeight: 800,
          textTransform: "none",
          fontSize: "0.78rem",
          "&:hover": { backgroundColor: "transparent", color: "#115e59" },
        }}
      >
        View full details →
      </Button>
    </Stack>
  </Card>
);

// ─── ProjectListItem (compact row) ────────────────────────────────────────────
const ProjectListItem = ({ project, isCompleted, onExpand }) => (
  <Card
    onClick={onExpand}
    sx={{
      p: 1.6,
      borderRadius: 2,
      cursor: "pointer",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      transition: "background 140ms, border-color 140ms",
      "&:hover": {
        borderColor: isCompleted ? "#22c55e" : "#f59e0b",
        backgroundColor: "#f8fafc",
      },
    }}
  >
    <Grid container spacing={1.5} alignItems="center">
      <Grid item xs="auto">
        <ProjectLogo project={project} size={36} />
      </Grid>
      <Grid item xs={12} md={5}>
        <Typography variant="subtitle2" sx={{ color: "#0f172a", fontWeight: 800 }}>
          {project.projectName || "Unnamed Project"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600 }}>
          {getLocation(project)}
        </Typography>
      </Grid>
      <Grid item xs={12} md={4}>
        {!isCompleted ? (
          <ProjectProgress value={project.progressPercentage} compact />
        ) : (
          <Chip
            size="small"
            label="Completed"
            sx={{ color: "#166534", backgroundColor: "#dcfce7", fontWeight: 800, fontSize: "0.68rem" }}
          />
        )}
      </Grid>
      <Grid item xs={12} md={2} sx={{ textAlign: { xs: "left", md: "right" } }}>
        <Typography variant="caption" sx={{ color: "#0f766e", fontWeight: 800 }}>
          View details →
        </Typography>
      </Grid>
    </Grid>
  </Card>
);

// ─── ProjectDetail (expanded panel) ──────────────────────────────────────────
const ProjectDetail = ({ project, isCompleted, onCollapse }) => (
  <Card
    sx={{
      p: { xs: 2.2, md: 3 },
      borderRadius: 3,
      border: "1px solid rgba(15,118,110,0.22)",
      boxShadow: "0 24px 50px rgba(15,23,42,0.14)",
      background: "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
      overflow: "hidden",
    }}
  >
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2.5}>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        {/* Header: logo + chip */}
        <Stack direction="row" gap={2} alignItems="center" sx={{ mb: 2 }}>
          <ProjectLogo project={project} size={72} sx={{ border: "3px solid", borderColor: isCompleted ? "#22c55e" : "#f59e0b" }} />
          <Box>
            <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 0.75 }}>
              <Box
                sx={{
                  width: 28, height: 28, borderRadius: 1.5,
                  display: "grid", placeItems: "center", color: "#fff",
                  background: isCompleted
                    ? "linear-gradient(135deg,#16a34a 0%,#22c55e 100%)"
                    : "linear-gradient(135deg,#ea580c 0%,#facc15 100%)",
                }}
              >
                <Work sx={{ fontSize: 16 }} />
              </Box>
              <Chip
                size="small"
                label={isCompleted ? "Completed project" : "Ongoing project"}
                sx={{
                  color: isCompleted ? "#166534" : "#9a3412",
                  backgroundColor: isCompleted ? "#dcfce7" : "#ffedd5",
                  fontWeight: 800,
                  fontSize: "0.72rem",
                }}
              />
            </Stack>
            <Typography variant="h5" sx={{ color: "#0f172a", fontWeight: 900, lineHeight: 1.2 }}>
              {project.projectName || "Unnamed Project"}
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={2}>
          {[
            { label: "Vertical", value: project.verticalName || "Not assigned" },
            { label: "State", value: project.stateName || "Not set" },
            { label: "District", value: project.districtName || "Not set" },
          ].map((item) => (
            <Grid item xs={12} sm={4} key={item.label}>
              <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 800, display: "block" }}>
                {item.label}
              </Typography>
              <Typography variant="body2" sx={{ color: "#0f172a", fontWeight: 800 }}>
                {item.value}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
        <ProjectProgress value={isCompleted ? 100 : project.progressPercentage} />
        <Button
          startIcon={<ExpandLess />}
          onClick={onCollapse}
          sx={{ mt: 2, color: "#334155", fontWeight: 800, textTransform: "none", borderColor: "#cbd5e1" }}
          variant="outlined"
        >
          Collapse detail view
        </Button>
      </Box>
    </Stack>

    <Grid container spacing={2} sx={{ mt: 2.5 }}>
      {METRICS.map((m) => (
        <Grid item xs={12} sm={6} md={3} key={m.key}>
          <Card
            sx={{
              p: 2, height: "100%", borderRadius: 2,
              color: "#fff", background: m.gradient,
              boxShadow: "0 12px 24px rgba(15,23,42,0.14)",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <Typography variant="caption" sx={{ fontWeight: 800, opacity: 0.92, lineHeight: 1.3 }}>
                {m.label}
              </Typography>
              <Box sx={{ opacity: 0.88 }}>{m.icon}</Box>
            </Stack>
            <Typography variant="h6" sx={{ mt: 1.5, fontWeight: 900 }}>
              {m.fmt(project[m.key])}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Card>
);

// ─── SearchBox ────────────────────────────────────────────────────────────────
const SearchBox = ({ value, onChange, loading, resultCount, nightMode }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      flexWrap: "wrap",
    }}
  >
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search by project name or ID…"
      size="small"
      variant="outlined"
      sx={{
        minWidth: 280,
        flex: 1,
        maxWidth: 420,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: nightMode ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          color: nightMode ? "#f8fafc" : "#0f172a",
          fontWeight: 600,
          fontSize: "0.88rem",
          "& fieldset": { borderColor: nightMode ? "rgba(255,255,255,0.18)" : "#cbd5e1" },
          "&:hover fieldset": { borderColor: "#0f766e" },
          "&.Mui-focused fieldset": { borderColor: "#0f766e", borderWidth: 2 },
        },
        "& .MuiInputBase-input::placeholder": {
          color: nightMode ? "#94a3b8" : "#94a3b8",
          opacity: 1,
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            {loading ? (
              <CircularProgress size={16} sx={{ color: "#0f766e" }} />
            ) : (
              <Search sx={{ fontSize: 18, color: "#64748b" }} />
            )}
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <Box
              onClick={() => onChange("")}
              sx={{
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
                "&:hover": { color: "#334155" },
              }}
            >
              <Close sx={{ fontSize: 16 }} />
            </Box>
          </InputAdornment>
        ) : null,
      }}
    />
    {value && (
      <Typography
        variant="caption"
        sx={{
          color: nightMode ? "#94a3b8" : "#64748b",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {resultCount} result{resultCount !== 1 ? "s" : ""}
      </Typography>
    )}
  </Box>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const nightMode = isNightTime();

  const [allProjects, setAllProjects] = useState([]);
  const [searchResults, setSearchResults] = useState(null); // null = show allProjects
  const [activeTab, setActiveTab] = useState("ongoing");
  const [expandedKey, setExpandedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/project/summary`)
      .then((res) => setAllProjects(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setError("Failed to load dashboard data. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Prefix search ──────────────────────────────────────────────────────────
  const abortRef = useRef(null);
  useEffect(() => {
    if (debouncedQuery.trim() === "") {
      setSearchResults(null);
      return;
    }
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setSearchLoading(true);
    axios
      .get(`${API_BASE_URL}/project/search`, {
        params: { query: debouncedQuery.trim() },
        signal: ctrl.signal,
      })
      .then((res) => {
        setSearchResults(Array.isArray(res.data) ? res.data : []);
        setExpandedKey(null);
      })
      .catch((err) => {
        if (!axios.isCancel(err)) console.error("Search error:", err);
      })
      .finally(() => setSearchLoading(false));
  }, [debouncedQuery]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const projects = searchResults ?? allProjects;

  const ongoingProjects = useMemo(
    () => projects.filter((p) => p.terminate !== "Y"),
    [projects]
  );
  const completedProjects = useMemo(
    () => projects.filter((p) => p.terminate === "Y"),
    [projects]
  );

  const visibleProjects = activeTab === "ongoing" ? ongoingProjects : completedProjects;
  const selectedProject = visibleProjects.find((p) => getKey(p) === expandedKey);
  const isCompletedTab = activeTab === "completed";

  const animatedOngoing = useAnimatedCounter(ongoingProjects.length);
  const animatedCompleted = useAnimatedCounter(completedProjects.length);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedKey(null);
  };

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", mt: 12 }}>
        <CircularProgress size={48} sx={{ color: "#0f766e" }} />
        <Typography variant="h6" sx={{ mt: 2.5, fontWeight: 700, color: "#334155" }}>
          Loading project intelligence…
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: "center", mt: 12 }}>
        <Typography color="error" variant="h6" sx={{ fontWeight: 700 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        fontFamily: DASHBOARD_FONT,
        backgroundColor: nightMode ? "#07111f" : "#f6fbf8",
        backgroundImage: nightMode
          ? `linear-gradient(145deg,rgba(7,17,31,0.94) 0%,rgba(18,48,64,0.88) 48%,rgba(8,47,73,0.74) 100%),url(${OFFICIAL_SITE_BACKGROUND})`
          : `linear-gradient(145deg,rgba(246,251,248,0.94) 0%,rgba(231,240,237,0.9) 48%,rgba(255,247,237,0.86) 100%),url(${OFFICIAL_SITE_BACKGROUND})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        overflow: "hidden",
        "& *": { fontFamily: DASHBOARD_FONT },
      }}
    >
      {isWinterSeason() && <SnowDots />}
      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 }, position: "relative", zIndex: 2 }}>
        <Stack spacing={3}>
          {/* ── Page header ── */}
          <Box>
            <Stack direction="row" alignItems="center" gap={1.6} sx={{ mb: 2.2, flexWrap: "wrap" }}>
              <Box
                sx={{
                  width: { xs: 184, sm: 214 }, maxWidth: "100%",
                  height: { xs: 60, sm: 64 },
                  borderRadius: 2, display: "flex", alignItems: "center",
                  px: 1.6, py: 0.8,
                  background: nightMode ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.88)",
                  border: "1px solid rgba(255,255,255,0.72)",
                  boxShadow: "0 16px 32px rgba(15,23,42,0.14)",
                  backdropFilter: "blur(14px)",
                }}
              >
                <Box
                  component="img"
                  src={ekalavyaLogo}
                  alt="Ekalavya Foundation"
                  sx={{ width: "100%", height: "100%", objectFit: "contain", objectPosition: "left center" }}
                />
              </Box>
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    display: "block", color: nightMode ? "#bbf7d0" : "#166534",
                    fontSize: 10, fontWeight: 900, letterSpacing: 1.1, lineHeight: 1, textTransform: "uppercase",
                  }}
                >
                  Project Command Center
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mt: 0.45, display: "block", color: nightMode ? "#f8fafc" : "#0f172a",
                    fontSize: { xs: 18, sm: 21 }, fontWeight: 800, lineHeight: 1.15,
                  }}
                >
                  Portfolio Intelligence
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "block", mt: 0.75, color: nightMode ? "#dbeafe" : "#475569",
                    fontSize: { xs: 11.5, sm: 12.5 }, fontWeight: 650, lineHeight: 1.45, maxWidth: 520,
                  }}
                >
                  Live status, beneficiary completion, and fund utilization in one operational view.
                </Typography>
              </Box>
            </Stack>
            <Typography
              variant="overline"
              sx={{
                display: "block", color: nightMode ? "#bbf7d0" : "#166534",
                fontSize: 10.5, fontWeight: 900, letterSpacing: 1.2, textTransform: "uppercase", lineHeight: 1,
              }}
            >
              Dashboard Overview
            </Typography>
            <Typography
              variant="h3"
              sx={{
                mt: 1, color: nightMode ? "#f8fafc" : "#0f172a",
                fontSize: { xs: 24, sm: 29, md: 34 }, fontWeight: 800, lineHeight: 1.15, maxWidth: 820,
              }}
            >
              Village Impact &amp; Project Progress
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 1.2, color: nightMode ? "#dbeafe" : "#475569",
                fontSize: { xs: 12.5, sm: 14 }, fontWeight: 650, lineHeight: 1.55, maxWidth: 760,
              }}
            >
              A measurable view of ongoing delivery, completed outcomes, and community development milestones.
            </Typography>
          </Box>

          {/* ── Summary cards ── */}
          <Grid container spacing={2}>
            {[
              {
                tab: "ongoing",
                label: "Ongoing Projects",
                count: animatedOngoing,
                icon: <TrendingUp sx={{ fontSize: 44, opacity: 0.9 }} />,
                gradient: "linear-gradient(135deg,#ea580c 0%,#f59e0b 48%,#facc15 100%)",
                shadow: "rgba(234,88,12,0.24)",
              },
              {
                tab: "completed",
                label: "Completed Projects",
                count: animatedCompleted,
                icon: <CheckCircle sx={{ fontSize: 44, opacity: 0.9 }} />,
                gradient: "linear-gradient(135deg,#047857 0%,#10b981 52%,#86efac 100%)",
                shadow: "rgba(4,120,87,0.24)",
              },
            ].map((card) => (
              <Grid item xs={12} md={6} key={card.tab}>
                <Card
                  onClick={() => handleTabChange(card.tab)}
                  sx={{
                    p: 2.5, borderRadius: 2.5, cursor: "pointer", color: "#fff",
                    background: card.gradient,
                    border: activeTab === card.tab ? "2.5px solid #ffffff" : "2.5px solid transparent",
                    boxShadow: `0 24px 42px ${card.shadow}`,
                    transition: "transform 160ms ease, box-shadow 160ms ease",
                    "&:hover": { transform: "translateY(-2px)" },
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="overline" sx={{ fontWeight: 900, letterSpacing: 0 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900 }}>
                        {card.count}
                      </Typography>
                    </Box>
                    {card.icon}
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* ── Project list panel ── */}
          <Box
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              background: nightMode ? "rgba(15,23,42,0.82)" : "rgba(255,255,255,0.82)",
              border: `1px solid ${nightMode ? "rgba(255,255,255,0.08)" : "rgba(226,232,240,0.9)"}`,
              boxShadow: "0 24px 60px rgba(15,23,42,0.12)",
              backdropFilter: "blur(14px)",
            }}
          >
            {/* Panel header */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={2}
              sx={{ mb: 2.5 }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ color: nightMode ? "#f8fafc" : "#0f172a", fontWeight: 900 }}
                >
                  {isCompletedTab ? "Completed Projects" : "Ongoing Projects"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: nightMode ? "#94a3b8" : "#64748b", fontWeight: 600, mt: 0.25, fontSize: "0.8rem" }}
                >
                  {searchQuery
                    ? `Search results for "${searchQuery}"`
                    : "Top 30 by proposed cost · select a card for full detail"}
                </Typography>
              </Box>

              {/* RIGHT: search box + count chip */}
              <Stack direction="row" alignItems="center" gap={1.5} sx={{ flexShrink: 0, flexWrap: "wrap" }}>
                <SearchBox
                  value={searchQuery}
                  onChange={(v) => { setSearchQuery(v); setExpandedKey(null); }}
                  loading={searchLoading}
                  resultCount={visibleProjects.length}
                  nightMode={nightMode}
                />
                <Chip
                  label={`${visibleProjects.length} project${visibleProjects.length !== 1 ? "s" : ""}`}
                  sx={{
                    fontWeight: 800, fontSize: "0.75rem",
                    backgroundColor: nightMode ? "rgba(255,255,255,0.12)" : "#e2e8f0",
                    color: nightMode ? "#f8fafc" : "#334155",
                  }}
                />
              </Stack>
            </Stack>

            {/* Content */}
            {visibleProjects.length === 0 ? (
              <Box sx={{ py: 8, textAlign: "center" }}>
                {searchQuery ? (
                  <>
                    <Search sx={{ fontSize: 40, color: "#94a3b8", mb: 1 }} />
                    <Typography
                      variant="h6"
                      sx={{ color: nightMode ? "#64748b" : "#64748b", fontWeight: 800 }}
                    >
                      No projects match &ldquo;{searchQuery}&rdquo;
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#94a3b8", fontWeight: 600, mt: 0.5 }}
                    >
                      Try a different name or project ID prefix.
                    </Typography>
                  </>
                ) : (
                  <Typography
                    variant="h6"
                    sx={{ color: nightMode ? "#64748b" : "#64748b", fontWeight: 800 }}
                  >
                    No projects available in this tab.
                  </Typography>
                )}
              </Box>
            ) : selectedProject ? (
              <Stack spacing={2}>
                <ProjectDetail
                  project={selectedProject}
                  isCompleted={isCompletedTab}
                  onCollapse={() => setExpandedKey(null)}
                />
                {visibleProjects
                  .filter((p) => getKey(p) !== expandedKey)
                  .map((p) => (
                    <ProjectListItem
                      key={getKey(p)}
                      project={p}
                      isCompleted={isCompletedTab}
                      onExpand={() => setExpandedKey(getKey(p))}
                    />
                  ))}
              </Stack>
            ) : (
              <Grid container spacing={2}>
                {visibleProjects.map((p) => (
                  <Grid item xs={12} sm={6} lg={4} key={getKey(p)}>
                    <ProjectCard
                      project={p}
                      isCompleted={isCompletedTab}
                      onExpand={() => setExpandedKey(getKey(p))}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
