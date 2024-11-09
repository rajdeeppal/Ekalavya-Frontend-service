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
    const [taskUpdateDTO, setTaskUpdateDTO] = useState({
        domainExpertEmpId: '',
        payeeName:'',
        accountNumber: '',
        currentBeneficiaryContribution: '',
        achievementUnit:  '',
        currentCost: '',
    });

    const toggleEditMode = (taskIndex, rowIndex) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [`${rowIndex}`]: !prevEditMode[`${rowIndex}`],
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
    
                                // Calculate `currentCost` if `achievementUnit` is updated
                                if (field === 'achievementUnit') {
                                    updatedRow.currentCost = (value * activity.ratePerUnit)-updatedRow.beneficiaryContribution;
                                }
    
                                // Update the specific row within taskUpdates
                                updatedTaskUpdates[rowIndex] = updatedRow;
    
                                return { ...task, taskUpdates: updatedTaskUpdates };
                            }
                            return task;
                        })
                    }))
                }))
            }));
        });
    };
    

    const handleSaveRow = async (taskIndex, rowIndex) => {
        toggleEditMode(taskIndex, rowIndex);
        const task = beneficiaries
            .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
            .find((t, i) => t.id === taskIndex);

        if (!newTask) {
            const changedData = task.taskUpdates[rowIndex];
            console.log(changedData);
            // Implement your save logic here (e.g., API call)
        }
        const changedData = task.taskUpdates[rowIndex];
        console.log(changedData);
        setTaskUpdateDTO({
            domainExpertEmpId: task.taskUpdates[rowIndex].domainExpertEmpId,
            payeeName: task.taskUpdates[rowIndex].payeeName,
            accountNumber: parseInt(task.taskUpdates[rowIndex].accountNumber, 10),
            benContribution: parseFloat(task.taskUpdates[rowIndex].currentBeneficiaryContribution),
            achievementUnit:  parseInt(task.taskUpdates[rowIndex].achievementUnit, 10),
            currentCost: parseFloat(task.taskUpdates[rowIndex].currentCost),
        });

        console.log(taskUpdateDTO);
    
        const formData = new FormData();
        formData.append("taskUpdateDTO", JSON.stringify(taskUpdateDTO));
        formData.append("passbookDoc", task.taskUpdates[rowIndex].passbookDoc);
        // formData.append("otherDocs", task.taskUpdates[rowIndex].otherDocs);

        try {
            if (newTask) {

                
                // Append other documents to formData
                // task.taskUpdates[0].otherDocs.forEach((doc, index) => {
                //     formData.append(`otherDocs[${index}]`, doc);
                // });

                console.log(formData);
                await updatedBeneficiarySubTask(task.id, formData);
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
        console.log(taskIndex);
        setBeneficiaries((prevBeneficiaries) => {
            const updatedBeneficiaries = [...prevBeneficiaries];

            const task = updatedBeneficiaries
                .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
                .find((t, i) => t.id === taskIndex);

            console.log(task);
            if (task) {
                if (!task.taskUpdates) {
                    task.taskUpdates = [];
                }

                const lastRow = task.taskUpdates[task.taskUpdates.length - 1];
                if (
                    !lastRow ||
                    lastRow.achievementUnit !== '' ||
                    lastRow.currentBeneficiaryContribution !== '' ||
                    lastRow.payeeName !== '' ||
                    lastRow.passbookDoc !== ''
                ) {
                    setNewTask(true);
                    task.taskUpdates.push({
                        achievementUnit: '',
                        currentBeneficiaryContribution: '',
                        currentCost: '',
                        payeeName: '',
                        passbookDoc: null,
                        otherDocs: [],
                        domainExpertEmpId: ''
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
                                    'Passbook Copy': row.passbookDoc,
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
                .find((t, i) => t.id === taskIndex);

            if (task && files.length > 0) {
                if (fileType === 'passbookDoc') {
                    const file = files[0];
                    
                    task.taskUpdates[rowIndex].passbookDoc = file;
                    
                } else if (fileType === 'otherDocs') {
                    const pdfFiles = Array.from(files).filter(
                        (file) => file.type === 'application/pdf'
                    );
                    if (pdfFiles.length === files.length) {
                        const pdfFileURLs = pdfFiles.map((file) => ({
                            file,
                            fileURL: URL.createObjectURL(file),
                        }));

                        task.taskUpdates[rowIndex].otherDocs = {
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
                                                                                                                onClick={() => toggleTaskDetails(task.id)}

                                                                                                            >
                                                                                                                View
                                                                                                            </Button>
                                                                                                        </TableCell>
                                                                                                    </TableRow>
                                                                                                    <TableRow>
                                                                                                        <TableCell colSpan={9} style={{ padding: 0 }}>
                                                                                                            <Collapse
                                                                                                                in={taskDetailsOpen[task.id]}
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
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.achievementUnit || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            task.id,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'achievementUnit',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.achievementUnit
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.currentBeneficiaryContribution || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            task.id,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'currentBeneficiaryContribution',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.currentBeneficiaryContribution
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${rowIndex}`] ? (
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
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.payeeName || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            task.id,
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
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.accountNumber || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            task.id,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'accountNumber',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.accountNumber
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <Button
                                                                                                                                                    variant="contained"
                                                                                                                                                    component="label"
                                                                                                                                                >
                                                                                                                                                    Upload
                                                                                                                                                    <input
                                                                                                                                                        type="file"
                                                                                                                                                        accept=".pdf"
                                                                                                                                                        hidden
                                                                                                                                                        onChange={(e) =>
                                                                                                                                                            handleFileChange(
                                                                                                                                                                task.id,
                                                                                                                                                                rowIndex,
                                                                                                                                                                'passbookDoc',
                                                                                                                                                                e
                                                                                                                                                            )
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </Button>
                                                                                                                                            ) : row.passbookDoc ? (
                                                                                                                                                <a
                                                                                                                                                    href={row.passbookDoc.downloadUrl}
                                                                                                                                                    download={row.passbookDoc.downloadUrl}
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
                                                                                                                                            {editMode[`${rowIndex}`] ? (
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
                                                                                                                                                                task.id,
                                                                                                                                                                rowIndex,
                                                                                                                                                                'otherDocs',
                                                                                                                                                                e
                                                                                                                                                            )
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </Button>
                                                                                                                                            ) : row.otherDocs &&
                                                                                                                                                row.otherDocs.files &&
                                                                                                                                                row.otherDocs.files.length > 0 ? (
                                                                                                                                                row.otherDocs.files.map((file, idx) => (
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
                                                                                                                                            {editMode[`${rowIndex}`] ? (
                                                                                                                                                <TextField
                                                                                                                                                    variant="outlined"
                                                                                                                                                    size="small"
                                                                                                                                                    value={row.domainExpertEmpId || ''}
                                                                                                                                                    onChange={(e) =>
                                                                                                                                                        handleInputChange(
                                                                                                                                                            task.id,
                                                                                                                                                            rowIndex,
                                                                                                                                                            'domainExpertEmpId',
                                                                                                                                                            e.target.value
                                                                                                                                                        )
                                                                                                                                                    }
                                                                                                                                                />
                                                                                                                                            ) : (
                                                                                                                                                row.domainExpertEmpId
                                                                                                                                            )}
                                                                                                                                        </TableCell>
                                                                                                                                        <TableCell>
                                                                                                                                            <IconButton
                                                                                                                                                color={
                                                                                                                                                    editMode[`${rowIndex}`]
                                                                                                                                                        ? 'success'
                                                                                                                                                        : 'primary'
                                                                                                                                                }
                                                                                                                                                onClick={() =>
                                                                                                                                                    editMode[`${rowIndex}`]
                                                                                                                                                        ? handleSaveRow(task.id, rowIndex)
                                                                                                                                                        : toggleEditMode(task.id, rowIndex)
                                                                                                                                                }
                                                                                                                                            >
                                                                                                                                                {editMode[`${rowIndex}`] ? (
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
                                                                                                                        onClick={() => addNewRow(task.id)}
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
