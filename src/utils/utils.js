export const formatTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.abs(now - date) / 1000;
  const days = Math.floor(diffInSeconds / 86400);
  const hours = Math.floor(diffInSeconds / 3600) % 24;
  const minutes = Math.floor(diffInSeconds / 60) % 60;

  if (days > 0) {
    return `${days}d`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else if (minutes > 0) {
    return `${minutes}m`;
  } else {
    return "now";
  }
};
