function expiryDate(dateStr, daysToAdd) {
  const date = new Date(dateStr); // Directly parse the date string

  // Validate the parsed date
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format. Please use 'YYYY-MM-DD'.");
  }

  date.setDate(date.getDate() + daysToAdd); // Add the specified number of days

  return date.toISOString().split("T")[0]; // Return formatted date as YYYY-MM-DD
}

export default expiryDate;
