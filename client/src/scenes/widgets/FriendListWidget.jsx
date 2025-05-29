import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFriends } from "state";

// ✅ Use env variable or fallback
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const FriendListWidget = ({ userId }) => {
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const [friends, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getFriends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch friends");
      const data = await response.json();

      // ✅ Update local and global friends list
      setFriendsList(data);
      dispatch(setFriends({ friends: data }));
    } catch (err) {
      console.error("❌ Error loading friends:", err.message);
      setFriendsList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]);

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {loading ? (
          <Typography color="text.secondary">Loading friends...</Typography>
        ) : friends.length > 0 ? (
          friends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
            />
          ))
        ) : (
          <Typography color="text.secondary">No friends to show.</Typography>
        )}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
