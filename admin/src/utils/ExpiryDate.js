function expiryDate(dateStr, daysToAdd) {
  // console.log(dateStr);
  // Parse the input string for different time units
  const regex = /(\d+)\s*(years?|months?|days?)/gi;
  let years = 0,
    months = 0,
    days = 0;

  let match;
  while ((match = regex.exec(dateStr)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("year")) {
      years = value;
    } else if (unit.startsWith("month")) {
      months = value;
    } else if (unit.startsWith("day")) {
      days = value;
    }
  }

  const currentDate = new Date(); // Get the current date

  if (isNaN(currentDate.getTime())) {
    throw new Error("Invalid current date.");
  }

  // Add years, months, and days to the current date
  currentDate.setFullYear(currentDate.getFullYear() + years);
  currentDate.setMonth(currentDate.getMonth() + months);
  currentDate.setDate(currentDate.getDate() + days + daysToAdd);

  // console.log(currentDate.toISOString().split("T")[0]);

  // Return the formatted date as YYYY-MM-DD
  return currentDate.toISOString().split("T")[0];
}

export default expiryDate;
