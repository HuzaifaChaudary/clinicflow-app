import { useState } from 'react';
import { Appointment } from '../components/AppointmentRow';
import { ScheduleDayView } from '../components/schedule/ScheduleDayView';
import { PatientSidePanel } from '../components/PatientSidePanel';

interface ScheduleDayViewPageProps {
  appointments: Appointment[];
}

export function ScheduleDayViewPage({ appointments }: ScheduleDayViewPageProps) {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  const handleAppointmentClick = (id: string) => {
    setSelectedAppointmentId(id);
  };

  const handleClosePanel = () => {
    setSelectedAppointmentId(null);
  };

  const selectedAppointment = selectedAppointmentId
    ? appointments.find(apt => apt.id === selectedAppointmentId)
    : null;

  return (
    <>
      <ScheduleDayView
        appointments={appointments}
        onAppointmentClick={handleAppointmentClick}
        startHour={8}
        endHour={18}
      />

      {/* Patient side panel */}
      {selectedAppointment && (
        <PatientSidePanel
          appointment={selectedAppointment}
          onClose={handleClosePanel}
        />
      )}
    </>
  );
}
