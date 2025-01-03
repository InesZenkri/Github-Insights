// Ensures data is serializable by removing non-JSON values
export const sanitizeData = <T>(data: T): T => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error('Failed to sanitize data:', error);
    throw new Error('Invalid data structure');
  }
};