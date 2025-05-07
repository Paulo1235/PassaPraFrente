const formatDate = (date) => {
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC", // ou altere para "Europe/Lisbon" se quiser hora local de Portugal
  };
  return date.toLocaleString("pt-PT", options);
};

function formatDateProposal(datetimeString) {
  if (!datetimeString) return "";
  const date = new Date(datetimeString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // Formato "YYYY-MM-DDTHH:MM"
}

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export { formatDate, convertToBase64, formatDateProposal };
