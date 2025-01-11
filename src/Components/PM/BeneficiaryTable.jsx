import React, { useState, useEffect } from 'react';
import { Button, Table, Collapse, TableContainer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, Box, Typography, TableHead, TableBody, TableCell, TableRow, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';
import Paper from "@mui/material/Paper";
import DownloadIcon from '@mui/icons-material/Download';
import { updateActivityTask, submitDetails, bulkSubmitDetails } from '../DataCenter/apiService';

const BeneficiaryTable = ({ beneficiaries, setBeneficiaries, setIsSucess }) => {
  const [open, setOpen] = useState({});
  const [editActivityMode, setEditActivityMode] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEdit, setShowEdit] = useState(true);
  const [isBulk, setIsBulk] = useState(false);
  const [id, setId] = useState('');




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

    // Create a deep copy of the beneficiaries array to avoid mutation
    const updatedBeneficiaries = [...beneficiaries];

    const task =
      updatedBeneficiaries[beneficiaryIndex]?.components[componentIndex]?.activities[activityIndex]?.tasks[taskIndex];

    if (task) {
      // Update the specific field in the task
      task[name] = value;

      // Recalculate totalCost when ratePerUnit or noOfUnits change
      if (name === 'ratePerUnit' || name === 'units') {
        const ratePerUnit = name === 'ratePerUnit' ? parseFloat(value) || 0 : parseFloat(task.ratePerUnit) || 0;
        const units = name === 'units' ? parseFloat(value) || 0 : parseFloat(task.units) || 0;

        // Calculate totalCost
        if (ratePerUnit && units) {
          task.totalCost = ratePerUnit * units;
        }

      }

      // Recalculate grantAmount when beneficiaryContribution or totalCost changes
      if (name === 'beneficiaryContribution' || name === 'totalCost' || name === 'units') {
        const beneficiaryContribution =
          name === 'beneficiaryContribution' ? parseFloat(value) || 0 : parseFloat(task.beneficiaryContribution) || 0;
        const totalCost = name === 'totalCost' ? parseFloat(value) || 0 : parseFloat(task.totalCost) || 0;

        // Calculate grantAmount
        
          task.grantAmount = totalCost - beneficiaryContribution;
        

      }

      // Update the state
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
      // setBeneficiaries(Array.isArray(data) ? data : []);
      setIsSucess(true)
      alert("Activites are submitted successfully");
    } catch (error) {
      setIsSucess(true);
      console.error('Error fetching activities:', error);
    }
  };

  const handleSubmit = (index) => {
    setId(index);
    setShowConfirmation(true);
    setShowEdit(false);
    setIsBulk(false);
  };

  const handleBulkSubmit = () => {
    setShowConfirmation(true);
    setShowEdit(false);
    setIsBulk(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      console.log(id)
      const data = beneficiaries.find((beneficiary) => beneficiary.id === id)
      console.log("submit", data);
      await submitDetails(data);
      setIsSucess(true);
      alert("Beneficiary have been submitted successfully");
      setShowConfirmation(false);
    } catch (error) {
      setIsSucess(true);
      console.error('Error fetching activities:', error);
    }
  };

  const handleBulkConfirmSubmit = async () => {
    try {
      console.log("bulk", beneficiaries);
      const data = {
        "beneficiaries": beneficiaries
      }
      await bulkSubmitDetails(data);
      setIsSucess(true);
      alert("Beneficiary have been submitted successfully");
      setShowConfirmation(false);
    } catch (error) {
      setIsSucess(true);
      console.error('Error fetching activities:', error);
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };


  return (
    <div style={{ padding: '20px' }} className='listContainer'>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#888' }}>Beneficiary List</Typography>
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
                                                    // onChange={(e) =>
                                                    //   handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    // }
                                                    readonly
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
                                                    // onChange={(e) =>
                                                    //   handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                    // }
                                                    readonly
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
                          onClick={() => handleSubmit(beneficiary.id)}
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
      <Button variant="contained" color="primary" onClick={() => handleBulkSubmit()}>
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
