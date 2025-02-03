import { insertUserAction } from "@/actions/user";

const insertUserData = async (
  userId: string,
  fullName: string | null,
  email: string,
) => {
  const userData = {
    id: userId,
    name: fullName,
    email,
  };

  try {
    await insertUserAction(userData);
  } catch (error) {
    console.error("Failed to update user data:", error);
  }
};

export default insertUserData;
