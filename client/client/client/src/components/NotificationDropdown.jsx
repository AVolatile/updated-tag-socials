import { Box, Typography, IconButton, Badge, Popover } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import { useState } from "react";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const notifications = useSelector((state) => state.user.notifications || []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      <IconButton onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <Notifications sx={{ fontSize: "25px" }} />
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{ sx: { p: 2, width: "300px" } }}
      >
        <Typography variant="h6" gutterBottom>
          Notifications
        </Typography>
        {notifications.length === 0 ? (
          <Typography color="text.secondary">No notifications</Typography>
        ) : (
          notifications.map((noti, index) => (
            <Box key={index} mb={1}>
              <Typography fontSize="0.9rem">{noti.message}</Typography>
              <Typography fontSize="0.7rem" color="text.secondary">
                {new Date(noti.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        )}
      </Popover>
    </>
  );
};

export default NotificationDropdown;
