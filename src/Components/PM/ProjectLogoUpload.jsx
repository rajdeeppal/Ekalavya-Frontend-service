import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import {
  Box, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions, Slider, Avatar,
  IconButton, Tooltip, LinearProgress
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CropIcon from '@mui/icons-material/Crop';

// ─── Helper: canvas crop ───────────────────────────────────────────────────────
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop, outputMimeType = 'image/jpeg') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image,
    pixelCrop.x, pixelCrop.y,
    pixelCrop.width, pixelCrop.height,
    0, 0,
    pixelCrop.width, pixelCrop.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, outputMimeType, 0.92);
  });
}

const MAX_SIZE_MB = 2;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
const ALLOWED_EXT_LABEL = 'PNG, JPG, JPEG, SVG, WEBP';

// ─── Main Component ────────────────────────────────────────────────────────────
/**
 * ProjectLogoUpload
 * Props:
 *   onLogoChange(file: File | null) — called whenever the cropped logo changes
 *   existingLogoUrl(string | null)  — URL of an existing logo to pre-display (edit mode)
 *   size(number)                    — avatar diameter in px (default 100)
 */
const ProjectLogoUpload = ({ onLogoChange, existingLogoUrl = null, size = 100 }) => {
  const fileInputRef = useRef(null);

  // raw image chosen by user (data URL for crop dialog)
  const [rawImageSrc, setRawImageSrc] = useState(null);
  const [rawMimeType, setRawMimeType] = useState('image/jpeg');

  // crop state
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // preview of the final cropped blob (object URL)
  const [previewUrl, setPreviewUrl] = useState(existingLogoUrl);

  // validation
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(`Unsupported file type. Allowed: ${ALLOWED_EXT_LABEL}`);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setRawMimeType(file.type === 'image/svg+xml' ? 'image/png' : file.type); // canvas can't output SVG
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
    // reset input so same file can be re-selected
    e.target.value = '';
  };

  const onCropComplete = useCallback((_croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // ── Confirm crop ────────────────────────────────────────────────────────────
  const handleCropConfirm = async () => {
    if (!rawImageSrc || !croppedAreaPixels) return;
    setProcessing(true);
    try {
      const blob = await getCroppedImg(rawImageSrc, croppedAreaPixels, rawMimeType);
      const ext = rawMimeType.split('/')[1] || 'jpg';
      const croppedFile = new File([blob], `project_logo.${ext}`, { type: rawMimeType });

      // Revoke old preview to avoid memory leak
      if (previewUrl && previewUrl !== existingLogoUrl) URL.revokeObjectURL(previewUrl);

      const objectUrl = URL.createObjectURL(blob);
      setPreviewUrl(objectUrl);
      onLogoChange(croppedFile);
      setCropDialogOpen(false);
      setRawImageSrc(null);
    } catch (err) {
      console.error('Crop failed:', err);
      setError('Failed to process image. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCropCancel = () => {
    setCropDialogOpen(false);
    setRawImageSrc(null);
  };

  // ── Remove logo ─────────────────────────────────────────────────────────────
  const handleRemoveLogo = () => {
    if (previewUrl && previewUrl !== existingLogoUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    onLogoChange(null);
    setError('');
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Logo avatar + action buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        {/* Avatar */}
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <Avatar
            src={previewUrl || undefined}
            sx={{
              width: size,
              height: size,
              bgcolor: previewUrl ? 'transparent' : 'primary.50',
              border: '2px dashed',
              borderColor: previewUrl ? 'primary.main' : 'grey.400',
              cursor: 'pointer',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              '&:hover': {
                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.18)',
                borderColor: 'primary.main',
              },
            }}
            onClick={triggerFileInput}
          >
            {!previewUrl && (
              <AddPhotoAlternateIcon sx={{ fontSize: size * 0.38, color: 'grey.500' }} />
            )}
          </Avatar>

          {/* Edit / Remove badge overlays */}
          {previewUrl && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                display: 'flex',
                gap: 0.5,
              }}
            >
              <Tooltip title="Change logo">
                <IconButton
                  size="small"
                  onClick={triggerFileInput}
                  sx={{
                    bgcolor: 'primary.main',
                    color: '#fff',
                    width: 26,
                    height: 26,
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove logo">
                <IconButton
                  size="small"
                  onClick={handleRemoveLogo}
                  sx={{
                    bgcolor: 'error.main',
                    color: '#fff',
                    width: 26,
                    height: 26,
                    '&:hover': { bgcolor: 'error.dark' },
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {/* Upload hint */}
        {!previewUrl && (
          <Button
            variant="text"
            size="small"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={triggerFileInput}
            sx={{ textTransform: 'none', color: 'primary.main', fontWeight: 500 }}
          >
            Upload project logo
          </Button>
        )}

        <Typography variant="caption" color="text.secondary" textAlign="center">
          {ALLOWED_EXT_LABEL} · max {MAX_SIZE_MB} MB
        </Typography>

        {error && (
          <Typography variant="caption" color="error.main" textAlign="center">
            {error}
          </Typography>
        )}
      </Box>

      {/* ── Crop Dialog ── */}
      <Dialog
        open={cropDialogOpen}
        onClose={handleCropCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 100%)',
            color: '#fff',
            fontWeight: 700,
          }}
        >
          <CropIcon />
          Crop Project Logo
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {/* Cropper area */}
          <Box sx={{ position: 'relative', width: '100%', height: 320, bgcolor: '#111' }}>
            {rawImageSrc && (
              <Cropper
                image={rawImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </Box>

          {/* Zoom slider */}
          <Box sx={{ px: 3, pt: 2, pb: 1 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Zoom
            </Typography>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              onChange={(_, val) => setZoom(val)}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${Math.round(v * 100)}%`}
              sx={{ color: 'primary.main' }}
            />
          </Box>

          {processing && <LinearProgress sx={{ mx: 3, mb: 1 }} />}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={handleCropCancel}
            variant="outlined"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCropConfirm}
            variant="contained"
            disabled={processing}
            startIcon={<CropIcon />}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            {processing ? 'Processing…' : 'Apply Crop'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProjectLogoUpload;
