import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  useTheme,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";

const EditProfileWidget = ({ open, onClose, user, onSave }) => {
  const [form, setForm] = useState({
    location: "",
    occupation: "",
    picture: null,
  });
  const [originalForm, setOriginalForm] = useState({});
  const [previewUrl, setPreviewUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (user) {
      const initial = {
        location: user.location || "",
        occupation: user.occupation || "",
        picture: null,
      };
      setForm(initial);
      setOriginalForm(initial);
      setPreviewUrl(`${process.env.REACT_APP_API_URL}/assets/${user.picturePath}`);
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("location", form.location);
    formData.append("occupation", form.occupation);
    if (form.picture) {
      formData.append("picture", form.picture);
    }

    await onSave(formData);
    setIsSaving(false);
    setSuccessOpen(true);
    onClose();
  };

  const isFormChanged =
    form.location !== originalForm.location ||
    form.occupation !== originalForm.occupation ||
    form.picture !== null;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            pt: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            InputProps={{
              sx: {
                borderRadius: "10px",
                fontSize: "1rem",
                paddingY: "0.75rem",
                backgroundColor: theme.palette.background.alt,
              },
            }}
          />

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Occupation"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            InputProps={{
              sx: {
                borderRadius: "10px",
                fontSize: "1rem",
                paddingY: "0.75rem",
                backgroundColor: theme.palette.background.alt,
              },
            }}
          />

          <Dropzone
            acceptedFiles=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => {
              const file = acceptedFiles[0];
              setForm({ ...form, picture: file });
              setPreviewUrl(URL.createObjectURL(file));
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <Box
                {...getRootProps()}
                border={`2px dashed ${theme.palette.primary.main}`}
                borderRadius="8px"
                p="1rem"
                textAlign="center"
                sx={{
                  cursor: "pointer",
                  backgroundColor: theme.palette.background.alt,
                }}
              >
                <input {...getInputProps()} />
                <Typography color="textSecondary">
                  {form.picture
                    ? form.picture.name
                    : "Click or drag to upload a new profile picture"}
                </Typography>
              </Box>
            )}
          </Dropzone>

          {previewUrl && (
            <Box textAlign="center" mt={1}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: `2px solid ${theme.palette.primary.main}`,
                }}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: "1rem 2rem" }}>
          <Button onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSaving || !isFormChanged}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.alt,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessOpen(false)}
        >
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProfileWidget;
