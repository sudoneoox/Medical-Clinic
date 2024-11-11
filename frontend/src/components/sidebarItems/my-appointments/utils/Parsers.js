export const parseAvailability = (availability) => {
  try {
    return typeof availability === "string"
      ? JSON.parse(availability)
      : availability;
  } catch (error) {
    console.error("Error parsing availability:", error);
    return [];
  }
};
