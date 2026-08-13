import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Badge, IconButton, Popover, Box, Typography, List, ListItem,
  ListItemText, Divider, Button, Chip, CircularProgress
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { getBroadcastsForUser, markAllBroadcastsRead } from '../DataCenter/apiService';

const POLL_MS = 60_000; // poll every 60s

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const NotificationBell = ({ empId }) => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const timerRef = useRef(null);

  const fetchBroadcasts = useCallback(() => {
    if (!empId) return;
    getBroadcastsForUser(empId)
      .then(data => setBroadcasts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [empId]);

  useEffect(() => {
    fetchBroadcasts();
    timerRef.current = setInterval(fetchBroadcasts, POLL_MS);
    return () => clearInterval(timerRef.current);
  }, [fetchBroadcasts]);

  const unreadCount = broadcasts.filter(b => !b.read).length;

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    // mark all as read when panel opens
    if (unreadCount > 0) {
      markAllBroadcastsRead(empId)
        .then(() => setBroadcasts(prev => prev.map(b => ({ ...b, read: true }))))
        .catch(() => {});
    }
  };

  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen} size="large">
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 360, maxHeight: 480, display: 'flex', flexDirection: 'column' } }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={700} fontSize="0.95rem">
            Notifications
            {unreadCount > 0 && <Chip label={unreadCount} color="error" size="small" sx={{ ml: 1, height: 18, fontSize: '0.65rem' }} />}
          </Typography>
          <DoneAllIcon sx={{ fontSize: 18, color: '#64748b' }} />
        </Box>

        {/* List */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          {broadcasts.length === 0 ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 36, color: '#cbd5e1', mb: 1 }} />
              <Typography variant="body2" color="text.secondary">No notifications today</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {broadcasts.map((b, i) => (
                <React.Fragment key={b.id}>
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 2, py: 1.2,
                      backgroundColor: b.read ? 'transparent' : 'rgba(59,130,246,0.06)',
                      borderLeft: b.read ? '3px solid transparent' : '3px solid #3b82f6',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight={b.read ? 400 : 700} sx={{ lineHeight: 1.4 }}>
                          {b.message}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">{timeAgo(b.createdAt)}</Typography>
                          <Chip
                            label={b.targetType === 'ALL' ? 'General' : b.targetType === 'ROLE' ? 'Role' : 'Direct'}
                            size="small"
                            sx={{ height: 16, fontSize: '0.6rem', backgroundColor: '#f1f5f9' }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {i < broadcasts.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  );
};

export default NotificationBell;
