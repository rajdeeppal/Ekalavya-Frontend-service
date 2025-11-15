import "./sidebar.scss";
import React, { useEffect, useState } from "react";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PendingIcon from "@mui/icons-material/Pending";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import { useAuth } from "../../PrivateRoute";
import { getPendingCounts } from "../../DataCenter/apiService";
import Badge from "@mui/material/Badge";

const Sidebar = ({ isSuccess }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [pendingCount, setPendingCount] = useState({});
  const [openMenu, setOpenMenu] = useState({
    approve: false,
    reject: false,
  });

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

          {renderSubLink("/Director/resolution-list", <FormatListBulletedIcon className="icon" />, "Resolution View")}

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
