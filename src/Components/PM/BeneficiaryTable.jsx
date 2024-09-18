import React, { useState } from 'react';
import { Button, Table, Collapse, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';

const BeneficiaryTable = ({ beneficiaries, setBeneficiaries }) => {
  const [open, setOpen] = useState({});
  const [editActivityMode, setEditActivityMode] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(true);

  const toggleCollapse = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handleEditActivityClick = (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
    setEditActivityMode((prevState) => ({
      ...prevState,
      [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]:
        !prevState[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`],
    }));
  };

  const handleActivityInputChange = (beneficiaryIndex, componentIndex, activityIndex, taskIndex, e) => {
    const { name, value } = e.target;
    const updatedBeneficiaries = [...beneficiaries];

    const activity = updatedBeneficiaries[beneficiaryIndex]?.components[componentIndex]?.activities[activityIndex];
    if (activity && activity.tasks && activity.tasks[taskIndex]) {
      activity.tasks[taskIndex][name] = value;
      setBeneficiaries(updatedBeneficiaries);
    }
  };

  const handleSaveActivity = (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
    setEditActivityMode((prevState) => ({
      ...prevState,
      [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]: false,
    }));
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    setShowEdit(false);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmation(false);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const exportToExcel = () => {
    const formattedData = [];
  
    // Iterate through each beneficiary to format data
    beneficiaries.forEach((beneficiary) => {
      beneficiary.components.forEach((component) => {
        component.activities.forEach((activity) => {
          activity.tasks.forEach((task, taskIndex) => {
            formattedData.push({
              Vertical: taskIndex === 0 && component === beneficiary.components[0] && activity === component.activities[0] ? beneficiary.verticalName : '', // Vertical only on first task of first component/activity
              'Type of Project': taskIndex === 0 && activity === component.activities[0] ? beneficiary.projectType : '', // Type of Project only on first task of first activity
              'Name of the Project': taskIndex === 0 && component === beneficiary.components[0] ? beneficiary.projectName : '', // Project Name only on first task of first component
              Component: taskIndex === 0 ? component.componentName : '', // Component name only on the first task
              Activity: taskIndex === 0 ? activity.activityName : '', // Activity name only on the first task
              Tasks: task.taskName,
              'Type of Unit': task.typeOfUnit,
              'Unit Rate': task.ratePerUnit,
              'No. of Units': task.units,
              'Total Cost Rs.': task.totalCost,
              'Beneficiary Contribution Rs.': task.beneficiaryContribution,
              'Grant Amount (Rs.)': task.grantAmount,
              'Year of Sanction': task.yearOfSanction,
            });
          });
        });
      });
    });
  
    // Creating the worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');
  
    // Writing the file
    XLSX.writeFile(workbook, 'Beneficiaries.xlsx');
  };
  
  return (
    <div>
    <Typography variant="h4" gutterBottom>Beneficiary List</Typography>
    <Button
      variant="contained"
      color="success"
      onClick={exportToExcel}
      sx={{ marginBottom: '10px' }}
    >
      Download Excel
    </Button>
    <Table sx={{ minWidth: 650 }} aria-label="beneficiary table">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Beneficiary Name</th>
          <th>Father/Husband Name</th>
          <th>villageName</th>
          <th>mandalName</th>
          <th>districtName</th>
          <th>State</th>
          <th>Aadhar</th>
          <th>Survey No.</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {beneficiaries.map((beneficiary, beneficiaryIndex) => (
          <React.Fragment key={beneficiary.id}>
            <tr>
              <td>{beneficiary.verticalName}</td>
              <td>{beneficiary.beneficiaryName}</td>
              <td>{beneficiary.guardianName}</td>
              <td>{beneficiary.villageName}</td>
              <td>{beneficiary.mandalName}</td>
              <td>{beneficiary.districtName}</td>
              <td>{beneficiary.state}</td>
              <td>{beneficiary.aadhar}</td>
              <td>{beneficiary.surveyNo}</td>
              <td>
                <Button
                  variant="contained"
                  onClick={() => toggleCollapse(beneficiaryIndex)}
                >
                  View Components
                </Button>
              </td>
            </tr>
            <tr>
              <td colSpan="10" style={{ padding: 0 }}>
                <Collapse in={open[beneficiaryIndex]}>
                  <Box sx={{ padding: '10px' }}>
                    {beneficiary.components?.map((component, componentIndex) => (
                      <div key={component.id}>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={`component-${componentIndex}-content`}
                            id={`component-${componentIndex}-header`}
                          >
                            <Typography>{component.componentName}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {component.activities?.map((activity, activityIndex) => (
                              <div key={activity.id}>
                                <Accordion>
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls={`activity-${activityIndex}-content`}
                                    id={`activity-${activityIndex}-header`}
                                  >
                                    <Typography>{activity.activityName}</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Table aria-label="activity table">
                                      <thead>
                                        <tr>
                                          <th>Name of the Work</th>
                                          <th>Type of Unit</th>
                                          <th>Unit Rate</th>
                                          <th>No. of Units</th>
                                          <th>Total Cost</th>
                                          <th>Beneficiary Contribution</th>
                                          <th>Grant Amount</th>
                                          <th>Year of Sanction</th>
                                          {showEdit && <th>Actions</th>}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {activity.tasks?.map((task, taskIndex) => (
                                          <tr key={task.id}>
                                            {editActivityMode[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`] ? (
                                              <>
                                                <td>{task.taskName}</td>
                                                <td>{task.typeOfUnit}</td>
                                                <td>{task.ratePerUnit}</td>
                                                <td>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="units"
                                                    value={task.units || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="totalCost"
                                                    value={task.totalCost || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="beneficiaryContribution"
                                                    value={task.beneficiaryContribution || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="grantAmount"
                                                    value={task.grantAmount || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="yearOfSanction"
                                                    value={task.yearOfSanction || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex,
                                                        e
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() =>
                                                      handleSaveActivity(
                                                        beneficiaryIndex,
                                                        componentIndex,
                                                        activityIndex,
                                                        taskIndex
                                                      )
                                                    }
                                                  >
                                                    Save
                                                  </Button>
                                                </td>
                                              </>
                                            ) : (
                                              <>
                                                <td>{task.taskName}</td>
                                                <td>{task.typeOfUnit}</td>
                                                <td>{task.ratePerUnit}</td>
                                                <td>{task.units}</td>
                                                <td>{task.totalCost}</td>
                                                <td>{task.beneficiaryContribution}</td>
                                                <td>{task.grantAmount}</td>
                                                <td>{task.yearOfSanction}</td>
                                                {showEdit && (
                                                  <td>
                                                    <Button
                                                      variant="contained"
                                                      color="warning"
                                                      onClick={() =>
                                                        handleEditActivityClick(
                                                          beneficiaryIndex,
                                                          componentIndex,
                                                          activityIndex,
                                                          taskIndex
                                                        )
                                                      }
                                                    >
                                                      Edit
                                                    </Button>
                                                  </td>
                                                )}
                                              </>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </Table>
                                  </AccordionDetails>
                                </Accordion>
                              </div>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    ))}
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleSubmit(beneficiaryIndex)}
                      sx={{ marginTop: '10px' }}
                    >
                      Submit
                    </Button>
                  </Box>
                </Collapse>
              </td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </Table>

    {/* Modal for confirmation */}
    <Modal
      open={showConfirmation}
      onClose={handleCloseConfirmation}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography id="confirmation-modal-title" variant="h6" component="h2">
          Confirm Submission
        </Typography>
        <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
          Do you want to submit the changes?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="secondary" onClick={handleCloseConfirmation} sx={{ marginRight: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmSubmit}>
            Yes, Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  </div>
  );
};

export default BeneficiaryTable;
