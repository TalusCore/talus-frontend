export const formatDate = (timestamp: Date): string => {
  const hours = timestamp.getHours().toString().padStart(2, '0');
  const minutes = timestamp.getMinutes().toString().padStart(2, '0');

  return `${timestamp.getDate()}/${
    timestamp.getMonth() + 1
  }/${timestamp.getFullYear()} ${hours}:${minutes}`;
};

export const errorMessage = (
  value: string,
  startDate: Date,
  endDate: Date
): string => {
  if (!value || value === '') {
    return 'Please select a stat.';
  }

  if (startDate > endDate) {
    return 'Start date must be before end date.';
  }

  return 'No data available for the selected date range.';
};
