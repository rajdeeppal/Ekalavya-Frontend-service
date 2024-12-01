import React, { useState } from 'react';
import { Button, Table, Collapse, TableContainer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, Box, Typography, TableHead, TableBody, TableCell, TableRow, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';
import Paper from "@mui/material/Paper";
import DownloadIcon from '@mui/icons-material/Download';
import { updateActivityTask, submitDetails } from '../DataCenter/apiService';

const BeneficiaryTable = ({ beneficiaries, setBeneficiaries }) => {
  const [open, setOpen] = useState({});
  const [editActivityMode, setEditActivityMode] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [isBulk, setIsBulk] = useState(false);

  const toggleCollapse = (index) => {
    setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
  };

  const handleEditActivityClick = async (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
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

  const handleSaveActivity = async (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
    setEditActivityMode((prevState) => ({
      ...prevState,
      [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]: false,
    }));

    const updatedBeneficiaries = [...beneficiaries];
    const activity = updatedBeneficiaries[beneficiaryIndex]?.components[componentIndex]?.activities[activityIndex];

    const task = activity.tasks[taskIndex];
    const criteria = {
      taskName: task.taskName,
      beneficiaryContribution: parseFloat(task.beneficiaryContribution),
      grantAmount: parseFloat(task.grantAmount),
      // nameOfWork: task.nameOfWork,
      units: parseInt(task.units, 10),
      totalCost: parseFloat(task.totalCost),
      typeOfUnit: task.typeOfUnit,
      ratePerUnit: parseFloat(task.ratePerUnit),
      yearOfSanction: parseInt(task.yearOfSanction, 10),
    }

    console.log(criteria);
    try {
      const taskId = task.id;
      console.log(taskId);
      const data = await updateActivityTask(taskId, criteria);
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleSubmit = () => {
    setShowConfirmation(true);
    setShowEdit(false);
  };

  const handleBulkSubmit = () => {
    setShowConfirmation(true);
    setShowEdit(false);
    setIsBulk(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      console.log(beneficiaries);
      await submitDetails(...beneficiaries);
      alert("Beneficiary have been submitted successfully");
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleBulkConfirmSubmit = async () => {
    try {
      console.log(beneficiaries);
      await submitDetails(...beneficiaries);
      alert("Beneficiary have been submitted successfully");
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const exportToExcel = () => {
    const formattedData = [];

    beneficiaries.forEach((beneficiary) => {
      beneficiary.components.forEach((component) => {
        component.activities.forEach((activity) => {
          activity.tasks.forEach((task, taskIndex) => {
            formattedData.push({
              Vertical: taskIndex === 0 && component === beneficiary.components[0] && activity === component.activities[0] ? beneficiary.verticalName : '',
              'Type of Project': taskIndex === 0 && activity === component.activities[0] ? beneficiary.projectType : '',
              'Name of the Project': taskIndex === 0 && component === beneficiary.components[0] ? beneficiary.projectName : '',
              Component: taskIndex === 0 ? component.componentName : '',
              Activity: taskIndex === 0 ? activity.activityName : '',
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

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Beneficiaries');
    XLSX.writeFile(workbook, 'Beneficiaries.xlsx');
  };

  return (
    <div style={{ padding: '20px' }} className='listContainer'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#888' }}>Beneficiary List</Typography>

        <IconButton onClick={exportToExcel}>
          <DownloadIcon />
        </IconButton>
      </div>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="beneficiary table">
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Beneficiary Name</TableCell>
              <TableCell>Father/Husband Name</TableCell>
              <TableCell>Village</TableCell>
              <TableCell>Mandal</TableCell>
              <TableCell>District</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Aadhar Number</TableCell>
              <TableCell>Survey No.</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {beneficiaries.map((beneficiary, beneficiaryIndex) => (
              <React.Fragment key={beneficiary.id}>
                <TableRow>
                  <TableCell>{beneficiary.projectName}</TableCell>
                  <TableCell>{beneficiary.beneficiaryName}</TableCell>
                  <TableCell>{beneficiary.guardianName}</TableCell>
                  <TableCell>{beneficiary.villageName}</TableCell>
                  <TableCell>{beneficiary.mandalName}</TableCell>
                  <TableCell>{beneficiary.districtName}</TableCell>
                  <TableCell>{beneficiary.stateName}</TableCell>
                  <TableCell>{beneficiary.aadharNumber}</TableCell>
                  <TableCell>{beneficiary.surveyNumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleCollapse(beneficiaryIndex)}
                      sx={{ textTransform: 'none' }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan="10" style={{ padding: 0 }}>
                    <Collapse in={open[beneficiaryIndex]}>
                      <Box sx={{ padding: '20px' }}>
                        {beneficiary.components?.map((component, componentIndex) => (
                          <Accordion key={component.id} >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>{component.componentName}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {component.activities?.map((activity, activityIndex) => (
                                <Accordion key={activity.id} sx={{ marginBottom: '10px' }}>
                                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography>{activity.activityName}</Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Table aria-label="activity table" sx={{ borderSpacing: '0 10px' }}>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Name of the Work</TableCell>
                                          <TableCell>Type of Unit</TableCell>
                                          <TableCell>Unit Rate</TableCell>
                                          <TableCell>No. of Units</TableCell>
                                          <TableCell>Total Cost</TableCell>
                                          <TableCell>Beneficiary Contribution</TableCell>
                                          <TableCell>Grant Amount</TableCell>
                                          <TableCell>Year of Sanction</TableCell>
                                          {showEdit && <TableCell>Actions</TableCell>}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {activity.tasks?.map((task, taskIndex) => (
                                          <TableRow key={task.id}>
                                            {editActivityMode[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`] ? (
                                              <>
                                                <TableCell>{task.taskName}</TableCell>
                                                <TableCell>{task.typeOfUnit}</TableCell>
                                                <TableCell>{task.ratePerUnit}</TableCell>
                                                <TableCell>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="units"
                                                    value={task.units || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="totalCost"
                                                    value={task.totalCost || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="beneficiaryContribution"
                                                    value={task.beneficiaryContribution || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="grantAmount"
                                                    value={task.grantAmount || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <TextField
                                                    variant="outlined"
                                                    size="small"
                                                    name="yearOfSanction"
                                                    value={task.yearOfSanction || ''}
                                                    onChange={(e) =>
                                                      handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    }
                                                  />
                                                </TableCell>
                                                <TableCell>
                                                  <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={() =>
                                                      handleSaveActivity(beneficiaryIndex, componentIndex, activityIndex, taskIndex)
                                                    }
                                                  >
                                                    Save
                                                  </Button>
                                                </TableCell>
                                              </>
                                            ) : (
                                              <>
                                                <TableCell>{task.taskName}</TableCell>
                                                <TableCell>{task.typeOfUnit}</TableCell>
                                                <TableCell>{task.ratePerUnit}</TableCell>
                                                <TableCell>{task.units}</TableCell>
                                                <TableCell>{task.totalCost}</TableCell>
                                                <TableCell>{task.beneficiaryContribution}</TableCell>
                                                <TableCell>{task.grantAmount}</TableCell>
                                                <TableCell>{task.yearOfSanction}</TableCell>
                                                {showEdit && (
                                                  <TableCell>
                                                    <Button
                                                      variant="contained"
                                                      color="primary"
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
                                                  </TableCell>
                                                )}
                                              </>
                                            )}
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </AccordionDetails>
                                </Accordion>
                              ))}
                            </AccordionDetails>
                          </Accordion>
                        ))}

                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSubmit()}
                          sx={{ marginTop: '10px' }}
                        >
                          Submit
                        </Button>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" onClick={() => handleSubmit()}>
        Bulk Submit
      </Button>
      <Modal
        open={showConfirmation}
        onClose={handleCloseConfirmation}
        aria-labelledby="confirmation-modal"
        aria-describedby="confirmation-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '8px',
          }}
        >
          <Typography id="confirmation-modal-title" variant="h6" component="h2">
            Submit Confirmation
          </Typography>
          <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to submit the data?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={isBulk ? handleBulkConfirmSubmit : handleConfirmSubmit}>
              Yes
            </Button>
            <Button variant="contained" color="secondary" onClick={handleCloseConfirmation}>
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default BeneficiaryTable;
