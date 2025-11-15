import "./sidebar.scss";
import React, { useEffect, useState } from 'react';
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { NavLink, useNavigate } from "react-router-dom";
import logo from '../../images/logo.png';
import PendingIcon from '@mui/icons-material/Pending';
import PlaylistRemoveIcon from '@mui/icons-material/PlaylistRemove';
import PaymentsIcon from '@mui/icons-material/Payments';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAuth } from '../../PrivateRoute';
import { getPendingCounts } from '../../DataCenter/apiService';
import Badge from "@mui/material/Badge";

const Sidebar = ({ isSuccess }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [pendingCount, setPendingCount] = useState({});
  const [openMenu, setOpenMenu] = useState({
    approve: false,
    reject: false,
    dashboard: false,
  });

  useEffect(() => {
    async function fetchCounts() {
      const data = await getPendingCounts(userId);
      setPendingCount(data || {});
    }
    fetchCounts();
  }, [isSuccess, userId]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/');
  };

  const toggleMenu = (key) => {
    setOpenMenu((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderSubLink = (to, icon, text, badgeContent = null, badgeColor = "success") => (
    <li style={{ padding: "3px 6px" }}>
      <NavLink
        to={to}
        style={({ isActive }) => ({
          textDecoration: "none",
          backgroundColor: isActive ? "#ece8ff" : "transparent",
          borderRadius: "8px 0px 0px 8px",
          padding: "8px 6px",
          width: "100%",
          display: "flex",
          alignItems: "center",
        })}
      >
        {icon}
        {badgeContent !== null ? (
          <Badge
            // badgeContent={badgeContent}
            // color={badgeColor}
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
          <span><img src={logo} alt="Logo" className="logo" /></span>
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
              {renderSubLink("/CEO/inprogress-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records", pendingCount.approvalCount, "success")}
              {renderSubLink("/CEO/training/inprogress-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records", pendingCount.trainingApprovalCount, "success")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("reject")}>
            <div className="menu-title">
              <PlaylistRemoveIcon className="icon" />
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
              {renderSubLink("/CEO/review-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records", pendingCount.rejectionCount, "error")}
              {renderSubLink("/CEO/training/review-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records", pendingCount.trainingRejectionCount, "error")}
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
              {renderSubLink("/CEO/dashboard-list", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records")}
              {renderSubLink("/CEO/dashboard/training-records", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

          {renderSubLink("/CEO/payment-list", <PaymentsIcon className="icon" />, "Payment Report")}

          {renderSubLink("/CEO/report-list", <AssessmentIcon className="icon" />, "Report Tab")}

          {renderSubLink("/CEO/resolution-list", <FormatListBulletedIcon className="icon" />, "Resolution View")}

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
