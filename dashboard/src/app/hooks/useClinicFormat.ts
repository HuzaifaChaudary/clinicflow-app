/**
 * Hook to get clinic format settings and formatting functions
 */
import { useClinicSettings } from './useApi';
import { formatDate, formatTime, formatDateTime, formatDateLong, formatDateShort, ClinicFormatSettings } from '../utils/dateFormat';

export function useClinicFormat() {
  const { data: settings } = useClinicSettings();
  
  const formatSettings: ClinicFormatSettings = {
    timezone: settings?.timezone || 'America/New_York',
    date_format: settings?.date_format || 'MM/DD/YYYY',
    time_format: settings?.time_format || '12h',
  };
  
  return {
    settings: formatSettings,
    formatDate: (date: Date | string) => formatDate(date, formatSettings),
    formatTime: (time: Date | string | { hours: number; minutes: number }) => formatTime(time, formatSettings),
    formatDateTime: (datetime: Date | string) => formatDateTime(datetime, formatSettings),
    formatDateLong: (date: Date | string) => formatDateLong(date, formatSettings),
    formatDateShort: (date: Date | string) => formatDateShort(date, formatSettings),
  };
}

