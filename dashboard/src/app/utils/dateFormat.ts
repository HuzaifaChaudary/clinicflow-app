/**
 * Date and time formatting utilities using clinic settings
 */

export interface ClinicFormatSettings {
  timezone: string;
  date_format: string;
  time_format: string;
}

/**
 * Format a date string according to clinic settings
 */
export function formatDate(
  date: Date | string,
  settings: ClinicFormatSettings
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  // Convert to clinic timezone
  const timezone = settings.timezone || 'America/New_York';
  const dateFormat = settings.date_format || 'MM/DD/YYYY';
  
  // Format date based on clinic settings
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  
  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === 'year')?.value || '';
  const month = parts.find(p => p.type === 'month')?.value || '';
  const day = parts.find(p => p.type === 'day')?.value || '';
  
  switch (dateFormat) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
    default:
      return `${month}/${day}/${year}`;
  }
}

/**
 * Format a time string according to clinic settings
 */
export function formatTime(
  time: Date | string | { hours: number; minutes: number },
  settings: ClinicFormatSettings
): string {
  let hours: number;
  let minutes: number;
  
  if (typeof time === 'string') {
    // Parse time string (HH:MM or HH:MM:SS)
    const parts = time.split(':');
    hours = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
  } else if (time instanceof Date) {
    hours = time.getHours();
    minutes = time.getMinutes();
  } else {
    hours = time.hours;
    minutes = time.minutes;
  }
  
  const timeFormat = settings.time_format || '12h';
  
  if (timeFormat === '24h') {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    // 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
}

/**
 * Format a datetime according to clinic settings
 */
export function formatDateTime(
  datetime: Date | string,
  settings: ClinicFormatSettings
): string {
  const dateObj = typeof datetime === 'string' ? new Date(datetime) : datetime;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const dateStr = formatDate(dateObj, settings);
  const timeStr = formatTime(dateObj, settings);
  
  return `${dateStr} ${timeStr}`;
}

/**
 * Format a date for display (e.g., "Monday, January 15, 2026")
 */
export function formatDateLong(
  date: Date | string,
  settings: ClinicFormatSettings
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const timezone = settings.timezone || 'America/New_York';
  
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format a date for display (e.g., "Jan 15" or "15 Jan" based on format)
 */
export function formatDateShort(
  date: Date | string,
  settings: ClinicFormatSettings
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const timezone = settings.timezone || 'America/New_York';
  const dateFormat = settings.date_format || 'MM/DD/YYYY';
  
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
  });
  
  if (dateFormat === 'DD/MM/YYYY') {
    // European format: "15 Jan"
    const parts = formatter.formatToParts(dateObj);
    const day = parts.find(p => p.type === 'day')?.value || '';
    const month = parts.find(p => p.type === 'month')?.value || '';
    return `${day} ${month}`;
  } else {
    // US format: "Jan 15"
    return formatter.format(dateObj);
  }
}

