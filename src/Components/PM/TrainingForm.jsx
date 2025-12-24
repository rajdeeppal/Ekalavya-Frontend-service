import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import {
    Box,
    Container,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Grid
} from '@mui/material';
import {
    getUserProjects,
    getComponentsByProject,
    getActivities,
    getTasks,
    saveTrainingConfiguration,
    saveCommonExpenditureConfiguration
} from '../DataCenter/apiService';
import { useAuth } from '../PrivateRoute';

const participantCategories = [
    'Farmers',
    'Beneficiaries',
    'Wage Seekers',
    'Poorest of the Poor',
    'Staff',
    'Others',
];

const TrainingForm = ({ isTraining, isExpenditure }) => {
    const { userId } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [projects, setProjects] = useState([]);
    const [components, setComponents] = useState([]);
    const [activities, setActivities] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [formData, setFormData] = useState({
        projectName: '',
        componentName: '',
        activityName: '',
        activityCode: '',
        maleCount: '',
        femaleCount: '',
        otherCount: '',
        recourcePerson: '',
        expertSubject: '',
        taskName: '',
        typeOfUnit: '',
        units: '1',
        ratePerUnit: '',
        totalCost: '',

        // Training-only fields
        trainingDuration: '',
        participantCategory: '',
        otherParticipantCategory: '',
        venue: '',
        timeFrom: '',
        timeTo: '',
        beneficiaryContribution: '',
        grandTotal: '',
    });

    const [errors, setErrors] = useState({});
    const [showActivityDropdown, setShowActivityDropdown] = useState(false);
    const [showTaskDropdown, setShowTaskDropdown] = useState(false);

    /* ================= Auto Total Cost ================= */
    useEffect(() => {
        const rate = parseFloat(formData.ratePerUnit) || 0;
        const units = parseFloat(formData.units) || 0;
        const totalCost = rate * units || '';
        setFormData((prev) => ({ ...prev, totalCost }));
    }, [formData.ratePerUnit, formData.units]);

    /* ================= NEW: Auto Grand Total ================= */
    useEffect(() => {
        if (!isExpenditure) return;

        const tc = parseFloat(formData.totalCost) || 0;
        const bc = parseFloat(formData.beneficiaryContribution) || 0;

        setFormData((prev) => ({
            ...prev,
            grandTotal: Math.max(tc - bc, 0),
        }));
    }, [formData.totalCost, formData.beneficiaryContribution, isExpenditure]);

    /* ================= Fetch Data ================= */
    useEffect(() => {
        getUserProjects(userId).then((data) => {
            setProjects(Array.isArray(data) ? data : []);
        });
    }, [userId]);

const formatToDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "";

  const pad = (n) => String(n).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

    useEffect(() => {
        if (!formData.projectName) return;
        const id = projects.find(p => p.projectName === formData.projectName)?.id;
        if (!id) return;
        getComponentsByProject(id).then(setComponents);
    }, [formData.projectName, projects]);

    useEffect(() => {
        if (!formData.componentName) return;
        const id = components.find(c => c.componentName === formData.componentName)?.id;
        if (!id) return;
        getActivities(id).then(setActivities);
    }, [formData.componentName, components]);

    useEffect(() => {
        if (!formData.activityName) return;
        const id = activities.find(a => a.activityName === formData.activityName)?.id;
        if (!id) return;
        getTasks(id).then(setTasks);
    }, [formData.activityName, activities]);

    /* ================= Handlers ================= */
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'units' && value !== '' && parseFloat(value) < 1) return;

        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        let formErrors = {};

        const commonFields = [
            'projectName',
            'componentName',
            'activityName',
            'activityCode',
            'taskName',
            'units',
            'ratePerUnit',
            'totalCost',
        ];

        const trainingFields = [
            'maleCount',
            'femaleCount',
            'recourcePerson',
            'expertSubject',
            'trainingDuration',
            'venue',
            'timeFrom',
            'timeTo',
        ];

        const requiredFields = isTraining
            ? [...commonFields, ...trainingFields]
            : isExpenditure
            ? [...commonFields, 'typeOfUnit', 'beneficiaryContribution']
            : commonFields;

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                formErrors[field] = 'This field is required';
            }
        });

        if (isTraining) {
          if (!formData.participantCategory) {
            formErrors.participantCategory = 'This field is required';
          }

          if (
            formData.participantCategory === 'Others' &&
            !formData.otherParticipantCategory?.trim()
          ) {
            formErrors.otherParticipantCategory =
              'Please specify participant category';
          }
        }
        if (isExpenditure) {
            const bc = parseFloat(formData.beneficiaryContribution);
            const tc = parseFloat(formData.totalCost);

            if (bc < 0) formErrors.beneficiaryContribution = 'Cannot be negative';
            if (bc > tc) formErrors.beneficiaryContribution = 'Cannot exceed total cost';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    /* ================= Save ================= */
    const handleSave = async () => {
        if (!validateForm()) return;

        const payload = {
            projectName: formData.projectName,
            componentName: formData.componentName,
            activityName: formData.activityName,
            activityCode: formData.activityCode,
            taskName: formData.taskName,
            units: parseFloat(formData.units),
            ratePerUnit: parseFloat(formData.ratePerUnit),
            totalCost: parseFloat(formData.totalCost),

            ...(isExpenditure && {
                typeOfUnit: formData.typeOfUnit,
                beneficiaryContribution: parseFloat(formData.beneficiaryContribution),
                grantAmount: parseFloat(formData.grandTotal),
            }),

            ...(isTraining && {
                maleCount: parseInt(formData.maleCount, 10),
                femaleCount: parseInt(formData.femaleCount, 10),
                otherCount: parseInt(formData.otherCount || 0, 10),
                recourcePerson: formData.recourcePerson,
                expertSubject: formData.expertSubject,
                trainingDuration: parseInt(formData.trainingDuration, 10),
                participantCategory:
                    formData.participantCategory === 'Others'
                        ? formData.otherParticipantCategory
                        : formData.participantCategory,
                venue: formData.venue,
                timeFrom: formData.timeFrom,
                timeTo: formData.timeTo,
            }),
        };

        try {
            let response;
            if (isTraining) {
                response = await saveTrainingConfiguration(payload);
                enqueueSnackbar('Training data saved successfully!', { variant: 'success' });
            } else {
                response = await saveCommonExpenditureConfiguration(payload);
                enqueueSnackbar('Common expenditure data saved successfully!', { variant: 'success' });
            }
            console.log('Saved data:', response);
            handleReset();
        } catch (error) {
            console.error('Error saving training data:', error);
            enqueueSnackbar('Failed to save. Please try again.', { variant: 'error' });
        }
    };

    const handleReset = () => {
        setFormData({
            projectName: '',
            componentName: '',
            activityName: '',
            activityCode: '',
            maleCount: '',
            femaleCount: '',
            otherCount: '',
            recourcePerson: '',
            expertSubject: '',
            taskName: '',
            typeOfUnit: '',
            units: '1',
            ratePerUnit: '',
            totalCost: '',
            trainingDuration: '',
            participantCategory: '',
            otherParticipantCategory: '',
            venue: '',
            timeFrom: '',
            timeTo: '',
            beneficiaryContribution: '',
            grandTotal: '',
        });
        setShowActivityDropdown(false);
        setShowTaskDropdown(false);
    };

    /* ================= UI ================= */
    return (
        <Container sx={{ maxHeight: '80vh', overflowY: 'auto', p: 2 }}>
            <Box>
                {/* Project */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Project Name</InputLabel>
                    <Select
                        name="projectName"
                        value={formData.projectName}
                        onChange={(e) => {
                            handleChange(e);
                            setShowActivityDropdown(false);
                            setShowTaskDropdown(false);
                        }}
                    >
                        <MenuItem value="">Select Project</MenuItem>
                        {projects.map((p) => (
                            <MenuItem key={p.id} value={p.projectName}>
                                {p.projectName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Component */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Component</InputLabel>
                    <Select
                        name="componentName"
                        value={formData.componentName}
                        onChange={(e) => {
                            handleChange(e);
                            setShowActivityDropdown(true);
                        }}
                    >
                        <MenuItem value="">Select Component</MenuItem>
                        {components.map((c) => (
                            <MenuItem key={c.id} value={c.componentName}>
                                {c.componentName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Activity */}
                {showActivityDropdown && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Activity</InputLabel>
                        <Select
                            name="activityName"
                            value={formData.activityName}
                            onChange={(e) => {
                                handleChange(e);
                                setShowTaskDropdown(true);
                            }}
                        >
                            <MenuItem value="">Select Activity</MenuItem>
                            {activities.map((a) => (
                                <MenuItem key={a.id} value={a.activityName}>
                                    {a.activityName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Task */}
                {showTaskDropdown && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Task</InputLabel>
                        <Select name="taskName" value={formData.taskName} onChange={handleChange}>
                            <MenuItem value="">Select Task</MenuItem>
                            {tasks.map((t) => (
                                <MenuItem key={t.id} value={t.taskName}>
                                    {t.taskName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {/* Training Specific Fields */}
                {isExpenditure && (
                    <TextField
                         required
                         fullWidth
                         margin="normal"
                         label="Description"
                         name="activityCode"
                         value={formData.activityCode}
                         onChange={handleChange}
                     />
                )}
                {isTraining && (
                    <>
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Training Name"
                            name="activityCode"
                            value={formData.activityCode}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Duration of Training (No. of days)"
                            name="trainingDuration"
                            type="number"
                            inputProps={{ min: 1 }}
                            value={formData.trainingDuration}
                            onChange={handleChange}
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Category of Participants</InputLabel>
                            <Select
                                name="participantCategory"
                                value={formData.participantCategory}
                                onChange={handleChange}
                            >
                                <MenuItem value="">Select Category</MenuItem>
                                {participantCategories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {formData.participantCategory === 'Others' && (
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Specify Other Category"
                                name="otherParticipantCategory"
                                value={formData.otherParticipantCategory}
                                onChange={handleChange}
                            />
                        )}
<Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="Male Count"
                    name="maleCount"
                    type="number"
                    value={formData.maleCount}
                    onChange={handleChange}
                    error={!!errors.maleCount}
                    helperText={errors.maleCount}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="Female Count"
                    name="femaleCount"
                    type="number"
                    value={formData.femaleCount}
                    onChange={handleChange}
                    error={!!errors.femaleCount}
                    helperText={errors.femaleCount}
                />
            </Grid>

            <Grid item xs={12} sm={4}>
                <TextField
                    fullWidth
                    label="Other Count"
                    name="otherCount"
                    type="number"
                    value={formData.otherCount}
                    onChange={handleChange}
                    error={!!errors.otherCount}
                    helperText={errors.otherCount}
                />
            </Grid>
         </Grid>
                             <TextField
                                     required
                                     fullWidth
                                     margin="normal"
                                     label="Resource Person"
                                     name="recourcePerson"
                                     value={formData.recourcePerson}
                                     onChange={handleChange}
                                     error={!!errors.recourcePerson}
                                     helperText={errors.recourcePerson}
                                 />

                                 <TextField
                                     required
                                     fullWidth
                                     margin="normal"
                                     label="Expert Subject"
                                     name="expertSubject"
                                     value={formData.expertSubject}
                                     onChange={handleChange}
                                     error={!!errors.expertSubject}
                                     helperText={errors.expertSubject}
                                 />

                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Venue"
                            name="venue"
                            value={formData.venue}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Time From"
                            type="datetime-local"
                            name="timeFrom"
                            InputLabelProps={{ shrink: true }}
                            value={formatToDateTimeLocal(formData.timeFrom)}
                            onChange={handleChange}
                        />

                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Time To"
                            type="datetime-local"
                            name="timeTo"
                            InputLabelProps={{ shrink: true }}
                            value={formatToDateTimeLocal(formData.timeTo)}
                            onChange={handleChange}
                        />
                    </>
                )}
                {isExpenditure && (
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        label="Type of Unit"
                        name="typeOfUnit"
                        value={formData.typeOfUnit}
                        onChange={handleChange}
                        error={!!errors.typeOfUnit}
                        helperText={errors.typeOfUnit}
                    />
                )}
                {/* Common */}
                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Units"
                    name="units"
                    type="number"
                    inputProps={{ min: 1 }}
                    value={formData.units}
                    onChange={handleChange}
                />

                <TextField
                    required
                    fullWidth
                    margin="normal"
                    label="Rate per Unit"
                    name="ratePerUnit"
                    type="number"
                    value={formData.ratePerUnit}
                    onChange={handleChange}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    label="Total Cost"
                    name="totalCost"
                    type="number"
                    value={formData.totalCost}
                    disabled
                />
            {isExpenditure && (
                    <>
                        <TextField
                            required
                            fullWidth
                            margin="normal"
                            label="Community Contribution"
                            name="beneficiaryContribution"
                            type="number"
                            value={formData.beneficiaryContribution}
                            onChange={handleChange}
                            error={!!errors.beneficiaryContribution}
                            helperText={errors.beneficiaryContribution}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Grand Total"
                            name="grandTotal"
                            value={formData.grandTotal}
                            disabled
                        />
                    </>
                )}
                <Box mt={3} display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" onClick={handleReset}>
                        Reset
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default TrainingForm;
