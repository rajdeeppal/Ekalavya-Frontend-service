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

const InprogressTable = ({ beneficiaries, setBeneficiaries }) => {
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

    const handleInputChange = (taskIndex, rowIndex, field, value) => {
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            const task = updatedBeneficiaries
                .flatMap((b) =>
                    b.components.flatMap((c) =>
                        c.activities.flatMap((a) => a.tasks)
                    )
                )
                .find((t, i) => i === taskIndex);

            if (task) {
                const row = task.additionalRows[rowIndex];
                if (field === 'otherDocument') {
                    row.otherDocument = value;
                } else {
                    row[field] = value;

                    if (row.unitAchievement) {
                        row.currentCost = row.unitAchievement * 25;
                    }
                    console.log(row.currentCost);
                }
                return updatedBeneficiaries;
            }
            return prevBeneficiaries;
        });
    };

    const handleSaveRow = async (taskIndex, rowIndex) => {
        toggleEditMode(taskIndex, rowIndex);
        const task = beneficiaries
            .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
            .find((t, i) => i === taskIndex);

        if (!newTask) {
            const changedData = task.additionalRows[rowIndex];
            console.log(changedData);
            // Implement your save logic here (e.g., API call)
        }

        const formData = new FormData();


        try {
            if (newTask) {

                formData.append("currentCost", task.additionalRows[0].currentCost);
                formData.append("achievementUnit", parseInt(task.additionalRows[0].achievementUnit,10));
                formData.append("payeeName", task.additionalRows[0].payeeName);
                formData.append("passbookCopy", task.additionalRows[0].passbookCopy);
                formData.append("otherDocument", task.additionalRows[0].otherDocument);
                // Append other documents to formData
                // task.additionalRows[0].otherDocs.forEach((doc, index) => {
                //     formData.append(`otherDocs[${index}]`, doc);
                // });

                console.log(formData);
                await updatedBeneficiarySubTask(taskIndex,formData);
                setNewTask(false);
                alert('Project saved successfully!');

            } else {
                await updatedBeneficiarySubTask(rowIndex, task);
                alert('Project saved successfully!');
            }


        } catch (error) {
            console.error("Error submitting task update:", error);
            alert("An error occurred while updating the task.");
        }

    };

    const addNewRow = (taskIndex) => {
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            const task = updatedBeneficiaries
                .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
                .find((t, i) => i === taskIndex);

            if (task) {
                if (!task.additionalRows) {
                    task.additionalRows = [];
                }

                const lastRow = task.additionalRows[task.additionalRows.length - 1];
                if (
                    !lastRow ||
                    lastRow.unitAchievement !== '' ||
                    lastRow.payeeName !== '' ||
                    lastRow.passbookCopy !== ''
                ) {
                    setNewTask(true);
                    task.additionalRows.push({
                        unitAchievement: '',
                        currentCost: '',
                        payeeName: '',
                        passbookCopy: null,
                        otherDocument: [],
                    });
                }
            }

            return updatedBeneficiaries;
        });
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

                        if (task.additionalRows) {
                            task.additionalRows.forEach((row) => {
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
                                    'Unit Achievement': row.unitAchievement,
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

    const handleFileChange = (taskIndex, rowIndex, fileType, e) => {
        const files = e.target.files;

        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];
            const task = updatedBeneficiaries
                .flatMap((b) =>
                    b.components.flatMap((c) =>
                        c.activities.flatMap((a) => a.tasks)
                    )
                )
                .find((t, i) => i === taskIndex);

            if (task && files.length > 0) {
                if (fileType === 'passbookCopy') {
                    const file = files[0];
                    if (file.type === 'image/jpeg') {
                        const fileURL = URL.createObjectURL(file);
                        task.additionalRows[rowIndex].passbookCopy = {
                            file,
                            fileURL,
                        };
                    } else {
                        alert('Only JPG format is allowed for the passbook copy.');
                    }
                } else if (fileType === 'otherDocument') {
                    const pdfFiles = Array.from(files).filter(
                        (file) => file.type === 'application/pdf'
                    );
                    if (pdfFiles.length === files.length) {
                        const pdfFileURLs = pdfFiles.map((file) => ({
                            file,
                            fileURL: URL.createObjectURL(file),
                        }));

                        task.additionalRows[rowIndex].otherDocument = {
                            files: pdfFileURLs,
                        };
                    } else {
                        alert('Only PDF format is allowed for other documents.');
                    }
                    console.log(pdfFiles)
                }
            }

            return updatedBeneficiaries;
        });
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
                                                                                                                                {(task.additionalRows || []).map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.unitAchievement || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            taskIndex,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'unitAchievement',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.unitAchievement
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.currentCost || ''}

                                                                                                                                                    readonly
                                                                                                                                                />) : (
                                                                                                                                                row.currentCost
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.payeeName || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            taskIndex,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'payeeName',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.payeeName
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    component="label"
                                                                                                                                                >
                                                                                                                                                    Upload
                                                                                                                                                    <input
                                                                                                                                                        type="file"
                                                                                                                                                        accept="image/jpeg"
                                                                                                                                                        hidden
                                                                                                                                                        onChange={(e) =>
                                                                                                                                                            handleFileChange(
                                                                                                                                                                taskIndex,
                                                                                                                                                                rowIndex,
                                                                                                                                                                'passbookCopy',
                                                                                                                                                                e
                                                                                                                                                            )
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </Button>
                                                                                                                                            ) : row.passbookCopy ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.passbookCopy.fileURL}
                                                                                                                                                    download={row.passbookCopy.file.name}
                                                                                                                                                    style={{
                                                                                                                                                        textDecoration: 'underline',
                                                                                                                                                        color: 'blue',
                                                                                                                                                    }}
                                                                                                                                                >
                                                                                                                                                    {row.passbookCopy.file.name}
                                                                                                                                                </a>
                                                                                                                                            ) : (
                                                                                                                                                <Typography>No Image</Typography>
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    component="label"
                                                                                                                                                >
                                                                                                                                                    Upload
                                                                                                                                                    <input
                                                                                                                                                        type="file"
                                                                                                                                                        accept=".pdf"
                                                                                                                                                        multiple
                                                                                                                                                        hidden
                                                                                                                                                        onChange={(e) =>
                                                                                                                                                            handleFileChange(
                                                                                                                                                                taskIndex,
                                                                                                                                                                rowIndex,
                                                                                                                                                                'otherDocument',
                                                                                                                                                                e
                                                                                                                                                            )
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </Button>
                                                                                                                                            ) : row.otherDocument &&
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
                                                                                                                                        <TableCell>
                                                                                                                                            <IconButton
                                                                                                                                                color={
                                                                                                                                                    editMode[`${taskIndex}-${rowIndex}`]
                                                                                                                                                        ? 'success'
                                                                                                                                                        : 'primary'
                                                                                                                                                }
                                                                                                                                                onClick={() =>
                                                                                                                                                    editMode[`${taskIndex}-${rowIndex}`]
                                                                                                                                                        ? handleSaveRow(taskIndex, rowIndex)
                                                                                                                                                        : toggleEditMode(taskIndex, rowIndex)
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {editMode[`${taskIndex}-${rowIndex}`] ? (
                                                                                                                                                    <SaveIcon />
                                                                                                                                                ) : (
                                                                                                                                                    <EditIcon />
                                                                                                                                                )}
                                                                                                                                            </IconButton>
                                                                                                                                        </TableCell>
                                                                                                                                    </TableRow>
                                                                                                                                ))}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </TableContainer>
                                                                                                                    <Button
                                                                                                                        variant="contained"
                                                                                                                        color="primary"
                                                                                                                        onClick={() => addNewRow(taskIndex)}
                                                                                                                    >
                                                                                                                        Add New Row
                                                                                                                    </Button>
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
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleSaveRow(null, null)}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    Save All
                                                </Button>
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

export default InprogressTable;
