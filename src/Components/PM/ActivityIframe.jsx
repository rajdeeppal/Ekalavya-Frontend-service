import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Alert, Checkbox, FormControlLabel } from '@mui/material';

function ActivityIframe({ taskName, onSave, typeOfUnit, unitRate }) {
  const [activity, setActivity] = useState({
    task: taskName,
    typeOfUnit: typeOfUnit,
    ratePerUnit: unitRate,
    noOfUnits: '',
    totalCost: '',
    beneficiaryContribution: '',
    grantAmount: '',
    yearOfSanction: '',
    financialExtension: false
  });

  const [errors, setErrors] = useState({});
  const [backupFinancials, setBackupFinancials] = useState(null); // ✅ store old values

  useEffect(() => {
    setActivity((prev) => {
      const rate = parseFloat(unitRate) || 0;
      const units = parseFloat(prev.noOfUnits) || 0;
      const beneficiary = parseFloat(prev.beneficiaryContribution) || 0;

      const totalCost = rate && units ? rate * units : '';
      const grantAmount = totalCost !== '' ? totalCost - beneficiary : '';

      return {
        ...prev,
        typeOfUnit,
        ratePerUnit: unitRate,
        totalCost,
        grantAmount,
      };
    });
  }, [typeOfUnit, unitRate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedActivity = { ...activity, [name]: value };

    if (!updatedActivity.financialExtension) {
      if (name === 'ratePerUnit' || name === 'noOfUnits') {
        const ratePerUnit = name === 'ratePerUnit' ? value : updatedActivity.ratePerUnit;
        const noOfUnits = name === 'noOfUnits' ? value : updatedActivity.noOfUnits;

        if (ratePerUnit && noOfUnits) {
          updatedActivity.totalCost = parseFloat(ratePerUnit) * parseFloat(noOfUnits);
        }
      }

      if (name === 'beneficiaryContribution' || name === 'totalCost' || name === 'noOfUnits') {
        const beneficiaryContribution = name === 'beneficiaryContribution' ? value : updatedActivity.beneficiaryContribution;
        const totalCost = name === 'totalCost' ? value : updatedActivity.totalCost;

        if (beneficiaryContribution && totalCost) {
          updatedActivity.grantAmount = parseFloat(totalCost) - parseFloat(beneficiaryContribution);
        }
      }
    }

    setActivity(updatedActivity);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!activity.noOfUnits) formErrors.noOfUnits = 'Number of Units is required';
    if (!activity.financialExtension) {
      if (!activity.totalCost) formErrors.totalCost = 'Total Cost is required';
      if (!activity.beneficiaryContribution) formErrors.beneficiaryContribution = 'Beneficiary Contribution is required';
      if (!activity.grantAmount) formErrors.grantAmount = 'Grant Amount is required';
      if (!activity.yearOfSanction) formErrors.yearOfSanction = 'Year of Sanction is required';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    onSave(activity);

    setActivity({
      task: taskName,
      typeOfUnit: typeOfUnit,
      ratePerUnit: unitRate,
      noOfUnits: '',
      totalCost: '',
      beneficiaryContribution: '',
      grantAmount: '',
      yearOfSanction: '',
      financialExtension: false
    });
    setBackupFinancials(null); // clear backup
  };

  return (
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

        {/* ✅ Checkbox with restore/backup logic */}
        <FormControlLabel
          control={
            <Checkbox
              checked={activity.financialExtension}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  // ✅ Save backup before clearing
                  setBackupFinancials({
                    totalCost: activity.totalCost,
                    beneficiaryContribution: activity.beneficiaryContribution,
                    grantAmount: activity.grantAmount,
                    yearOfSanction: activity.yearOfSanction,
                  });

                  setActivity((prev) => ({
                    ...prev,
                    financialExtension: true,
                    totalCost: '',
                    beneficiaryContribution: '',
                    grantAmount: '',
                    yearOfSanction: '',
                  }));
                } else {
                  // ✅ Restore backup values when unchecked
                  setActivity((prev) => ({
                    ...prev,
                    financialExtension: false,
                    ...backupFinancials,
                  }));
                }
              }}
              color="primary"
            />
          }
          label="No Financial Extension"
        />

        <TextField
          label="Total Cost"
          name="totalCost"
          type="number"
          value={activity.totalCost}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={activity.financialExtension}
          sx={activity.financialExtension ? { bgcolor: '#f0f0f0' } : {}}
        />
        {!activity.financialExtension && errors.totalCost && (
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
          disabled={activity.financialExtension}
          sx={activity.financialExtension ? { bgcolor: '#f0f0f0' } : {}}
        />
        {!activity.financialExtension && errors.beneficiaryContribution && (
          <Alert severity="error" sx={{ marginTop: 1 }}>
            {errors.beneficiaryContribution}
          </Alert>
        )}

        <TextField
          label="Grant Amount"
          name="grantAmount"
          type="number"
          value={activity.grantAmount}
          variant="outlined"
          fullWidth
          margin="normal"
          disabled={activity.financialExtension}
          sx={activity.financialExtension ? { bgcolor: '#f0f0f0' } : {}}
        />
        {!activity.financialExtension && errors.grantAmount && (
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
          disabled={activity.financialExtension}
          sx={activity.financialExtension ? { bgcolor: '#f0f0f0' } : {}}
        />
        {!activity.financialExtension && errors.yearOfSanction && (
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
