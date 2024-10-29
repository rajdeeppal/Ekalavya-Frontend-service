import React, { useState } from 'react';
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
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { updatedBeneficiarySubTask } from '../DataCenter/apiService';

const FinalReviewList = ({ beneficiaries, setBeneficiaries }) => {
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});
    const [newTask, setNewTask] = useState(false);

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

    const exportToExcel = () => {
        const formattedData = [];

        beneficiaries.forEach((beneficiary) => {
            beneficiary.components.forEach((component) => {
                component.activities.forEach((activity) => {
                    activity.tasks.forEach((task, taskIndex) => {
                        formattedData.push({
                            Vertical:
                                taskIndex === 0 &&
                                    component === beneficiary.components[0] &&
                                    activity === component.activities[0]
                                    ? beneficiary.verticalName
                                    : '',
                            'Type of Project':
                                taskIndex === 0 && activity === component.activities[0]
                                    ? beneficiary.projectType
                                    : '',
                            'Name of the Project':
                                taskIndex === 0 && component === beneficiary.components[0]
                                    ? beneficiary.projectName
                                    : '',
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

                        if (task.taskUpdates) {
                            task.taskUpdates.forEach((row) => {
                                formattedData.push({
                                    Vertical: '',
                                    'Type of Project': '',
                                    'Name of the Project': '',
                                    Component: '',
                                    Activity: '',
                                    Tasks: '',
                                    'Type of Unit': '',
                                    'Unit Rate': '',
                                    'No. of Units': '',
                                    'Total Cost Rs.': '',
                                    'Beneficiary Contribution Rs.': '',
                                    'Grant Amount (Rs.)': '',
                                    'Year of Sanction': '',
                                    'Unit Achievement': row.achievementUnit,
                                    'Remaining Balance': row.remainingBalance,
                                    Duration: row.duration,
                                    'Payee Name': row.payeeName,
                                    'Passbook Copy': row.passbookCopy,
                                });
                            });
                        }
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
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>
                    Task List
                </Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
                {/* <Button
                    variant="contained"
                    color="success"
                    onClick={exportToExcel}
                    style={{ marginBottom: '10px' }}
                >
                    Download Excel
                </Button> */}
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="beneficiary table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project Name</TableCell>
                            <TableCell>Beneficiary Name</TableCell>
                            <TableCell>Father/Husband Name</TableCell>
                            <TableCell>Village Name</TableCell>
                            <TableCell>Mandal Name</TableCell>
                            <TableCell>District Name</TableCell>
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
                                    <TableCell>{beneficiary.verticalName}</TableCell>
                                    <TableCell>{beneficiary.beneficiaryName}</TableCell>
                                    <TableCell>{beneficiary.guardianName}</TableCell>
                                    <TableCell>{beneficiary.villageName}</TableCell>
                                    <TableCell>{beneficiary.mandalName}</TableCell>
                                    <TableCell>{beneficiary.districtName}</TableCell>
                                    <TableCell>{beneficiary.state}</TableCell>
                                    <TableCell>{beneficiary.aadharNumber}</TableCell>
                                    <TableCell>{beneficiary.surveyNumber}</TableCell>
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
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <div style={{ padding: '10px' }}>
                                                {beneficiary.components?.map((component) => (
                                                    <div key={component.id}>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`component-content-${component.id}`}
                                                                id={`component-header-${component.id}`}
                                                            >
                                                                <Typography>{component.componentName}</Typography>
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
                                                                                <Typography>{activity.activityName}</Typography>
                                                                            </AccordionSummary>
                                                                            <AccordionDetails>
                                                                                <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                                    <Table size="small" aria-label="tasks table">
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
                                                                                                <TableCell>Actions</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <TableRow>
                                                                                                        <TableCell>{task.taskName}</TableCell>
                                                                                                        <TableCell>{task.typeOfUnit}</TableCell>
                                                                                                        <TableCell>{task.ratePerUnit}</TableCell>
                                                                                                        <TableCell>{task.units}</TableCell>
                                                                                                        <TableCell>{task.totalCost}</TableCell>
                                                                                                        <TableCell>{task.beneficiaryContribution}</TableCell>
                                                                                                        <TableCell>{task.grantAmount}</TableCell>
                                                                                                        <TableCell>{task.yearOfSanction}</TableCell>
                                                                                                        <TableCell>
                                                                                                            <Button
                                                                                                                variant="outlined"
                                                                                                                color="primary"
                                                                                                                onClick={() => toggleTaskDetails(taskIndex)}

                                                                                                            >
                                                                                                                View
                                                                                                            </Button>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                    <TableRow>
                                                                                                        <TableCell colSpan={9} style={{ padding: 0 }}>
                                                                                                            <Collapse
                                                                                                                in={taskDetailsOpen[taskIndex]}
                                                                                                                timeout="auto"
                                                                                                                unmountOnExit
                                                                                                            >
                                                                                                                <div style={{ padding: '10px' }}>
                                                                                                                    <TableContainer component={Paper} sx={{ mb: 2 }}>
                                                                                                                        <Table size="small" aria-label="task details table">
                                                                                                                            <TableHead>
                                                                                                                                <TableRow>
                                                                                                                                    <TableCell>Unit Achievement</TableCell>
                                                                                                                                    <TableCell>Beneficiary Contribution</TableCell>
                                                                                                                                    <TableCell>Current Cost</TableCell>
                                                                                                                                    <TableCell>Payee Name</TableCell>
                                                                                                                                    <TableCell>Account details</TableCell>
                                                                                                                                    <TableCell>Passbook Copy</TableCell>
                                                                                                                                    <TableCell>Other Document</TableCell>
                                                                                                                                    <TableCell>Domain Expert</TableCell>
                                                                                                                                    <TableCell>Actions</TableCell>
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || []).map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        <TableCell>
                                                                                                                                            {
                                                                                                                                                row.achievementUnit
                                                                                                                                           }
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            
                                                                                                                                                {row.currentCost
                                                                                                                                            }
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {
                                                                                                                                                row.payeeName
                                                                                                                                            }
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            { row.passbookDoc ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.passbookDoc.downloadUrl}
                                                                                                                                                    download={row.passbookDoc.fileName}
                                                                                                                                                    style={{
                                                                                                                                                        textDecoration: 'underline',
                                                                                                                                                        color: 'blue',
                                                                                                                                                    }}
                                                                                                                                                >
                                                                                                                                                    {row.passbookDoc.fileName}
                                                                                                                                                </a>
                                                                                                                                            ) : (
                                                                                                                                                <Typography>No Image</Typography>
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {
                                                                                                                                                row.otherDocument &&
                                                                                                                                                row.otherDocument.files &&
                                                                                                                                                row.otherDocument.files.length > 0 ? (
                                                                                                                                                row.otherDocument.files.map((file, idx) => (
                                                                                                                                                    <div key={idx}>
                                                                                                                                                        <a
                                                                                                                                                            href={file.fileURL}
                                                                                                                                                            download={file.file.name}
                                                                                                                                                            style={{
                                                                                                                                                                textDecoration: 'underline',
                                                                                                                                                                color: 'blue',
                                                                                                                                                            }}
                                                                                                                                                        >
                                                                                                                                                            {file.file.name}
                                                                                                                                                        </a>
                                                                                                                                                    </div>
                                                                                                                                                ))
                                                                                                                                            ) : (
                                                                                                                                                <Typography>No File Uploaded</Typography>
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                       
                                                                                                                                    </TableRow>
                                                                                                                                ))}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </TableContainer>
                                                                                                                
                                                                                                                </div>
                                                                                                            </Collapse>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                </React.Fragment>
                                                                                            ))}
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
        </div>
    );
};

export default FinalReviewList;
