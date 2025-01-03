function convertTo24HourFormat(time12Hour: string): string {
  // Match the time string with the format HH:MM AM/PM
  const match = time12Hour.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) {
    throw new Error("Invalid time format. Expected format: HH:MM AM/PM");
  }

  let [_, hours, minutes, period] = match;
  let hours24 = parseInt(hours);

  if (period.toUpperCase() === "PM" && hours24 !== 12) {
    hours24 += 12;
  } else if (period.toUpperCase() === "AM" && hours24 === 12) {
    hours24 = 0;
  }

  // Pad hours to always have two digits
  const hours24Padded = hours24.toString().padStart(2, "0");

  return `${hours24Padded}:${minutes}`;
}
