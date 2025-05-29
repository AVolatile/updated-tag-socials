import User from "../models/User.js";
import Post from "../models/Post.js"; // ✅ Add this import

/* READ */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE - Add or Remove Friend */
export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }

    await user.save();
    await friend.save();

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );

    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => ({
        _id,
        firstName,
        lastName,
        occupation,
        location,
        picturePath,
      })
    );

    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE - Profile Info + Profile Picture */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedFields = {
      location: req.body.location,
      occupation: req.body.occupation,
    };

    let newPicturePath = null;

    if (req.file) {
      newPicturePath = req.file.filename;
      updatedFields.picturePath = newPicturePath;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    // ✅ Sync new profile picture across all user's posts
    if (newPicturePath) {
      await Post.updateMany(
        { userId: id },
        { userPicturePath: newPicturePath }
      );
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("❌ Failed to update user:", err.message);
    res.status(500).json({ message: err.message });
  }
};

// ADD NOTIFICATION
export const addNotification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, fromUserId, postId, message } = req.body;

    const user = await User.findById(userId);
    user.notifications.unshift({
      type,
      fromUserId,
      postId,
      message,
      isRead: false,
    });

    await user.save();
    res.status(200).json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MARK AS READ
export const markNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    user.notifications.forEach((n) => (n.isRead = true));
    await user.save();
    res.status(200).json(user.notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
