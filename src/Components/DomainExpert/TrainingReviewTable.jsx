import React, { useState } from "react";
import { useSnackbar } from "notistack";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  IconButton,
  Typography,
  Box,
  Modal,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Reviews,
} from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import Avatar from "@mui/material/Avatar";
import DownloadIcon from "@mui/icons-material/Download";
import { useAuth } from "../PrivateRoute";
import * as XLSX from "xlsx";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import {
  updatedResubmitSubTask,
  approveDomainDetails,
  rejectDomainDetails,
} from "../DataCenter/apiService";

function TrainingReviewTable({
  beneficiaries,
  setBeneficiaries,
  isReview,
  setIsSucess,
  isCEO,
  showTraining,
}) {
  const { userId } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [remarks, setRemarks] = useState("");
  const [open, setOpen] = useState({});
  const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
  const [comments, setComments] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [showViewConfirmation, setShowViewConfirmation] = useState(false);
  const [newTask, setNewTask] = useState(true);

  const toggleEditMode = (taskIndex, rowIndex) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [`${taskIndex}-${rowIndex}`]: !prevEditMode[`${taskIndex}-${rowIndex}`],
    }));
  };

  const toggleCollapse = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const toggleTaskDetails = (taskIndex) => {
    setTaskDetailsOpen((prevState) => ({
      ...prevState,
      [taskIndex]: !prevState[taskIndex],
    }));
  };

  const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleCloseViewConfirmation = () => {
    setShowViewConfirmation(false);
  };

  const handleInputChange = (taskIndex, rowIndex, field, value) => {
    setBeneficiaries((prevBeneficiaries) => {
      return prevBeneficiaries.map((beneficiary) => ({
        ...beneficiary,
        components: beneficiary.components.map((component) => ({
          ...component,
          activities: component.activities.map((activity) => ({
            ...activity,
            tasks: activity.tasks.map((task) => {
              if (task.id === taskIndex) {
                const updatedTaskUpdates = [...task.taskUpdates];
                const updatedRow = {
                  ...updatedTaskUpdates[rowIndex],
                  [field]: value,
                };
                console.log(field);

                updatedTaskUpdates[rowIndex] = updatedRow;

                return { ...task, taskUpdates: updatedTaskUpdates };
              }
              return task;
            }),
          })),
        })),
      }));
    });
  };

  const handleSave = async (action, taskId, rowId, rowIndex) => {
    const task = beneficiaries
      .flatMap((b) =>
        b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks))
      )
      .find((t, i) => t.id === taskId);
    const changedData = task.taskUpdates[rowIndex];
    console.log(taskId);
    if (action === "Approve") {
      try {
        await approveDomainDetails(userId, rowId, changedData.remarks);
        setIsSucess(true);
        console.log(
          "User ID:",
          userId,
          "Row ID:",
          rowId,
          "Remarks:",
          changedData.remarks
        );
        alert("Tasks have been approved successfully");
      } catch (error) {
        console.error("Error approving tasks:", error);
        setIsSucess(true);
        enqueueSnackbar(
          "An error occurred while approving the tasks. Please try again.",
          { variant: "error" }
        );
      }
    } else {
      try {
        await rejectDomainDetails(userId, rowId, changedData.remarks);
        setIsSucess(true);
        console.log(
          "User ID:",
          userId,
          "Row ID:",
          rowId,
          "Remarks:",
          changedData.remarks
        );
        alert("Tasks have been rejected successfully");
      } catch (error) {
        console.error("Error tasks:", error);
        setIsSucess(true);
        const backendErrors =
          error.response?.data ||
          "An error occurred while rejecting the tasks. Please try again.";
        alert(backendErrors);
      }
    }
  };

  const toggleViewMode = (comments) => {
    setShowViewConfirmation(true);
    setComments(comments);
  };

  const handleReview = async (action, taskId, rowId, rowIndex) => {
    const task = beneficiaries
      .flatMap((b) =>
        b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks))
      )
      .find((t, i) => t.id === taskId);
    const changedData = task.taskUpdates[rowIndex];
    console.log(taskId);

    try {
      await updatedResubmitSubTask(userId, rowId, changedData.remarks);
      console.log(
        "User ID:",
        userId,
        "Row ID:",
        rowId,
        "Remarks:",
        changedData.remarks
      );
      setIsSucess(true);
      enqueueSnackbar("Tasks have been approved successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error approving tasks:", error);
      setIsSucess(true);
      const backendErrors =
        error.response?.data ||
        "An error occurred while approving the tasks. Please try again.";
      alert(backendErrors);
    }
  };
  return (
    <div style={{ padding: "20px" }} className="listContainer">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "#888" }}>
          Task List
        </Typography>
      </div>
      <TableContainer component={Paper}>
        <Table aria-label="beneficiary table">
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              {showTraining === "TRAINING_FORM" && (
                <TableCell>Resource Person Name</TableCell>
              )}
              {showTraining === "TRAINING_FORM" && (
                <TableCell>Training Name</TableCell>
              )}
              {showTraining === "COMMON_EXP_FORM" && (
                <TableCell>Description</TableCell>
              )}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
              <React.Fragment key={beneficiary.id}>
                <TableRow>
                  <TableCell>{beneficiary.projectName}</TableCell>
                  {showTraining === "TRAINING_FORM" && (
                    <TableCell>{beneficiary.beneficiaryName}</TableCell>
                  )}
                  <TableCell>{beneficiary.activityCode}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleCollapse(beneficiaryIndex)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={10} style={{ padding: 0 }}>
                    <Collapse
                      in={open[beneficiaryIndex]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <div style={{ padding: "10px" }}>
                        {beneficiary.components?.map((component) => (
                          <div key={component.id}>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`component-content-${component.id}`}
                                id={`component-header-${component.id}`}
                              >
                                <Typography>
                                  {component.componentName}
                                </Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {component.activities?.map((activity) => (
                                  <div key={activity.id}>
                                    <Accordion>
                                      <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls={`activity-content-${activity.id}`}
                                        id={`activity-header-${activity.id}`}
                                      >
                                        <Typography>
                                          {activity.activityName}
                                        </Typography>
                                      </AccordionSummary>
                                      <AccordionDetails>
                                        <TableContainer
                                          component={Paper}
                                          sx={{
                                            mb: 2,
                                            overflowX: "auto",
                                            maxWidth: "100%",
                                          }}
                                        >
                                          <Table
                                            size="small"
                                            aria-label="tasks table"
                                          >
                                            <TableBody>
                                              {activity.tasks?.map((task, taskIndex) => (
                                                <React.Fragment key={task.id}>

                                                  {/* ===== TRAINING FORM ===== */}
                                                  {showTraining === "TRAINING_FORM" && (
                                                    <>
                                                      {/* HEADER 1 */}
                                                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                        <TableCell>Name of the Work</TableCell>
                                                        <TableCell>Male</TableCell>
                                                        <TableCell>Female</TableCell>
                                                        <TableCell>Other</TableCell>
                                                        <TableCell>Duration</TableCell>
                                                        <TableCell>Category</TableCell>
                                                        <TableCell>Venue</TableCell>
                                                        <TableCell>Time From</TableCell>
                                                        <TableCell>Time To</TableCell>
                                                      </TableRow>

                                                      {/* VALUE 1 */}
                                                      <TableRow>
                                                        <TableCell>{task.taskName}</TableCell>
                                                        <TableCell>{task.maleCount}</TableCell>
                                                        <TableCell>{task.femaleCount}</TableCell>
                                                        <TableCell>{task.otherCount}</TableCell>
                                                        <TableCell>{task.trainingDuration}</TableCell>
                                                        <TableCell>{task.participantCategory}</TableCell>
                                                        <TableCell>{task.venue}</TableCell>
                                                        <TableCell>{formatDateTime(task.timeFrom)}</TableCell>
                                                        <TableCell>{formatDateTime(task.timeTo)}</TableCell>
                                                      </TableRow>

                                                      {/* HEADER 2 */}
                                                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                        <TableCell>Expert Subject</TableCell>
                                                        <TableCell>Unit Rate</TableCell>
                                                        <TableCell>Sanction Units</TableCell>
                                                        <TableCell>Unit Balance</TableCell>
                                                        <TableCell>Total Cost</TableCell>
                                                        <TableCell>Remain Amount</TableCell>
                                                        <TableCell colSpan={3}>Actions</TableCell>
                                                      </TableRow>

                                                      {/* VALUE 2 */}
                                                      <TableRow>
                                                        <TableCell>{task.expertSubject}</TableCell>
                                                        <TableCell>{task.ratePerUnit}</TableCell>
                                                        <TableCell>{task.units}</TableCell>
                                                        <TableCell>{task.unitRemain}</TableCell>
                                                        <TableCell>{task.totalCost}</TableCell>
                                                        <TableCell>{task.balanceRemaining}</TableCell>
                                                        <TableCell colSpan={3}>
                                                          <Button
                                                            variant="outlined"
                                                            onClick={() => toggleTaskDetails(taskIndex)}
                                                          >
                                                            View
                                                          </Button>
                                                        </TableCell>
                                                      </TableRow>
                                                    </>
                                                  )}
                                                  {showTraining === "COMMON_EXP_FORM" && (
                                                    <>
                                                      {/* COMMON EXP HEADER */}
                                                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                                        <TableCell>Name of the Work</TableCell>
                                                        <TableCell>Type of Unit</TableCell>
                                                        <TableCell>Unit Rate</TableCell>
                                                        <TableCell>Sanction Units</TableCell>
                                                        <TableCell>Unit Balance</TableCell>
                                                        <TableCell>Total Cost</TableCell>
                                                        <TableCell>Community Contribution Balance</TableCell>
                                                        <TableCell>Remain Amount</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                      </TableRow>

                                                      {/* COMMON EXP VALUE */}
                                                      <TableRow>
                                                        <TableCell>{task.taskName}</TableCell>
                                                        <TableCell>{task.typeOfUnit}</TableCell>
                                                        <TableCell>{task.ratePerUnit}</TableCell>
                                                        <TableCell>{task.units}</TableCell>
                                                        <TableCell>{task.unitRemain}</TableCell>
                                                        <TableCell>{task.totalCost}</TableCell>
                                                        <TableCell>{task.beneficiaryContributionRemain}</TableCell>
                                                        <TableCell>{task.balanceRemaining}</TableCell>
                                                        <TableCell>
                                                          <Button
                                                            variant="outlined"
                                                            onClick={() => toggleTaskDetails(taskIndex)}
                                                          >
                                                            View
                                                          </Button>
                                                        </TableCell>
                                                      </TableRow>
                                                    </>
                                                  )}

                                                    <TableRow>
                                                      <TableCell
                                                        colSpan={9}
                                                        style={{ padding: 0 }}
                                                      >
                                                        <Collapse
                                                          in={
                                                            taskDetailsOpen[
                                                              taskIndex
                                                            ]
                                                          }
                                                          timeout="auto"
                                                          unmountOnExit
                                                        >
                                                          <div
                                                            style={{
                                                              padding: "10px",
                                                            }}
                                                          >
                                                            <TableContainer
                                                              component={Paper}
                                                              sx={{ mb: 2 }}
                                                            >
                                                              <Table
                                                                size="small"
                                                                aria-label="task details table"
                                                              >
                                                                <TableHead
                                                                  sx={{
                                                                    position:
                                                                      "sticky",
                                                                    top: 0,
                                                                    backgroundColor:
                                                                      "#fafafa",
                                                                    zIndex: 1,
                                                                  }}
                                                                >
                                                                  <TableRow>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 120,
                                                                      }}
                                                                    >
                                                                      Unit
                                                                      Achievement
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 130,
                                                                      }}
                                                                    >
                                                                      Discounted
                                                                      Rate
                                                                    </TableCell>

                                                                    {showTraining ===
                                                                      "COMMON_EXP_FORM" && (
                                                                      <TableCell
                                                                        sx={{
                                                                          minWidth: 160,
                                                                        }}
                                                                      >
                                                                        Community
                                                                        Contribution
                                                                      </TableCell>
                                                                    )}

                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 120,
                                                                      }}
                                                                    >
                                                                      Current
                                                                      Cost
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 150,
                                                                      }}
                                                                    >
                                                                      Procurement
                                                                      Check
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 140,
                                                                      }}
                                                                    >
                                                                      Payee Name
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 160,
                                                                      }}
                                                                    >
                                                                      Account
                                                                      Details
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 160,
                                                                      }}
                                                                    >
                                                                      Passbook
                                                                      Copy
                                                                    </TableCell>
                                                                    <TableCell
                                                                      sx={{
                                                                        minWidth: 180,
                                                                      }}
                                                                    >
                                                                      Other
                                                                      Document
                                                                    </TableCell>

                                                                    <TableCell>
                                                                      Reviews
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      Remarks
                                                                    </TableCell>
                                                                    <TableCell>
                                                                      Actions
                                                                    </TableCell>
                                                                  </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                  {(
                                                                    task.taskUpdates ||
                                                                    []
                                                                  ).map(
                                                                    (
                                                                      row,
                                                                      rowIndex
                                                                    ) => (
                                                                      <TableRow
                                                                        key={
                                                                          rowIndex
                                                                        }
                                                                      >
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 120,
                                                                          }}
                                                                        >
                                                                          {
                                                                            row.achievementUnit
                                                                          }
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 130,
                                                                          }}
                                                                        >
                                                                          {
                                                                            row.revisedRatePerUnit
                                                                          }
                                                                        </TableCell>
                                                                        {showTraining ===
                                                                          "COMMON_EXP_FORM" && (
                                                                          <TableCell
                                                                            sx={{
                                                                              minWidth: 160,
                                                                            }}
                                                                          >
                                                                            {
                                                                              row.currentBeneficiaryContribution
                                                                            }
                                                                          </TableCell>
                                                                        )}
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 120,
                                                                          }}
                                                                        >
                                                                          {
                                                                            row.currentCost
                                                                          }
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 150,
                                                                          }}
                                                                        >
                                                                          <Checkbox
                                                                            checked={
                                                                              row.procurementCheck ||
                                                                              false
                                                                            }
                                                                            disabled
                                                                          />
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 140,
                                                                          }}
                                                                        >
                                                                          {
                                                                            row.payeeName
                                                                          }
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 160,
                                                                          }}
                                                                        >
                                                                          {
                                                                            row.accountNumber
                                                                          }
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 160,
                                                                          }}
                                                                          l
                                                                        >
                                                                          {row.passbookDoc ? (
                                                                            <a
                                                                              href={
                                                                                row
                                                                                  .passbookDoc
                                                                                  .downloadUrl
                                                                              }
                                                                              download={
                                                                                row
                                                                                  .passbookDoc
                                                                                  .downloadUrl
                                                                              }
                                                                              style={{
                                                                                textDecoration:
                                                                                  "underline",
                                                                                color:
                                                                                  "blue",
                                                                              }}
                                                                            >
                                                                              {
                                                                                row
                                                                                  .passbookDoc
                                                                                  .fileName
                                                                              }
                                                                            </a>
                                                                          ) : (
                                                                            <Typography>
                                                                              No
                                                                              Image
                                                                            </Typography>
                                                                          )}
                                                                        </TableCell>
                                                                        <TableCell
                                                                          sx={{
                                                                            minWidth: 180,
                                                                          }}
                                                                        >
                                                                          {row.otherDocs &&
                                                                          row
                                                                            .otherDocs
                                                                            .length >
                                                                            0 ? (
                                                                            row.otherDocs.map(
                                                                              (
                                                                                file,
                                                                                idx
                                                                              ) => (
                                                                                <div
                                                                                  key={
                                                                                    idx
                                                                                  }
                                                                                >
                                                                                  <a
                                                                                    href={
                                                                                      file.downloadUrl
                                                                                    }
                                                                                    download={
                                                                                      file.downloadUrl
                                                                                    }
                                                                                    style={{
                                                                                      textDecoration:
                                                                                        "underline",
                                                                                      color:
                                                                                        "blue",
                                                                                    }}
                                                                                  >
                                                                                    {
                                                                                      file.fileName
                                                                                    }
                                                                                  </a>
                                                                                </div>
                                                                              )
                                                                            )
                                                                          ) : (
                                                                            <Typography>
                                                                              No
                                                                              File
                                                                              Uploaded
                                                                            </Typography>
                                                                          )}
                                                                        </TableCell>
                                                                        {/*<TableCell>{row.domainExpertEmpId}</TableCell>*/}
                                                                        <TableCell>
                                                                          <IconButton
                                                                            color={
                                                                              "primary"
                                                                            }
                                                                            onClick={() =>
                                                                              toggleViewMode(
                                                                                row.comments
                                                                              )
                                                                            }
                                                                          >
                                                                            <RemoveRedEyeOutlinedIcon />
                                                                          </IconButton>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          <TextField
                                                                            variant="outlined"
                                                                            size="small"
                                                                            name="remarks"
                                                                            value={
                                                                              row.remarks ||
                                                                              ""
                                                                            }
                                                                            onChange={(
                                                                              e
                                                                            ) =>
                                                                              handleInputChange(
                                                                                task.id,
                                                                                rowIndex,
                                                                                "remarks",
                                                                                e
                                                                                  .target
                                                                                  .value
                                                                              )
                                                                            }
                                                                          />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                          <Box
                                                                            sx={{
                                                                              display:
                                                                                "flex",
                                                                              gap: 0.5,
                                                                            }}
                                                                          >
                                                                            <Button
                                                                              variant="contained"
                                                                              color="success"
                                                                              onClick={() => {
                                                                                isReview
                                                                                  ? handleReview(
                                                                                      "Approve",
                                                                                      task.id,
                                                                                      row.id,
                                                                                      rowIndex
                                                                                    )
                                                                                  : handleSave(
                                                                                      "Approve",
                                                                                      task.id,
                                                                                      row.id,
                                                                                      rowIndex
                                                                                    );
                                                                              }}
                                                                            >
                                                                              Approve
                                                                            </Button>
                                                                            {!isCEO && (
                                                                              <Button
                                                                                variant="contained"
                                                                                color="error"
                                                                                onClick={() =>
                                                                                  handleSave(
                                                                                    "Reject",
                                                                                    task.id,
                                                                                    row.id,
                                                                                    rowIndex
                                                                                  )
                                                                                }
                                                                              >
                                                                                Reject
                                                                              </Button>
                                                                            )}
                                                                          </Box>
                                                                        </TableCell>
                                                                      </TableRow>
                                                                    )
                                                                  )}
                                                                </TableBody>
                                                              </Table>
                                                            </TableContainer>
                                                          </div>
                                                        </Collapse>
                                                      </TableCell>
                                                    </TableRow>
                                                  </React.Fragment>
                                                )
                                              )}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                      </AccordionDetails>
                                    </Accordion>
                                  </div>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ))}
                      </div>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={showViewConfirmation}
        onClose={handleCloseViewConfirmation}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}
          >
            Comments
          </Typography>
          <div
            className="comment-section"
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              padding: "8px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              background: "#f9f9f9",
            }}
          >
            {comments !== null ? (
              <>
                {comments?.map((comment, id) => (
                  <div
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      marginBottom: "16px",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          comment.role === "Admin"
                            ? "primary.main"
                            : "secondary.main",
                        mr: 2,
                      }}
                    >
                      {comment.role.charAt(0)}
                    </Avatar>
                    <div>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        {comment.role}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        {comment.message}
                      </Typography>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>No Remarks found</>
            )}
          </div>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <button
              style={{
                padding: "8px 16px",
                backgroundColor: "#d32f2f",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleCloseViewConfirmation}
            >
              Close
            </button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default TrainingReviewTable;