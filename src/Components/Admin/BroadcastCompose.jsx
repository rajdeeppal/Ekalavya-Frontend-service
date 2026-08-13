import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Select, FormControl,
  InputLabel, CircularProgress, Alert, Stack, Chip, Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { jwtDecode } from 'jwt-decode';
import { createBroadcast } from '../DataCenter/apiService';

const ROLES = ['PM', 'CFO', 'CEO', 'TRUSTEE', 'DOMAIN EXPERT', 'PROCUREMENT', 'SECRETARY', 'VICE_CHAIRMAN', 'PROJECT DIRECTOR', 'EADMIN'];

const BroadcastCompose = () => {
  const [message, setMessage] = useState('');
  const [targetType, setTargetType] = useState('ALL');
  const [targetValue, setTargetValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { type: 'success'|'error', msg }

  const adminEmpId = (() => {
    try { return jwtDecode(localStorage.getItem('jwtToken')).empId; } catch { return null; }
  })();

  const handleSend = async () => {
    if (!message.trim()) { setResult({ type: 'error', msg: 'Message cannot be empty.' }); return; }
    if (targetType !== 'ALL' && !targetValue.trim()) {
      setResult({ type: 'error', msg: 'Please specify a target value.' }); return;
    }
    setLoading(true);
    setResult(null);
    try {
      await createBroadcast({
        message: message.trim(),
        targetType,
        targetValue: targetType === 'ALL' ? null : targetValue.trim(),
        createdByEmpId: adminEmpId,
      });
      setResult({ type: 'success', msg: 'Broadcast sent successfully!' });
      setMessage('');
      setTargetValue('');
      setTargetType('ALL');
    } catch (e) {
      setResult({ type: 'error', msg: e?.response?.data || 'Failed to send broadcast.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>📢 Broadcast Message</Typography>

      <Paper elevation={2} sx={{ p: 3, maxWidth: 680 }}>
        <Stack spacing={2.5}>
          {result && <Alert severity={result.type} onClose={() => setResult(null)}>{result.msg}</Alert>}

          <FormControl fullWidth size="small">
            <InputLabel>Target Audience</InputLabel>
            <Select value={targetType} label="Target Audience" onChange={e => { setTargetType(e.target.value); setTargetValue(''); }}>
              <MenuItem value="ALL">🌐 All Users</MenuItem>
              <MenuItem value="ROLE">👥 By Role</MenuItem>
              <MenuItem value="EMP_ID">🪪 By Employee ID(s)</MenuItem>
            </Select>
          </FormControl>

          {targetType === 'ROLE' && (
            <FormControl fullWidth size="small">
              <InputLabel>Select Role</InputLabel>
              <Select value={targetValue} label="Select Role" onChange={e => setTargetValue(e.target.value)}>
                {ROLES.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          )}

          {targetType === 'EMP_ID' && (
            <TextField
              label="Employee ID(s) — comma separated"
              size="small" fullWidth
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
              placeholder="e.g. 1001, 1002, 1003"
              helperText="Enter one or more employee IDs separated by commas"
            />
          )}

          <TextField
            label="Message"
            multiline rows={4} fullWidth
            value={message}
            onChange={e => setMessage(e.target.value)}
            inputProps={{ maxLength: 1000 }}
            helperText={`${message.length}/1000`}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained" color="primary"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
              onClick={handleSend}
              disabled={loading}
            >
              Send Broadcast
            </Button>
            <Chip
              label={targetType === 'ALL' ? 'All Users' : targetType === 'ROLE' ? `Role: ${targetValue || '—'}` : `EmpIDs: ${targetValue || '—'}`}
              color={targetType === 'ALL' ? 'primary' : 'default'}
              size="small"
            />
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BroadcastCompose;
