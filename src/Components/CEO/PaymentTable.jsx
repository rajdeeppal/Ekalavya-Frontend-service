import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
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
    Checkbox,
    Modal,
    Divider,
    Box, FormControl, InputLabel, Select, MenuItem, FormControlLabel

} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Reviews,
} from '@mui/icons-material';
import { useAuth } from '../PrivateRoute';
import { generatedVoucherDetails, getRestrictedComponents, exportCEOPaymentDetails, rejectVCPaymentDetails, approveVCPaymentDetails } from '../DataCenter/apiService';
import AOPaymentTable from '../AO/AOPaymentTable';
import DownloadIcon from '@mui/icons-material/Download';
import Avatar from '@mui/material/Avatar';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

function PaymentTable({ beneficiaries, setBeneficiaries, isReview, date, setIsSucess, isApprove, isReject, isVC }) {
    const { userId } = useAuth();
    const [open, setOpen] = useState({});
    const [selectedTasks, setSelectedTasks] = useState({});
    const [formValues, setFormValues] = useState({
        bankName: '',
        iFSCNo: '',
        branchName: '',
        isFullPayment: true,
        partialPayment: ''
    });
    const [errors, setErrors] = useState('');
    const [benId, setBenId] = useState('');
    const [remarks, setRemarks] = useState('');
    const [comments, setComments] = useState([]);
    const [showViewConfirmation, setShowViewConfirmation] = useState(false);
    const [showViewCommentConfirmation, setShowViewCommentConfirmation] = useState(false);
    const [showViewPaymentConfirmation, setShowViewPaymentConfirmation] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('');
    const [components, setComponents] = useState([]);
    const [voucher, setVoucher] = useState('');
    const [isPay, setIsPay] = useState('');


    useEffect(() => {
        async function fetchComponents() {
            const data = await getRestrictedComponents();
            setComponents(Array.isArray(data) ? data : []);
        }
        fetchComponents();
    }, []);

    const toggleCollapse = (index) => {
        setOpen((prevState) => ({ ...prevState, [index]: !prevState[index] }));
    };

    const handleCheckboxChange = (beneficiaryId, projectId, componentId, activityId, taskId, task) => {
        // First, update the selectedTasks state
        setSelectedTasks((prev) => {
            const updatedTasks = { ...prev };

            // Initialize the hierarchy if not present
            if (!updatedTasks[beneficiaryId]) {
                updatedTasks[beneficiaryId] = {};
            }
            if (!updatedTasks[beneficiaryId][projectId]) {
                updatedTasks[beneficiaryId][projectId] = {};
            }
            if (!updatedTasks[beneficiaryId][projectId][componentId]) {
                updatedTasks[beneficiaryId][projectId][componentId] = {};
            }
            if (!updatedTasks[beneficiaryId][projectId][componentId][activityId]) {
                updatedTasks[beneficiaryId][projectId][componentId][activityId] = {};
            }

            // Toggle the task selection
            const activityTasks = updatedTasks[beneficiaryId][projectId][componentId][activityId];
            if (activityTasks[taskId]) {
                delete activityTasks[taskId];

                // Clean up the hierarchy if empty
                if (Object.keys(activityTasks).length === 0) {
                    delete updatedTasks[beneficiaryId][projectId][componentId][activityId];
                    if (Object.keys(updatedTasks[beneficiaryId][projectId][componentId]).length === 0) {
                        delete updatedTasks[beneficiaryId][projectId][componentId];
                        if (Object.keys(updatedTasks[beneficiaryId][projectId]).length === 0) {
                            delete updatedTasks[beneficiaryId][projectId];
                            if (Object.keys(updatedTasks[beneficiaryId]).length === 0) {
                                delete updatedTasks[beneficiaryId];
                            }
                        }
                    }
                }
            } else {
                activityTasks[taskId] = task;
            }

            return updatedTasks;
        });
    };



    const validateForm = () => {
        // Check if all fields are filled
        let formErrors = {};
        if (!formValues.bankName) formErrors.bankName = 'Bank name is required';
        if (!formValues.iFSCNo) formErrors.iFSCNo = 'IFSC No is required';
        if (!formValues.branchName) formErrors.branchName = 'Branch name is required';
 
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleGenerateVoucher = async (bId) => {
        const beneficiary = beneficiaries.find((beneficiary) => beneficiary.id === bId);

        if (!validateForm()) return;

        if (!beneficiary) {
            alert(`Beneficiary not found for the provided ID: ${bId}`);
            return;
        }

        const tasks = selectedTasks[bId];
        if (!tasks || Object.keys(tasks).length === 0) {
            alert(`No tasks selected for the beneficiary: ${bId}`);
            return;
        }

        console.log(tasks)

        const component = Object.entries(tasks).map(([projectId, componentGroup]) => {
            const project = beneficiary.projects.find((p) => p.id === parseInt(projectId));

            return {
                id: parseInt(projectId),
                projectName: project?.projectName || `Project ${projectId}`,
                components: Object.entries(componentGroup).map(([componentId, activityGroup]) => {
                    const component = project?.components.find((c) => c.id === parseInt(componentId));

                    return {
                        id: parseInt(componentId),
                        componentName: component?.componentName || `Component ${componentId}`,
                        activities: Object.entries(activityGroup).map(([activityId, taskGroup]) => {
                            const activity = component?.activities.find((a) => a.id === parseInt(activityId));

                            return {
                                id: parseInt(activityId),
                                activityName: activity?.activityName || `Activity ${activityId}`,
                                tasks: Object.entries(taskGroup).map(([taskId, task]) => {
                                    const matchedTask = activity?.tasks.find((t) => t.id === parseInt(taskId));

                                    return {
                                        id: parseInt(taskId),
                                        taskName: matchedTask?.taskName || task.taskName,
                                        totalAmount: task.totalAmount,
                                        beneficiaryContribution: task.beneficiaryContribution,
                                    };
                                }),
                            };
                        }),
                    };
                }),
            };
        });

        console.log(component)

        const totalAmount = component.reduce((sum, project) => {
            return sum + project.components.reduce((projectSum, compo) => {
                return projectSum + compo.activities.reduce((activitySum, activity) => {
                    return activitySum + activity.tasks.reduce((taskSum, task) => taskSum + task.totalAmount, 0);
                }, 0);
            }, 0);
        }, 0);

        console.log(totalAmount)
        const voucherData = {
            payeeName: beneficiary.payeeName,
            accountNumber: beneficiary.accountNumber,
            projects: component,
            amount: totalAmount,
            isFullPayment: formValues.isFullPayment,
            partialPayment: formValues.isFullPayment ? totalAmount : parseFloat(formValues.partialPayment || 0),
            bankName: formValues.bankName,
            ifscCode: formValues.iFSCNo,
            branchName: formValues.branchName,
            passbookDocs: beneficiary.passbookDocs,
            otherDocs: beneficiary.otherDocs
        };

        console.log(totalAmount)
        try {
            const blob = await generatedVoucherDetails(voucherData);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'PaymentVoucher.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

            // Reset form values
            setFormValues({
                bankName: '',
                iFSCNo: '',
                branchName: '',
                isFullPayment: true,
                partialPayment: ''
            });
            setShowViewConfirmation(false);
            setIsSucess(true);
        } catch (error) {
            console.error('Error generating voucher:', error);
        }

        console.log('Generated Voucher Data:', voucherData);
        return voucherData;
    };




    const handleCloseViewConfirmation = () => {
        setShowViewConfirmation(false);
    };

    const handleCloseViewCommentConfirmation = () => {
        setShowViewCommentConfirmation(false);
    };

    const handleCloseViewPaymentConfirmation = () => {
        setShowViewPaymentConfirmation(false);
    };

    const handleSubmit = (id) => {
        setBenId(id)
        setShowViewConfirmation(true);
    };

    const handlePaymentSubmit = (value) => {
        setShowViewPaymentConfirmation(true);
        setVoucher(value);
        setIsPay(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form values
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

    };

    const toggleViewMode = (comments) => {
        setShowViewCommentConfirmation(true);
        setComments(comments);
    };

    const exportToExcel = async () => {
        try {
            console.log("ok");
            const data = await exportCEOPaymentDetails(userId, date, selectedComponent);
            alert(data);
            console.log(beneficiaries);
            console.log(beneficiaries);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }

    const handleApproval = async (beneficiaryId, status) => {
        if (status === 'Approve') {
            try {
                await approveVCPaymentDetails(userId, beneficiaryId, remarks);
                setIsSucess(true);
                console.log("User ID:", userId, "Row ID:", beneficiaryId, "Remarks:", remarks);
                alert("Tasks have been approved successfully");
            } catch (error) {
                console.error("Error approving tasks:", error);
                setIsSucess(true);
                alert("An error occurred while approving the tasks. Please try again.");
            }
        } else {
            try {
                await rejectVCPaymentDetails(userId, beneficiaryId, remarks);
                setIsSucess(true);
                console.log("User ID:", userId, "Row ID:", beneficiaryId, "Remarks:", remarks);
                alert("Tasks have been rejected successfully");
            } catch (error) {
                console.error("Error tasks:", error);
                setIsSucess(true);
                const backendErrors = error.response?.data || 'An error occurred while rejecting the tasks. Please try again.';
                alert(backendErrors);
            }
        }
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }} className="listContainer">
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', // Ensures proper alignment on smaller screens
                    gap: 2, // Adds spacing between items
                    marginBottom: 3, // Equivalent to 20px
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ color: '#555', flex: '1 1 auto' }} // Allows it to resize in smaller screens
                >
                    Payment List
                </Typography>

                <FormControl
                    sx={{
                        minWidth: 200, // Ensures the dropdown doesn't shrink too much
                        flex: '0 0 auto', // Allows resizing with space
                    }}
                >
                    <InputLabel>Component Name</InputLabel>
                    <Select
                        value={selectedComponent}
                        onChange={(e) => setSelectedComponent(e.target.value)}
                    >
                        <MenuItem value="">Select Component</MenuItem>
                        {components.map((component) => (
                            <MenuItem key={component.id} value={component.componentName}>
                                {component.componentName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <IconButton
                    onClick={exportToExcel}
                    sx={{
                        color: 'primary.main', // Matches the primary theme color
                        flex: '0 0 auto', // Prevents resizing
                    }}
                    aria-label="Download Excel"
                >
                    <DownloadIcon />
                </IconButton>
            </Box>
            <TableContainer component={Paper} elevation={3} style={{ borderRadius: '8px', overflow: 'hidden' }}>
                <Table aria-label="beneficiary table">
                    <TableHead style={{ backgroundColor: '#f0f0f0' }}>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold' }}>Payee Name</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Account Number</TableCell>
                            <TableCell style={{ fontWeight: 'bold' }}>Total Amount</TableCell>
                            {(isApprove || isReject || isVC) &&
                                <>

                                    <TableCell style={{ fontWeight: 'bold' }}>Voucher</TableCell>
                                    {(!isVC) &&
                                        <TableCell style={{ fontWeight: 'bold' }}>Comments</TableCell>}
                                </>
                            }
                            <TableCell style={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {beneficiaries?.map((beneficiary, beneficiaryIndex) => (
                            <React.Fragment key={beneficiary.id}>
                                {/* Main Beneficiary Row */}
                                <TableRow hover>
                                    <TableCell>{beneficiary.payeeName}</TableCell>
                                    <TableCell>{beneficiary.accountNumber}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('en-IN', {
                                            style: 'currency',
                                            currency: 'INR',
                                            maximumFractionDigits: 2,
                                        }).format(beneficiary.grandTotal)}
                                    </TableCell>
                                    {(isApprove || isReject || isVC) && (
                                        <>
                                            <TableCell>
                                                <a
                                                    href={beneficiary.voucherUrl}
                                                    download={beneficiary.voucherUrl}
                                                    style={{
                                                        textDecoration: 'underline',
                                                        color: '#007BFF',
                                                    }}
                                                >
                                                    {beneficiary.voucherId}
                                                </a>
                                            </TableCell>
                                            {(!isVC) &&
                                                <TableCell>
                                                    <IconButton
                                                        color={
                                                            'primary'
                                                        }
                                                        onClick={() => toggleViewMode(beneficiary?.comments)}
                                                    >
                                                        <RemoveRedEyeOutlinedIcon />
                                                    </IconButton>
                                                </TableCell>}
                                        </>
                                    )}
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
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
                                                {beneficiary.projects?.map((project) => (
                                                    <div key={project.id}>
                                                        <Accordion>
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                aria-controls={`project-content-${project.id}`}
                                                                id={`project-header-${project.id}`}
                                                            >
                                                                <Typography>{project.projectName}</Typography>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {project.components?.map((component) => (
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
                                                                                                                {(isReview && !isApprove && !isReject && !isVC) && <TableCell style={{ fontWeight: 'bold' }}>Checkbox</TableCell>}
                                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Name of the Work</TableCell>
                                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Beneficiary Contribution</TableCell>
                                                                                                            </TableRow>
                                                                                                        </TableHead>
                                                                                                        <TableBody>
                                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                                <React.Fragment key={task.id}>
                                                                                                                    <TableRow>
                                                                                                                        {(isReview && !isApprove && !isReject && !isVC) && <TableCell>
                                                                                                                            <Checkbox
                                                                                                                                checked={
                                                                                                                                    !!selectedTasks[beneficiary.id]?.[project.id]?.[component.id]?.[activity.id]?.[task.id]
                                                                                                                                }
                                                                                                                                onChange={() =>
                                                                                                                                    handleCheckboxChange(beneficiary.id, project.id, component.id, activity.id, task.id, task)
                                                                                                                                }
                                                                                                                            />
                                                                                                                        </TableCell>}
                                                                                                                        <TableCell>{task.taskName}</TableCell>
                                                                                                                        <TableCell>{new Intl.NumberFormat('en-IN', {
                                                                                                                            style: 'currency',
                                                                                                                            currency: 'INR',
                                                                                                                            maximumFractionDigits: 2,
                                                                                                                        }).format(task.totalAmount)}</TableCell>
                                                                                                                        <TableCell>{new Intl.NumberFormat('en-IN', {
                                                                                                                            style: 'currency',
                                                                                                                            currency: 'INR',
                                                                                                                            maximumFractionDigits: 2,
                                                                                                                        }).format(task.beneficiaryContribution)}</TableCell>
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
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    </div>
                                                ))}
                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <div style={{ padding: '10px' }}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls={`passbook-content-${beneficiary.id}`}
                                                        id={`passbook-header-${beneficiary.id}`}
                                                    >
                                                        <Typography>Passbook Document</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
                                                            <Table size="small" aria-label="passbook table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={{ fontWeight: 'bold' }}>Name of the Document</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {beneficiary.passbookDocs &&
                                                                        beneficiary.passbookDocs.length > 0 ? (
                                                                        beneficiary.passbookDocs.map((file, idx) => (
                                                                            <TableRow key={idx}
                                                                                sx={{
                                                                                    bgcolor: idx % 2 === 0 ? 'rgba(240, 248, 255, 0.5)' : 'white', // soft blue for even rows
                                                                                    '&:hover': {
                                                                                        bgcolor: 'rgba(173, 216, 230, 0.3)', // lighter blue on hover
                                                                                        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // subtle shadow
                                                                                        borderRadius: '8px', // rounded corners
                                                                                        transition: '0.3s', // smooth transition
                                                                                    },
                                                                                }}
                                                                            >
                                                                                <TableCell>
                                                                                    <a
                                                                                        href={file.downloadUrl}
                                                                                        download={file.fileName}
                                                                                        style={{
                                                                                            textDecoration: 'underline',
                                                                                            color: '#007BFF',
                                                                                            fontWeight: '500',
                                                                                        }}
                                                                                    >
                                                                                        {file.fileName}
                                                                                    </a>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    ) : (
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <Typography color="text.secondary">No File Uploaded</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </Collapse>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
                                            <div style={{ padding: '10px' }}>
                                                <Accordion>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMoreIcon />}
                                                        aria-controls={`otherdoc-content-${beneficiary.id}`}
                                                        id={`otherdoc-header-${beneficiary.id}`}
                                                    >
                                                        <Typography>Other Documents</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <TableContainer component={Paper} elevation={2} sx={{ mb: 2 }}>
                                                            <Table size="small" aria-label="otherdoc table">
                                                                <TableHead>
                                                                    <TableRow>
                                                                        <TableCell style={{ fontWeight: 'bold' }}>Document List</TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {beneficiary.otherDocs &&
                                                                        beneficiary.otherDocs.length > 0 ? (
                                                                        beneficiary.otherDocs.map((file, idx) => (
                                                                            <TableRow key={idx}>
                                                                                <TableCell>
                                                                                    <a
                                                                                        href={file.downloadUrl}
                                                                                        download={file.fileName}
                                                                                        style={{
                                                                                            textDecoration: 'underline',
                                                                                            color: '#007BFF',
                                                                                        }}
                                                                                    >
                                                                                        {file.fileName}
                                                                                    </a>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))
                                                                    ) : (
                                                                        <TableRow>
                                                                            <TableCell>
                                                                                <Typography>No File Uploaded</Typography>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    )}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                    </AccordionDetails>
                                                </Accordion>
                                                {isReview && <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
                                                    {!isApprove && !isReject && !isVC &&
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => handleSubmit(beneficiary.id)}
                                                            style={{ marginTop: '10px' }}
                                                        >
                                                            Generate Voucher
                                                        </Button>
                                                    }
                                                    {isApprove &&
                                                        <Button
                                                            variant="outlined"
                                                            color="primary"
                                                            style={{ marginTop: '10px' }}
                                                            onClick={() => handlePaymentSubmit(beneficiary.id)}
                                                        >
                                                            Pay
                                                        </Button>
                                                    }
                                                    {isVC &&
                                                        <>
                                                            <TableCell>
                                                                <TextField
                                                                    label="Remarks"
                                                                    value={remarks}
                                                                    onChange={(e) => setRemarks(e.target.value)}
                                                                    size="small"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Box sx={{ display: 'flex', gap: 0.5 }} >
                                                                    <Button
                                                                        variant="contained"
                                                                        color="success"
                                                                        onClick={() => handleApproval(beneficiary.id, 'Approve')}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="error"
                                                                        onClick={() => handleApproval(beneficiary.id, 'Reject')}
                                                                    >
                                                                        Reject
                                                                    </Button>
                                                                </Box>
                                                            </TableCell>
                                                        </>
                                                    }
                                                </div>}
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
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <TextField
                        fullWidth
                        label="Bank Name"
                        name="bankName"
                        placeholder="Bank Name"
                        onChange={handleChange}
                        margin="normal"
                        required
                        error={!!errors.bankName}
                        helperText={errors.bankName}
                    />

                    <TextField
                        fullWidth
                        label="IFSC No."
                        name="iFSCNo"
                        placeholder="IFSC No"
                        onChange={handleChange}
                        margin="normal"
                        required
                        error={!!errors.iFSCNo}
                        helperText={errors.iFSCNo}
                    />

                    <TextField
                        fullWidth
                        label="Branch Name"
                        name="branchName"
                        placeholder="Branch Name"
                        onChange={handleChange}
                        margin="normal"
                        required
                        error={!!errors.branchName}
                        helperText={errors.branchName}
                    />

                    <div style={{ marginTop: '16px' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="isFullPayment"
                                checked={formValues.isFullPayment || false}
                                onChange={(e) =>
                                    setFormValues((prev) => ({
                                        ...prev,
                                        isFullPayment: e.target.checked,
                                    }))
                                }
                            />
                        }
                        label="Is Full Payment?"
                    />
                    </div>

                    {!formValues.isFullPayment && (
                        <TextField
                            fullWidth
                            label="Partial Payment"
                            name="partialPayment"
                            placeholder="Partial Payment Amount"
                            onChange={handleChange}
                            margin="normal"
                            required
                            error={!!errors.partialPayment}
                            helperText={errors.partialPayment}
                        />
                    )}

                    <Button variant="contained" color="primary" onClick={() => handleGenerateVoucher(benId)} sx={{ mt: 2 }} >
                        Submit
                    </Button>
                </Box>
            </Modal>
            <Modal
                open={showViewCommentConfirmation}
                onClose={handleCloseViewCommentConfirmation}
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
                            onClick={handleCloseViewCommentConfirmation}
                        >
                            Close
                        </button>
                    </Box>
                </Box>
            </Modal>

            <Modal
                open={showViewPaymentConfirmation}
                onClose={handleCloseViewPaymentConfirmation}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" component="h2" gutterBottom>
                        Payment Form
                    </Typography>
                    <AOPaymentTable setShowViewPaymentConfirmation={setShowViewPaymentConfirmation} showViewPaymentConfirmation={showViewConfirmation} setIsSucess={setIsSucess} voucher={voucher} isPay={isPay} />
                </Box>
            </Modal>
        </div>



    )
}

export default PaymentTable;
