import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import logo from '../../images/logo.png';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span><img src={logo} alt="Logo" className="logo" /></span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li>
            <DashboardIcon className="icon" style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }} />
            <span>Dashboard</span>
          </li>
          <p className="title">BENEFICIARY</p>
          <Link to="/beneficiary" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon"
                style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
              />
              <span>Beneficiary List</span>
            </li>
          </Link>
          <p className="title">IN-PROGRESS</p>
          <Link to="/inprogress" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}/>
              <span>In-Progress List</span>
            </li>
          </Link>
          <Link to="/finalpreview" style={{ textDecoration: "none" }} >
            <li>
              <StoreIcon className="icon"  style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "purple",
            }}/>
              <span>Final Preview</span>
            </li>
          </Link>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" style={{
              backgroundColor: "rgba(128, 0, 128, 0.2)",
              color: "pink",
            }}/>
            <span>Profile</span>
          </li>
          <li>
            <ExitToAppIcon className="icon" style={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "crimson",
            }}/>
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
