import React, { useState } from 'react';
import { Container, TextField, Button, Alert } from '@mui/material';

function ActivityIframe({ taskName, onSave, typeOfUnit, unitRate }) {
  const [activity, setActivity] = useState({
    task: taskName,
    // nameOfWork: '',
    typeOfUnit: typeOfUnit,
    ratePerUnit: unitRate,
    noOfUnits: '',
    totalCost: '',
    beneficiaryContribution: '',
    grantAmount: '',
    yearOfSanction: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedActivity = { ...activity, [name]: value };

    if (name === 'ratePerUnit' || name === 'noOfUnits') {
        const ratePerUnit = name === 'ratePerUnit' ? value : updatedActivity.ratePerUnit;
        const noOfUnits = name === 'noOfUnits' ? value : updatedActivity.noOfUnits;

        // Calculate totalCost if both unitRate and noOfUnits are defined
        if (ratePerUnit && noOfUnits) {
            updatedActivity.totalCost = parseFloat(ratePerUnit) * parseFloat(noOfUnits);
        }
    }

    setActivity(updatedActivity);
    // Clear the error for the changed field
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
};

  const validateForm = () => {
    let formErrors = {};
    // if (!activity.nameOfWork) formErrors.nameOfWork = 'Number of Work is required';
    if (!activity.noOfUnits) formErrors.noOfUnits = 'Number of Units is required';
    if (!activity.totalCost) formErrors.totalCost = 'Total Cost is required';
    if (!activity.beneficiaryContribution) formErrors.beneficiaryContribution = 'Beneficiary Contribution is required';
    if (!activity.grantAmount) formErrors.grantAmount = 'Grant Amount is required';
    if (!activity.yearOfSanction) formErrors.yearOfSanction = 'Year of Sanction is required';

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave(activity);
    setActivity({
      task: taskName,
      // nameOfWork: '',
      typeOfUnit: typeOfUnit,
      ratePerUnit: unitRate,
      noOfUnits: '',
      totalCost: '',
      beneficiaryContribution: '',
      grantAmount: '',
      yearOfSanction: '',
    });
    // setErrors({});
  };

  return  (
    <Container sx={{ marginTop: 5 }}>
      <form>
        <TextField
          label="Task Name"
          value={taskName}
          InputProps={{ readOnly: true }}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        {/* <TextField
          label="Name of Work"
          name="nameOfWork"
          value={activity.nameOfWork}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {errors.nameOfWork && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.nameOfWork}
          </Alert>
        )} */}

        <TextField
          label="Type of Unit"
          value={typeOfUnit}
          InputProps={{ readOnly: true }}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Unit Rate"
          type="number"
          value={unitRate}
          InputProps={{ readOnly: true }}
          variant="outlined"
          fullWidth
          margin="normal"
        />

        <TextField
          label="No of Units"
          name="noOfUnits"
          type="number"
          value={activity.noOfUnits}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {errors.noOfUnits && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.noOfUnits}
          </Alert>
        )}

        <TextField
          label="Total Cost"
          name="totalCost"
          type="number"
          value={activity.totalCost}
          variant="outlined"
          fullWidth
          margin="normal"
          readonly
        />
        {errors.totalCost && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.totalCost}
          </Alert>
        )}

        <TextField
          label="Beneficiary Contribution"
          name="beneficiaryContribution"
          type="number"
          value={activity.beneficiaryContribution}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {errors.beneficiaryContribution && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.beneficiaryContribution}
          </Alert>
        )}

        <TextField
          label="Grant Amount"
          name="grantAmount"
          type="number"
          value={activity.grantAmount}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {errors.grantAmount && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.grantAmount}
          </Alert>
        )}

        <TextField
          label="Year of Sanction"
          name="yearOfSanction"
          type="number"
          value={activity.yearOfSanction}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        {errors.yearOfSanction && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.yearOfSanction}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ marginTop: 2 }}
        >
          Save
        </Button>
      </form>
    </Container>
  );
}

export default ActivityIframe;
