import toastMessages from "../data/toast-messages";

const getToastMessage = () => {
  const randomIndex = Math.floor(Math.random() * toastMessages.length);
  return toastMessages[randomIndex];
};

export default getToastMessage;
