export function truncateData(data, wordLimit) {
  if (typeof data !== "string") {
    console.error("Expected data to be a string, but received:", data);
    return "";
  }

  const words = data.split(" ");
  if (words.length <= wordLimit) {
    return data;
  }

  return words.slice(0, wordLimit).join(" ") + "...";
}
