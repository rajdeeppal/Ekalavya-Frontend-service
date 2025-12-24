import React, { useState, useEffect } from 'react';
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
    Alert,
    Box,
    Modal,
    FormControl, Select, MenuItem, Divider
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
} from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import * as XLSX from 'xlsx';
import { updatedBeneficiarySubTask, newBeneficiarySubTask, updatedResubmitBeneficiarySubTask, submitInProgressDetails, domainDetails, deletedBeneficiaryTask } from '../DataCenter/apiService';
import CloseIcon from '@mui/icons-material/Close';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Checkbox from '@mui/material/Checkbox';
import { useAuth } from '../PrivateRoute';
import { exportInProgressDetails } from '../DataCenter/apiService';
import { useSnackbar } from 'notistack';

const InprogressTable = ({ beneficiaries, value, setBeneficiaries, isReject, setIsSucess }) => {
    const { userId } = useAuth();
    const [open, setOpen] = useState({});
    const [taskDetailsOpen, setTaskDetailsOpen] = useState({});
    const [editMode, setEditMode] = useState({});
    const [newTask, setNewTask] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showViewConfirmation, setShowViewConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [deleteId, setDeleteId] = useState(false);
    const [domainId, setDomainId] = useState([]);
    const [taskId, setTaskId] = useState('');
    const [remark, setRemark] = useState('');
    const [comments, setComments] = useState([]);
    const [id, setId] = useState([]);
    const [isBulk, setIsBulk] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchDomain() {
            if (!taskId) return;
            try {
                const data = await domainDetails(taskId);
                setDomainId(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching Tasks:', error);
            }
        }
        fetchDomain();
    }, [taskId])

    const toggleEditMode = (taskIndex, rowIndex) => {
        setEditMode((prevEditMode) => ({
            ...prevEditMode,
            [`${taskIndex}-${rowIndex}`]: !prevEditMode[`${taskIndex}-${rowIndex}`],
        }));
        setTaskId(taskIndex);
        console.log(taskIndex);
    };

    const handleRemoveFile = (taskId, rowIndex, fileType, fileIndex) => {
        setBeneficiaries((prevBeneficiaries) =>
            prevBeneficiaries.map((beneficiary) => ({
                ...beneficiary,
                components: beneficiary.components.map((component) => ({
                    ...component,
                    activities: component.activities.map((activity) => ({
                        ...activity,
                        tasks: activity.tasks.map((task) => {
                            if (task.id === taskId) {
                                const updatedTaskUpdates = [...task.taskUpdates];
                                const otherDocs = updatedTaskUpdates[rowIndex].otherDocs;

                                if (fileType === 'passbookDoc') {
                                    updatedTaskUpdates[rowIndex].passbookDoc = null;
                                }
                                else if (fileType === 'otherDocs' && otherDocs.length > fileIndex) {
                                    updatedTaskUpdates[rowIndex].otherDocs = otherDocs.filter(
                                        (_, index) => index !== fileIndex
                                    );
                                } else {
                                    console.warn("Invalid file index or no files to remove.");
                                }

                                return {
                                    ...task,
                                    taskUpdates: updatedTaskUpdates,
                                };
                            }

                            return task;
                        }),
                    })),
                })),
            }))
        );
    };


    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const handleSubmit = (index) => {
        setId(index);
        setShowConfirmation(true);
        setIsEdit(false);
        setIsBulk(false);
    };

    const toggleViewMode = (comments) => {
        setShowViewConfirmation(true);
        setComments(comments);
    };

    const handleConfirmSubmit = async () => {
        try {
            console.log(id)
            const data = beneficiaries.find((beneficiary) => beneficiary.id === id)
            const filteredData = JSON.parse(JSON.stringify(data));

            filteredData.components.forEach((component) => {
                component.activities.forEach((activity) => {
                    activity.tasks.forEach((task) => {

                        delete task.taskUpdates.forEach((update) => {
                            delete update.otherDocs;
                            delete update.passbookDoc;
                            delete update.createdDate;
                        });

                    });
                });
            });
            console.log("submit", filteredData);
            await submitInProgressDetails(filteredData);
            setIsSucess(true);
            enqueueSnackbar('Beneficiary have been submitted successfully', { variant: 'success' });
            setShowConfirmation(false);
        } catch (error) {
            setIsSucess(true);
            enqueueSnackbar(error.message || 'Error fetching activities:', { variant: 'error' });
            console.error('Error fetching activities:', error);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handleCloseViewConfirmation = () => {
        setShowViewConfirmation(false);
    };

    const handleCloseDeleteConfirmation = () => {
        setShowDeleteConfirmation(false);
    }

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
                                setTaskId(task.id);
                                const updatedTaskUpdates = [...task.taskUpdates];
                                const updatedRow = {
                                    ...updatedTaskUpdates[rowIndex],
                                    [field]: value,
                                };

                                if (
                                    //                                 /* field === 'currentBeneficiaryContribution' || */
                                    field === 'achievementUnit' ||
                                    field === 'revisedRatePerUnit'
                                ) {
                                    const ratePerUnit = task.ratePerUnit || 0;
                                    const revisedRatePerUnit = field === 'revisedRatePerUnit' ? value : updatedRow.revisedRatePerUnit || 0;
                                    const data = field === 'achievementUnit' ? value : updatedRow.achievementUnit || 0;
                                    const effectiveRate = revisedRatePerUnit > 0 ? revisedRatePerUnit : ratePerUnit;
                                    updatedRow.currentCost = data * effectiveRate;
                                }

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


    const handleInputReviewChange = (taskIndex, rowIndex, field, value) => {
        setBeneficiaries((prevBeneficiaries) =>
            prevBeneficiaries.map((beneficiary) => ({
                ...beneficiary,
                components: beneficiary.components.map((component) => ({
                    ...component,
                    activities: component.activities.map((activity) => ({
                        ...activity,
                        tasks: activity.tasks.map((task) => {
                            if (task.id === taskIndex) {
                                const updatedTaskUpdates = task.taskUpdates.map((row, index) =>

                                    index === rowIndex
                                        ? { ...row, [field]: value }
                                        : row

                                ); console.log(taskIndex)
                                console.log(rowIndex)
                                console.log(value)
                                return { ...task, taskUpdates: updatedTaskUpdates };
                            }
                            return task;
                        }),
                    })),
                })),
            }))
        );
    };


    const handleDeleteConfirmSubmit = async () => {
        try {
            await deletedBeneficiaryTask(deleteId);
            enqueueSnackbar('Beneficiary deleted successfully!', { variant: 'success' });
            setShowDeleteConfirmation(false);
        } catch (error) {
            const backendErrors = error.response?.data || 'Error registering user. Please try again.';
            console.error(backendErrors);
            enqueueSnackbar(backendErrors, { variant: 'error' });
        }
    }

    const handleDelete = async (index) => {
        setShowDeleteConfirmation(true);
        setDeleteId(index);

    }

    const handleSaveRow = async (taskIndex, rowIndex, row) => {
        toggleEditMode(taskIndex, rowIndex);
        const task = beneficiaries
            .flatMap((b) => b.components.flatMap((c) => c.activities.flatMap((a) => a.tasks)))
            .find((t, i) => t.id === taskIndex);
        console.log("row", row);
        let firstTask = false;
        if (Number(rowIndex) === 0 && row === undefined) {
            firstTask = true;
        }

        if (row !== undefined) {
            setNewTask(false);
        }
        console.log(firstTask)
        if (isReject) {
            firstTask = false;
        }

        console.log(firstTask)
        const changedData = task.taskUpdates[rowIndex];

        const taskUpdateDTO = {
            /*domainExpertEmpId: changedData.domainExpertEmpId,*/
            payeeName: changedData.payeeName,
            accountNumber: parseInt(changedData.accountNumber, 10),
            revisedRatePerUnit: parseFloat(changedData.revisedRatePerUnit),
            benContribution: parseFloat(changedData.currentBeneficiaryContribution),
            achievementUnit: parseFloat(changedData.achievementUnit, 10),
            currentCost: parseFloat(changedData.currentCost),
            procurementCheck: changedData.procurementCheck === true,
            ...(isReject && { remark: changedData.remarks }),
        };
        console.log(firstTask);
        console.log(rowIndex);

        const formData = new FormData();
        formData.append("taskUpdateDTO", JSON.stringify(taskUpdateDTO));
        if (changedData.passbookDoc) {
            formData.append("passbookDoc", changedData.passbookDoc);
        }
        if (changedData.otherDocs && changedData.otherDocs.length > 0) {
            changedData.otherDocs.forEach((doc, index) => {
                formData.append(`otherDocs`, doc.file);
            });
        } else {
            formData.append(`otherDocs`, null);
        }
        console.log(formData.otherDocs);
        console.log(changedData.passbookDoc);


        try {
            if (newTask || firstTask) {

                console.log(formData);
                await newBeneficiarySubTask(task.id, formData);
                setNewTask(false);
                firstTask = false;
                setIsSucess(true);
                enqueueSnackbar('Project saved successfully!', { variant: 'success' });

            } else {
                if (isReject) {
                    console.log(task.taskUpdates[rowIndex].passbookDoc);
                    console.log(formData);
                    await updatedResubmitBeneficiarySubTask(row, formData);
                    setIsSucess(true);
                    enqueueSnackbar('Project saved successfully!', { variant: 'success' });
                } else {
                    console.log(task.taskUpdates[rowIndex].passbookDoc);
                    console.log(formData);
                    await updatedBeneficiarySubTask(row, formData);
                    setIsSucess(true);
                    enqueueSnackbar('Project saved successfully!', { variant: 'success' });
                }
            }

            setIsEdit(false);
        } catch (error) {
            console.error("Error submitting task update:", error);
            setIsSucess(true);
            const backendErrors = error.response?.data || 'An error occurred while updating the task.';
            enqueueSnackbar(backendErrors, { variant: 'error' });
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
                    lastRow.revisedRatePerUnit !== '' ||
                    lastRow.currentBeneficiaryContribution !== '' ||
                    lastRow.payeeName !== '' ||
                    lastRow.passbookDoc !== ''
                ) {
                    setNewTask(true);
                    task.taskUpdates.push({
                        achievementUnit: '',
                        revisedRatePerUnit: '',
                        currentBeneficiaryContribution: '',
                        currentCost: '',
                        payeeName: '',
                        passbookDoc: null,
                        otherDocs: [],
                        procurementCheck: false,
                        /* domainExpertEmpId: '' */
                    });
                }
            }

            return updatedBeneficiaries;
        });
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

            if (!files || files.length === 0) {
                console.warn("No files selected or files is undefined.");
                return;
            }
            if (task && files.length > 0) {
                if (fileType === 'passbookDoc') {
                    const file = files[0];

                    task.taskUpdates[rowIndex].passbookDoc = file;
                    console.log(file)
                } else if (fileType === 'otherDocs') {
                    const pdfFiles = Array.from(files)
                    // .filter(
                    //     (file) => file.type === 'application/pdf'
                    // );

                    if (pdfFiles.length > 0) {
                        const pdfFileURLs = pdfFiles.map((file) => ({
                            file
                        }));

                        if (!task.taskUpdates[rowIndex].otherDocs) {
                            // Initialize as an empty array if not already present
                            task.taskUpdates[rowIndex].otherDocs = [];
                        }

                        // Add new files to the existing array
                        task.taskUpdates[rowIndex].otherDocs.push(...pdfFileURLs);
                    } else {
                        enqueueSnackbar('Only PDF format is allowed for other documents.', { variant: 'warning' });
                    }
                    console.log(pdfFiles)
                }
                setIsEdit(true);
            }

            return updatedBeneficiaries;
        });
    };

    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportInProgressDetails(userId, value);
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
                <Typography variant="h4" gutterBottom style={{ color: '#888' }}>
                    Task List
                </Typography>
                <IconButton onClick={exportToExcel} >
                    <DownloadIcon />
                </IconButton>
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
                                        <Box display="flex" gap={1} justifyContent="flex-start" alignItems="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => toggleCollapse(beneficiaryIndex)}
                                                size="small"
                                                style={{ textTransform: "none" }} // Optional: Disable uppercase
                                            >
                                                View
                                            </Button>
                                            {!isReject && <IconButton
                                                sx={{ color: "red" }}
                                                onClick={() => handleDelete(beneficiary.id)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <div style={{ padding: '10px' }}>
                                                {beneficiary.components?.map((component, componentIndex) => (
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
                                                                {component.activities?.map((activity, activityIndex) => (
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
                                                                                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                                                                                <TableCell>Name of the Work</TableCell>
                                                                                                <TableCell>Type of Unit</TableCell>
                                                                                                <TableCell>Unit Rate</TableCell>
                                                                                                <TableCell>Financial Extension</TableCell>
                                                                                                <TableCell>Sanction Units</TableCell>
                                                                                                <TableCell>Unit Balance</TableCell>
                                                                                                <TableCell>Total Cost</TableCell>
                                                                                                <TableCell>Beneficiary Contribution Balance</TableCell>
                                                                                                <TableCell>Remain Amount</TableCell>
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
                                                                                                        <TableCell>
                                                                                                            {task.financialExtension ? 'Y' : 'N'}
                                                                                                        </TableCell>
                                                                                                        <TableCell>{task.units}</TableCell>
                                                                                                        <TableCell>{task.unitRemain}</TableCell>
                                                                                                        <TableCell>{task.totalCost}</TableCell>
                                                                                                        <TableCell>{task.beneficiaryContributionRemain}</TableCell>
                                                                                                        <TableCell>{task.balanceRemaining}</TableCell>
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
                                                                                                                    <TableContainer
                                                                                                                                                                                                                                            component={Paper}
                                                                                                                                                                                                                                            sx={{
                                                                                                                                                                                                                                                mb: 2,
                                                                                                                                                                                                                                                overflowX: 'auto',
                                                                                                                                                                                                                                                maxWidth: '100%',
                                                                                                                                                                                                                                            }}
                                                                                                                                                                                                                                        >
                                                                                                                        <Table
                                                                                                                                                                                                                                                    size="small"
                                                                                                                                                                                                                                                    aria-label="task details table"
                                                                                                                                                                                                                                                    sx={{
                                                                                                                                                                                                                                                        tableLayout: 'fixed',
                                                                                                                                                                                                                                                        minWidth: 1200,
                                                                                                                                                                                                                                                    }}
                                                                                                                                                                                                                                                >
                                                                                                                            <TableHead sx={{
                                                                                                                                                                                                                                                                                  position: 'sticky',
                                                                                                                                                                                                                                                                                  top: 0,
                                                                                                                                                                                                                                                                                  backgroundColor: '#fafafa',
                                                                                                                                                                                                                                                                                  zIndex: 1,
                                                                                                                                                                                                                                                                              }}>
                                                                                                                                <TableRow>
                                                                                                                                    <TableCell sx={{ minWidth: 120 }}>Unit Achievement</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 130 }}>Discounted Rate</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 140 }}>Beneficiary Contribution</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 120 }}>Current Cost</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 150 }}>Procurement Check</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 140 }}>Payee Name</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Account Details</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Passbook Copy</TableCell>
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Other Document</TableCell>
                                                                                                                                    {/*<TableCell>Domain Expert</TableCell>*/}
                                                                                                                                    {isReject && <TableCell>Reviews</TableCell>}
                                                                                                                                    <TableCell sx={{ minWidth: 160 }}>Actions</TableCell>
                                                                                                                                </TableRow>
                                                                                                                            </TableHead>
                                                                                                                            <TableBody>
                                                                                                                                {(task.taskUpdates || [])?.map((row, rowIndex) => (
                                                                                                                                    <TableRow key={rowIndex}>
                                                                                                                                        {editMode[`${task.id}-${rowIndex}`] ? (
                                                                                                                                            <>
                                                                                                                                                <TableCell>
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
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    <TextField
                                                                                                                                                        variant="outlined"
                                                                                                                                                        size="small"
                                                                                                                                                        value={row.revisedRatePerUnit || ''}
                                                                                                                                                        onChange={(e) =>
                                                                                                                                                            handleInputChange(
                                                                                                                                                                task.id,
                                                                                                                                                                rowIndex,
                                                                                                                                                                'revisedRatePerUnit',
                                                                                                                                                                e.target.value
                                                                                                                                                            )
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
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
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    <TextField
                                                                                                                                                        variant="outlined"
                                                                                                                                                        size="small"
                                                                                                                                                        value={row.currentCost || ''}

                                                                                                                                                        readonly
                                                                                                                                                    />
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    <Checkbox
                                                                                                                                                        checked={row.procurementCheck || false}
                                                                                                                                                        onChange={(e) =>
                                                                                                                                                            handleInputChange(task.id, rowIndex, 'procurementCheck', e.target.checked)
                                                                                                                                                        }
                                                                                                                                                    />
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
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
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
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
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    {!row.passbookDoc ?
                                                                                                                                                        (<Button
                                                                                                                                                            variant="contained"
                                                                                                                                                            component="label"
                                                                                                                                                        >
                                                                                                                                                            Upload
                                                                                                                                                            <input
                                                                                                                                                                type="file"
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
                                                                                                                                                        ) : (<Alert
                                                                                                                                                            severity="info"
                                                                                                                                                            action={
                                                                                                                                                                <IconButton
                                                                                                                                                                    aria-label="remove file"
                                                                                                                                                                    color="inherit"
                                                                                                                                                                    size="small"
                                                                                                                                                                    onClick={() =>
                                                                                                                                                                        handleRemoveFile(task.id, rowIndex, 'passbookDoc', 0)}
                                                                                                                                                                >
                                                                                                                                                                    <CloseIcon fontSize="inherit" />
                                                                                                                                                                </IconButton>
                                                                                                                                                            }

                                                                                                                                                        >{newTask ? (<>{row.passbookDoc.name}</>) : (!isEdit ? <>{row.passbookDoc.fileName}</> : <>{row.passbookDoc.name}</>)}

                                                                                                                                                        </Alert>)}
                                                                                                                                                </TableCell>

                                                                                                                                                <TableCell>
                                                                                                                                                    {!row.otherDocs || row.otherDocs.length === 0 ? (
                                                                                                                                                        <Button variant="contained" component="label">
                                                                                                                                                            Upload
                                                                                                                                                            <input
                                                                                                                                                                type="file"
                                                                                                                                                                // accept=".pdf"
                                                                                                                                                                multiple
                                                                                                                                                                hidden
                                                                                                                                                                onChange={(e) =>
                                                                                                                                                                    handleFileChange(task.id, rowIndex, 'otherDocs', e)
                                                                                                                                                                }
                                                                                                                                                            />
                                                                                                                                                        </Button>
                                                                                                                                                    ) : (
                                                                                                                                                        <div>
                                                                                                                                                            {row.otherDocs.map((file, fileIndex) => (
                                                                                                                                                                <Alert
                                                                                                                                                                    key={fileIndex}
                                                                                                                                                                    severity="info"
                                                                                                                                                                    action={
                                                                                                                                                                        <IconButton
                                                                                                                                                                            aria-label="remove file"
                                                                                                                                                                            color="inherit"
                                                                                                                                                                            size="small"
                                                                                                                                                                            onClick={() =>
                                                                                                                                                                                handleRemoveFile(task.id, rowIndex, 'otherDocs', fileIndex)
                                                                                                                                                                            }
                                                                                                                                                                        >
                                                                                                                                                                            <CloseIcon fontSize="inherit" />
                                                                                                                                                                        </IconButton>
                                                                                                                                                                    }
                                                                                                                                                                >
                                                                                                                                                                    {newTask
                                                                                                                                                                        ? <>{file.file?.name}</>
                                                                                                                                                                        : (!isEdit
                                                                                                                                                                            ? <>{file.fileName}</>
                                                                                                                                                                            : <>{file.file?.name}</>
                                                                                                                                                                        )
                                                                                                                                                                    }
                                                                                                                                                                </Alert>
                                                                                                                                                            ))}
                                                                                                                                                        </div>
                                                                                                                                                    )}
                                                                                                                                                </TableCell>
                                                                                                                                                {/* <TableCell>
                                                                                                                                                    <FormControl variant="outlined" size="small" fullWidth>
                                                                                                                                                        <Select
                                                                                                                                                            value={row.domainExpertEmpId || ''}
                                                                                                                                                            onChange={(e) =>
                                                                                                                                                                handleInputChange(
                                                                                                                                                                    task.id,
                                                                                                                                                                    rowIndex,
                                                                                                                                                                    'domainExpertEmpId',
                                                                                                                                                                    e.target.value
                                                                                                                                                                )
                                                                                                                                                            }
                                                                                                                                                        >
                                                                                                                                                            <MenuItem value="">
                                                                                                                                                                <em>None</em>
                                                                                                                                                            </MenuItem>
                                                                                                                                                            {domainId.map((d) => {
                                                                                                                                                                return (
                                                                                                                                                                    <MenuItem value={d.empId}>{d.empId}</MenuItem>
                                                                                                                                                                )
                                                                                                                                                            })}

                                                                                                                                                        </Select>
                                                                                                                                                    </FormControl>
                                                                                                                                                </TableCell> */}
                                                                                                                                                {isReject && (
                                                                                                                                                    <TableCell>
                                                                                                                                                        <TextField
                                                                                                                                                            variant="outlined"
                                                                                                                                                            size="small"
                                                                                                                                                            value={row.remarks || ''}
                                                                                                                                                            onChange={(e) =>
                                                                                                                                                                handleInputChange(
                                                                                                                                                                    task.id,
                                                                                                                                                                    rowIndex,
                                                                                                                                                                    'remarks',
                                                                                                                                                                    e.target.value
                                                                                                                                                                )
                                                                                                                                                            }
                                                                                                                                                        />
                                                                                                                                                    </TableCell>
                                                                                                                                                )}
                                                                                                                                                <TableCell>
                                                                                                                                                    <IconButton
                                                                                                                                                        color={
                                                                                                                                                            'success'
                                                                                                                                                        }
                                                                                                                                                        onClick={() => { newTask ? handleSaveRow(task.id, rowIndex, null) : handleSaveRow(task.id, rowIndex, row.id) }}
                                                                                                                                                    >
                                                                                                                                                        <SaveIcon />
                                                                                                                                                    </IconButton>
                                                                                                                                                </TableCell>
                                                                                                                                            </>) : (
                                                                                                                                            <>
                                                                                                                                                <TableCell>{row.achievementUnit}</TableCell>
                                                                                                                                                <TableCell>{row.revisedRatePerUnit}</TableCell>
                                                                                                                                                <TableCell>{row.currentBeneficiaryContribution}</TableCell>
                                                                                                                                                <TableCell>{row.currentCost}</TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    <Checkbox
                                                                                                                                                        checked={row.procurementCheck || false}
                                                                                                                                                        disabled
                                                                                                                                                    />
                                                                                                                                                </TableCell>
                                                                                                                                                <TableCell>{row.payeeName}</TableCell>
                                                                                                                                                <TableCell>{row.accountNumber}</TableCell>
                                                                                                                                                <TableCell>{row.passbookDoc ? (<a
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
                                                                                                                                                )}</TableCell>
                                                                                                                                                <TableCell>
                                                                                                                                                    {row.otherDocs &&
                                                                                                                                                        row.otherDocs.length > 0 ? (
                                                                                                                                                        row.otherDocs.map((file, idx) => (
                                                                                                                                                            <div key={idx}>
                                                                                                                                                                <a
                                                                                                                                                                    href={file.downloadUrl}
                                                                                                                                                                    download={file.downloadUrl}
                                                                                                                                                                    style={{
                                                                                                                                                                        textDecoration: 'underline',
                                                                                                                                                                        color: 'blue',
                                                                                                                                                                    }}
                                                                                                                                                                >
                                                                                                                                                                    {file.fileName}
                                                                                                                                                                </a>
                                                                                                                                                            </div>
                                                                                                                                                        ))
                                                                                                                                                    ) : (
                                                                                                                                                        <Typography>No File Uploaded</Typography>
                                                                                                                                                    )}
                                                                                                                                                </TableCell>
                                                                                                                                                {/*<TableCell>{row.domainExpertEmpId}</TableCell>*/}
                                                                                                                                                {isReject &&
                                                                                                                                                    <TableCell>
                                                                                                                                                        <IconButton
                                                                                                                                                            color={
                                                                                                                                                                'primary'
                                                                                                                                                            }
                                                                                                                                                            onClick={() => toggleViewMode(row.comments)}
                                                                                                                                                        >
                                                                                                                                                            <RemoveRedEyeOutlinedIcon />
                                                                                                                                                        </IconButton>
                                                                                                                                                    </TableCell>}
                                                                                                                                                <TableCell><IconButton
                                                                                                                                                    color={
                                                                                                                                                        'primary'
                                                                                                                                                    }
                                                                                                                                                    onClick={() => toggleEditMode(
                                                                                                                                                        task.id, rowIndex)}
                                                                                                                                                >
                                                                                                                                                    <EditIcon />
                                                                                                                                                </IconButton></TableCell>
                                                                                                                                            </>
                                                                                                                                        )}
                                                                                                                                    </TableRow>
                                                                                                                                ))}
                                                                                                                            </TableBody>
                                                                                                                        </Table>
                                                                                                                    </TableContainer>
                                                                                                                    {!isReject &&
                                                                                                                        <Button
                                                                                                                            variant="contained"
                                                                                                                            color="primary"
                                                                                                                            onClick={() => addNewRow(task.id)}
                                                                                                                        >
                                                                                                                            Add New Row
                                                                                                                        </Button>}
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
                                                    onClick={() => handleSubmit(beneficiary.id)}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    Save
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
                        <Button variant="contained" color="primary" onClick={handleConfirmSubmit}>
                            Yes
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseConfirmation}>
                            No
                        </Button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={showViewConfirmation}
                onClose={handleCloseViewConfirmation}
                aria-labelledby="confirmation-modal"
                aria-describedby="confirmation-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
                    >
                        Comments
                    </Typography>
                    <div
                        className="comment-section"
                        style={{
                            maxHeight: '300px',
                            overflowY: 'auto',
                            padding: '8px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            background: '#f9f9f9',
                        }}
                    >
                        {comments !== null ? <>
                            {comments?.map((comment, id) => (
                                <div
                                    key={id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '16px',
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: comment.role === 'Admin' ? 'primary.main' : 'secondary.main',
                                            mr: 2,
                                        }}
                                    >
                                        {comment.role.charAt(0)}
                                    </Avatar>
                                    <div>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{ fontWeight: 'bold', color: 'text.primary' }}
                                        >
                                            {comment.role}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {comment.message}
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </> : <>No Remarks found</>}
                    </div>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <button
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#d32f2f',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                            onClick={handleCloseViewConfirmation}
                        >
                            Close
                        </button>
                    </Box>
                </Box>
            </Modal>
            <Modal
                open={showDeleteConfirmation}
                onClose={handleCloseDeleteConfirmation}
                aria-labelledby="confirmation-modal"
                aria-describedby="confirmation-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography id="confirmation-modal-title" variant="h6" component="h2">
                        Delete Confirmation
                    </Typography>
                    <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
                        Are you sure you want to delete the data?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleDeleteConfirmSubmit}>
                            Yes
                        </Button>
                        <Button variant="contained" color="secondary" onClick={handleCloseDeleteConfirmation}>
                            No
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </div >
    );
};

export default InprogressTable;
