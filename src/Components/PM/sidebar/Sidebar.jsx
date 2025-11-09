import "./sidebar.scss";
import React, { useEffect, useState } from "react";
import {
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import PreviewIcon from "@mui/icons-material/Preview";
import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
import StoreIcon from "@mui/icons-material/Store";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../PrivateRoute";
import logo from "../../images/logo.png";
import { getPendingCounts } from "../../DataCenter/apiService";
import Badge from "@mui/material/Badge";

const Sidebar = ({ isSuccess }) => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const [pendingCount, setPendingCount] = useState({});
  const [openMenu, setOpenMenu] = useState({
    sanction: false,
    inprogress: false,
    final: false,
    rejection: false,
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

  const renderSubLink = (to, icon, text) => (
    <li style={{ padding: "3px 6px" }}>
      <NavLink
        to={to}
        style={({ isActive }) => ({
          textDecoration: "none",
          backgroundColor: isActive ? "#ece8ff" : "transparent",
          borderRadius: " 8px 0px 0px 8px ",
          padding: "8px 6px",
          width: "100%",
          display: "flex",
          alignItems: "center",
        })}
      >
        {icon}
        <span style={{ marginLeft: "8px" }}>{text}</span>
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

          <li className="menu-header" onClick={() => toggleMenu("sanction")}>
            <div className="menu-title">
              <PersonOutlineIcon className="icon" />
              <span>Sanction</span>
            </div>
            {openMenu.sanction ? <ExpandLess /> : <ExpandMore />}

          </li>
          {openMenu.sanction && (
            <ul className="submenu">
              {renderSubLink("/beneficiary", <FiberManualRecordIcon style={{ fontSize: '8px' }}  className="icon" />, "Beneficiary Records")}
              {renderSubLink("/training", <FiberManualRecordIcon style={{ fontSize: '8px' }}  className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("inprogress")}>
            <div className="menu-title">
              <ChecklistRtlIcon className="icon" />
              <Badge
                badgeContent={pendingCount.approvalCount}
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
                In-Progress
              </Badge>  </div>
            {openMenu.inprogress ? <ExpandLess /> : <ExpandMore />}

          </li>
          {openMenu.inprogress && (
            <ul className="submenu">
              {renderSubLink("/inprogress", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records")}
              {renderSubLink("/training-in-progress", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("final")}>
            <div className="menu-title">
              <PreviewIcon className="icon" />
              <span>Final Preview</span>

            </div>
            {openMenu.final ? <ExpandLess /> : <ExpandMore />}


          </li>
          {openMenu.final && (
            <ul className="submenu">
              {renderSubLink("/finalpreview", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records")}
              {renderSubLink("/training-final-preview", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

          <li className="menu-header" onClick={() => toggleMenu("rejection")}>
            <div className="menu-title">
              <PlaylistRemoveIcon className="icon" />
              <Badge
                badgeContent={pendingCount.rejectionCount}
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
              </Badge> </div>
            {openMenu.rejection ? <ExpandLess /> : <ExpandMore />}

          </li>
          {openMenu.rejection && (
            <ul className="submenu">
              {renderSubLink("/rejectedList", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Beneficiary Records")}
              {renderSubLink("/training-rejected", <FiberManualRecordIcon style={{ fontSize: '8px' }} className="icon" />, "Training/Other Exp Records")}
            </ul>
          )}

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
