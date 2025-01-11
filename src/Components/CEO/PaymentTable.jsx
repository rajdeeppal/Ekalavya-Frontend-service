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
    Checkbox,
    Modal,
    Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Edit as EditIcon,
    Save as SaveIcon,
    Reviews,
} from '@mui/icons-material';
import { useAuth } from '../PrivateRoute';
import { generatedVoucherDetails, getRestrictedComponents, exportCEOPaymentDetails } from '../DataCenter/apiService';
import AOPaymentTable from '../AO/AOPaymentTable';
import DownloadIcon from '@mui/icons-material/Download';

function PaymentTable({ beneficiaries, setBeneficiaries, isReview, date,setIsSucess }) {
    const { userId } = useAuth();
    const [open, setOpen] = useState({});
    const [selectedTasks, setSelectedTasks] = useState({});
    const [formValues, setFormValues] = useState({
        bankName: '',
        iFSCNo: '',
        branchName: '',
    });
    const [errors, setErrors] = useState('');
    const [benId, setBenId] = useState('');
    const [showViewConfirmation, setShowViewConfirmation] = useState(false);
    const [showViewPaymentConfirmation, setShowViewPaymentConfirmation] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('');
    const [components, setComponents] = useState([]);

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

    const handleCheckboxChange = (beneficiaryId, componentId, activityId, taskId, task) => {
        // First, update the selectedTasks state
        setSelectedTasks((prev) => {
            const updatedTasks = { ...prev };

            // Initialize the hierarchy if not present
            if (!updatedTasks[beneficiaryId]) {
                updatedTasks[beneficiaryId] = {};
            }
            if (!updatedTasks[beneficiaryId][componentId]) {
                updatedTasks[beneficiaryId][componentId] = {};
            }
            if (!updatedTasks[beneficiaryId][componentId][activityId]) {
                updatedTasks[beneficiaryId][componentId][activityId] = {};
            }

            // Toggle the task selection
            const activityTasks = updatedTasks[beneficiaryId][componentId][activityId];
            if (activityTasks[taskId]) {
                delete activityTasks[taskId];

                // Clean up the hierarchy if empty
                if (Object.keys(activityTasks).length === 0) {
                    delete updatedTasks[beneficiaryId][componentId][activityId];
                    if (Object.keys(updatedTasks[beneficiaryId][componentId]).length === 0) {
                        delete updatedTasks[beneficiaryId][componentId];
                        if (Object.keys(updatedTasks[beneficiaryId]).length === 0) {
                            delete updatedTasks[beneficiaryId];
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
            alert('Beneficiary not found for the provided ID:', bId);
            return;
        }

        const tasks = selectedTasks[bId];
        if (!tasks || Object.keys(tasks).length === 0) {
            alert('No tasks selected for the beneficiary:', bId);
            return;
        }

        const components = Object.entries(tasks).map(([componentId, activities]) => {
            return {
                id: parseInt(componentId),
                componentName: beneficiary.components.find((c) => c.id === parseInt(componentId))?.componentName || `c${componentId}`,
                activities: Object.entries(activities).map(([activityId, taskGroup]) => {
                    return {
                        id: parseInt(activityId),
                        activityName: beneficiary.components
                            .find((c) => c.id === parseInt(componentId))
                            ?.activities.find((a) => a.id === parseInt(activityId))?.activityName || `a${activityId}`,
                        tasks: Object.entries(taskGroup).map(([taskId, task]) => {
                            const matchedTask = beneficiary.components
                                .find((c) => c.id === parseInt(componentId))
                                ?.activities.find((a) => a.id === parseInt(activityId))
                                ?.tasks.find((t) => t.id === parseInt(taskId));

                            return {
                                id: task.id,
                                taskName: matchedTask?.taskName || task.taskName,
                                totalAmount: task.totalAmount,
                                beneficiaryContribution: task.beneficiaryContribution,
                            };
                        }),
                    };
                }),
            };
        });

        const totalAmount = components.reduce((sum, component) => {
            return sum + component.activities.reduce((activitySum, activity) => {
                return activitySum + activity.tasks.reduce((taskSum, task) => taskSum + task.totalAmount, 0);
            }, 0);
        }, 0);

        const voucherData = {
            payeeName: beneficiary.payeeName,
            accountNumber: beneficiary.accountNumber,
            components: components,
            amount: totalAmount,
            bankName: formValues.bankName,
            ifscCode: formValues.iFSCNo,
            branchName: formValues.branchName
        };

        try {
            const blob = await generatedVoucherDetails(voucherData);
            // const blob = new Blob([data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            console.log(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'PaymentVoucher.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            setFormValues({
                bankName: '',
                iFSCNo: '',
                branchName: '',
            })
            setShowViewConfirmation(false);
        } catch (error) {
            console.error('Error fetching activities:', error);

        }

        console.log('Generated Voucher Data:', voucherData);
        return voucherData;
    };



    const handleCloseViewConfirmation = () => {
        setShowViewConfirmation(false);
    };

    const handleCloseViewPaymentConfirmation = () => {
        setShowViewPaymentConfirmation(false);
    };

    const handleSubmit = (id) => {
        setBenId(id)
        setShowViewConfirmation(true);
    };

    const handlePaymentSubmit = () => {
        setShowViewPaymentConfirmation(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update form values
        setFormValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));

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
                                                                                                {isReview && <TableCell style={{ fontWeight: 'bold' }}>Checkbox</TableCell>}
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Name of the Work</TableCell>
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Total Cost</TableCell>
                                                                                                <TableCell style={{ fontWeight: 'bold' }}>Beneficiary Contribution Balance</TableCell>
                                                                                            </TableRow>
                                                                                        </TableHead>
                                                                                        <TableBody>
                                                                                            {activity.tasks?.map((task, taskIndex) => (
                                                                                                <React.Fragment key={task.id}>
                                                                                                    <TableRow>
                                                                                                        {isReview && <TableCell>
                                                                                                            <Checkbox
                                                                                                                checked={
                                                                                                                    !!selectedTasks[beneficiary.id]?.[component.id]?.[activity.id]?.[task.id]
                                                                                                                }
                                                                                                                onChange={() =>
                                                                                                                    handleCheckboxChange(beneficiary.id, component.id, activity.id, task.id, task)
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

                                            </div>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={10} style={{ padding: 0 }}>
                                        <Collapse in={open[beneficiaryIndex]} timeout="auto" unmountOnExit>
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
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    onClick={() => handleSubmit(beneficiary.id)}
                                                    style={{ marginTop: '10px' }}
                                                >
                                                    Generate Voucher
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    style={{ marginTop: '10px' }}
                                                    onClick={() => handlePaymentSubmit()}
                                                >
                                                    Payment Details
                                                </Button>
                                            </div>}
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

                    <Button variant="contained" color="primary" onClick={() => handleGenerateVoucher(benId)} sx={{ mt: 2 }} >
                        Submit
                    </Button>
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
                    <AOPaymentTable setShowViewPaymentConfirmation={setShowViewPaymentConfirmation} showViewPaymentConfirmation={showViewConfirmation} setIsSucess={setIsSucess}/>
                </Box>
            </Modal>
        </div>



    )
}

export default PaymentTable;
