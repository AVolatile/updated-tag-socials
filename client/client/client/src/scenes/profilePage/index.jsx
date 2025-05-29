import { Box, useMediaQuery, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import EditProfileWidget from "scenes/widgets/EditProfileWidget";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const loggedInUser = useSelector((state) => state.user); // ✅ logged-in user
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

const getUser = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  setUser(data);
};

const handleSave = async (formData) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const updatedUser = await response.json();
  setUser(updatedUser);
};


  useEffect(() => {
    getUser();
  }, [userId]);

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
            setEditOpen={setEditOpen}
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* ✅ Only show "Create Post" if it's the logged-in user's profile */}
          {loggedInUser._id === userId && (
            <MyPostWidget picturePath={loggedInUser.picturePath} />
          )}
          <Box m="2rem 0" />
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>

      <EditProfileWidget
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ProfilePage;
