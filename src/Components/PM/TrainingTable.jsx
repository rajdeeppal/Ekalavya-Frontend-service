import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { Button, Table, Collapse, TableContainer, Accordion, AccordionSummary, AccordionDetails, TextField, Modal, Box, Typography, TableHead, TableBody, TableCell, TableRow, IconButton } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as XLSX from 'xlsx';
import Paper from "@mui/material/Paper";
import DownloadIcon from '@mui/icons-material/Download';
import { updateCommonExpTask, updateTrainingTask, submitDetails, bulkSubmitDetails, exportSanctionDetails } from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const TrainingTable = ({ beneficiaries, value, setBeneficiaries, setIsSuccess, showTraining }) => {
    const { userId } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
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

            // Update the state
            setBeneficiaries(updatedBeneficiaries);
        }
    };

    const handleSaveActivity = async (beneficiaryIndex, componentIndex, activityIndex, taskIndex) => {
        // Exit edit mode for this specific task
        setEditActivityMode((prevState) => ({
            ...prevState,
            [`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`]: false,
        }));

        // Clone beneficiaries state
        const updatedBeneficiaries = [...beneficiaries];
        const activity = updatedBeneficiaries[beneficiaryIndex]?.components[componentIndex]?.activities[activityIndex];
        const task = activity.tasks[taskIndex];

        // Auto-calculate total cost if not manually provided
        const calculatedTotalCost =
            task.units && task.ratePerUnit ? parseFloat(task.units) * parseFloat(task.ratePerUnit) : 0;

        // Build payload
        const criteria = {
            taskName: task.taskName,
            ...(showTraining === 'TRAINING_FORM' && {
                maleCount: parseInt(task.maleCount || 0, 10),
                femaleCount: parseInt(task.femaleCount || 0, 10),
                otherCount: parseInt(task.otherCount || 0, 10),
                expertSubject: task.expertSubject || '',
            }),
            ...(showTraining === 'COMMON_EXP_FORM' && { typeOfUnit: task.typeOfUnit || '' }),
            units: parseFloat(task.units) || 0,
            ratePerUnit: parseFloat(task.ratePerUnit) || 0,
            totalCost: calculatedTotalCost,
        };

        console.log("Updated criteria:", criteria);

        try {

            let data;
            const taskId = task.id;
            console.log("Updating task:", taskId);
            if (showTraining === 'TRAINING_FORM') {
                data = await updateTrainingTask(taskId, criteria);
                enqueueSnackbar('Training Form Task updated successfully', { variant: 'success' });
            } else {
                data = await updateCommonExpTask(taskId, criteria);
                enqueueSnackbar('Common Expenditure Form Task updated successfully', { variant: 'success' });
            }

            setIsSuccess(true);

        } catch (error) {
            setIsSuccess(false);
            console.error("Error updating activity:", error);
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
            setIsSuccess(true);
            enqueueSnackbar('Beneficiary have been submitted successfully', { variant: 'success' });
            setShowConfirmation(false);
        } catch (error) {
            setIsSuccess(false);
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
            setIsSuccess(true);
            enqueueSnackbar('Beneficiary have been submitted successfully', { variant: 'success' });
            setShowConfirmation(false);
        } catch (error) {
            setIsSuccess(false);
            console.error('Error fetching activities:', error);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportSanctionDetails(userId, value);
            enqueueSnackbar(data, { variant: 'success' });
            console.log(beneficiaries);
            console.log(beneficiaries);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    };

    return (
        <div style={{ padding: '20px' }} className='listContainer'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>{showTraining === 'TRAINING_FORM' ? 'Training List' : 'Common Expediture List'}</Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
            </div>
            <TableContainer component={Paper} className="table">
                <Table sx={{ minWidth: 650 }} aria-label="beneficiary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            {showTraining === 'TRAINING_FORM' &&
                                <TableCell>Resource Person Name</TableCell>}
                            <TableCell>Activity Code</TableCell>    
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                <TableRow>
                                    <TableCell>{beneficiary.projectName}</TableCell>
                                    {showTraining === 'TRAINING_FORM' && <TableCell>{beneficiary.beneficiaryName}</TableCell>}
                                    <TableCell>{beneficiary.activityCode}</TableCell>
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
                                                                                    {showTraining === 'TRAINING_FORM' &&
                                                                                        <>

                                                                                            <TableCell>Male count</TableCell>
                                                                                            <TableCell>Female count</TableCell>
                                                                                            <TableCell>Other count</TableCell>
                                                                                            <TableCell>Expert Subject Name</TableCell>
                                                                                        </>}
                                                                                    {showTraining === 'COMMON_EXP_FORM' && <TableCell>Type of Unit</TableCell>}
                                                                                    <TableCell>Unit Rate</TableCell>
                                                                                    <TableCell>Unit Balance</TableCell>
                                                                                    <TableCell>Total Cost</TableCell>
                                                                                    {showEdit && <TableCell>Actions</TableCell>}
                                                                                </TableRow>
                                                                            </TableHead>

                                                                            <TableBody>
                                                                                {activity.tasks?.map((task, taskIndex) => (
                                                                                    <TableRow key={task.id}>
                                                                                        {editActivityMode[`${beneficiaryIndex}-${componentIndex}-${activityIndex}-${taskIndex}`] ? (
                                                                                            <>

                                                                                                <TableCell>{task.taskName}</TableCell>


                                                                                                {showTraining === 'TRAINING_FORM' &&
                                                                                                    <>


                                                                                                        {/* Editable Male Count */}
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                name="maleCount"
                                                                                                                value={task.maleCount || ''}
                                                                                                                onChange={(e) =>
                                                                                                                    handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                                }
                                                                                                            />
                                                                                                        </TableCell>

                                                                                                        {/* Editable Female Count */}
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                name="femaleCount"
                                                                                                                value={task.femaleCount || ''}
                                                                                                                onChange={(e) =>
                                                                                                                    handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                                }
                                                                                                            />
                                                                                                        </TableCell>

                                                                                                        {/* Editable Other Count */}
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                name="otherCount"
                                                                                                                value={task.otherCount || ''}
                                                                                                                onChange={(e) =>
                                                                                                                    handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                                }
                                                                                                            />
                                                                                                        </TableCell>

                                                                                                        {/* Editable Expert Subject */}
                                                                                                        <TableCell>
                                                                                                            <TextField
                                                                                                                variant="outlined"
                                                                                                                size="small"
                                                                                                                name="expertSubject"
                                                                                                                value={task.expertSubject || ''}
                                                                                                                onChange={(e) =>
                                                                                                                    handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                                }
                                                                                                            />
                                                                                                        </TableCell>
                                                                                                    </>}
                                                                                                {showTraining === 'COMMON_EXP_FORM' &&

                                                                                                    <TableCell>
                                                                                                        <TextField
                                                                                                            variant="outlined"
                                                                                                            size="small"
                                                                                                            name="typeOfUnit"
                                                                                                            value={task.typeOfUnit || ''}
                                                                                                            onChange={(e) =>
                                                                                                                handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                            }
                                                                                                        />
                                                                                                    </TableCell>}
                                                                                                    

                                                                                                {/* Editable Unit Rate */}
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        name="ratePerUnit"
                                                                                                        value={task.ratePerUnit || ''}
                                                                                                        onChange={(e) =>
                                                                                                            handleActivityInputChange(beneficiaryIndex, componentIndex, activityIndex, taskIndex, e)
                                                                                                        }
                                                                                                    />
                                                                                                </TableCell>

                                                                                                                                                                                                {/* Editable Units */}
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


                                                                                                {/* Auto-calculated Total Cost (readonly or computed) */}
                                                                                                <TableCell>
                                                                                                    <TextField
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        name="totalCost"
                                                                                                        value={task.totalCost || (task.units * task.ratePerUnit) || ''}
                                                                                                        InputProps={{ readOnly: true }}
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
                                                                                                {showTraining === 'TRAINING_FORM' &&
                                                                                                    <>

                                                                                                        <TableCell>{task.maleCount}</TableCell>
                                                                                                        <TableCell>{task.femaleCount}</TableCell>
                                                                                                        <TableCell>{task.otherCount}</TableCell>
                                                                                                        <TableCell>{task.expertSubject}</TableCell>
                                                                                                    </>}
                                                                                                {showTraining === 'COMMON_EXP_FORM' &&
                                                                                                    <TableCell>{task.typeOfUnit}</TableCell>}
                                                                                                <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                <TableCell>{task.units}</TableCell>
                                                                                                <TableCell>{task.totalCost}</TableCell>

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

export default TrainingTable;
