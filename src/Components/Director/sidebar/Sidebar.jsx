import "./sidebar.scss";
import React, { useEffect, useState } from "react";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PendingIcon from "@mui/icons-material/Pending";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../images/logo.png";
import { useAuth } from "../../PrivateRoute";
import { getPendingCounts } from "../../DataCenter/apiService";
import Badge from "@mui/material/Badge";

const Sidebar = ({ isSuccess }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState({});
  const [openMenu, setOpenMenu] = useState({
    approve: false,
    reject: false,
    dashboard: false,
  });

  useEffect(() => {
    const path = location.pathname;
    
    // Auto-expand menus based on current path
    setOpenMenu({
      approve: path.includes('/Director/inprogress-list') || path.includes('/Director/training/inprogress-list'),
      reject: path.includes('/Director/review-list') || path.includes('/Director/training/review-list'),
      dashboard: path.includes('/Director/dashboard-list') || path.includes('/Director/dashboard/training-records'),
    });
  }, [location.pathname]);

  useEffect(() => {
    async function fetchCounts() {
      const data = await getPendingCounts(userId);
      setPendingCount(data || {});
    }
    fetchCounts();
  }, [isSuccess, userId]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/");
  };

  const toggleMenu = (key) => {
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSubLink = (to, icon, text, badgeContent = null, badgeColor = "success", disabled = false) => (
    <li style={{ padding: "3px 6px" }}>
      <NavLink
        to={to}
        style={({ isActive }) => ({
          textDecoration: "none",
          backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "transparent",
          borderRadius: "8px 0px 0px 8px",
          padding: "8px 6px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          pointerEvents: disabled ? "none" : "auto",
          opacity: disabled ? 0.5 : 1,
        })}
        className={({ isActive }) => isActive ? "active-link" : ""}
      >
        {icon}
        {badgeContent !== null ? (
          <Badge
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            sx={{
              "& .MuiBadge-badge": {
                color: "white ! important",
                fontSize: "0.7rem",
                height: "16px",
                minWidth: "16px",
              },
            }}
          >
            <span style={{ marginLeft: "8px" }}>{text}</span>
          </Badge>
        ) : (
          <span style={{ marginLeft: "8px" }}>{text}</span>
        )}
      </NavLink>
    </li>
  );

  return (
    <div className="sidebar">
      <div className="top">
        <NavLink to="/" style={{ textDecoration: "none" }}>
          <span>
            <img src={logo} alt="Logo" className="logo" />
          </span>
        </NavLink>
      </div>
      <hr />
      <div className="center">
        <ul>

          <li className="menu-header" onClick={() => toggleMenu("approve")}>
            <div className="menu-title">
              <PendingIcon className="icon" />
              <Badge
                badgeContent={pendingCount.approvalCount + (pendingCount.trainingApprovalCount || 0)}
                color="success"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "white ! important",
                    fontSize: "0.7rem",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                Approval Center
              </Badge>
            </div>
            {openMenu.approve ? <ExpandLess /> : <ExpandMore />}
          </li>
          {openMenu.approve && (
            <ul className="submenu">
              {renderSubLink("/Director/inprogress-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records", pendingCount.approvalCount, "success")}
              {renderSubLink("/Director/training/inprogress-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records", pendingCount.trainingApprovalCount, "success")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("reject")}>
            <div className="menu-title">
              <RateReviewOutlinedIcon className="icon" />
              <Badge
                badgeContent={pendingCount.rejectionCount + (pendingCount.trainingRejectionCount || 0)}
                color="error"
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiBadge-badge": {
                    color: "white ! important",
                    fontSize: "0.7rem",
                    height: "16px",
                    minWidth: "16px",
                  },
                }}
              >
                Rejection Center
              </Badge>
            </div>
            {openMenu.reject ? <ExpandLess /> : <ExpandMore />}
          </li>
          {openMenu.reject && (
            <ul className="submenu">
              {renderSubLink("/Director/review-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records", pendingCount.rejectionCount, "error")}
              {renderSubLink("/Director/training/review-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records", pendingCount.trainingRejectionCount, "error")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("dashboard")}>
            <div className="menu-title">
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </div>
            {openMenu.dashboard ? <ExpandLess /> : <ExpandMore />}
          </li>
          {openMenu.dashboard && (
            <ul className="submenu">
              {renderSubLink("/Director/dashboard-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records")}
              {renderSubLink("/Director/dashboard/training-records", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

          {renderSubLink("/Director/report-list", <AssessmentIcon className="icon" />, "Report Tab")}

          {renderSubLink("/Director/resolution-list", <FormatListBulletedIcon className="icon" />, "Resolution View", null, "success", true)}

          {renderSubLink("/myprofile", <AccountCircleOutlinedIcon className="icon" />, "Profile")}

          <li onClick={handleLogout}>
            <div className="menu-title logout">
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </div>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
