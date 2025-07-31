export function formatDate(dateString: string | Date) {
  try {
    let date: Date;
    
    // Handle different date formats
    if (dateString instanceof Date) {
      date = dateString;
    } else if (typeof dateString === 'string') {
      // If it's an ISO string or other format
      date = new Date(dateString);
    } else {
      // If it's another type, try to convert
      date = new Date(String(dateString));
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateString);
      return 'Invalid Date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateString);
    return 'Date Format Error';
  }
}
