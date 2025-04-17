import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { IEvent } from '../../types';

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC<{ events: IEvent[] }> = ({ events }) => {
  const adjustedEvents = events.map(event => ({
    ...event,
    end: new Date(event.end.getTime() + 24 * 60 * 60 * 1000)
  }));

  const eventStyleGetter = (event: IEvent) => {
    let backgroundColor = '';
    if (event.type === 'leave') {
      switch (event.status) {
        case 'approved':
          backgroundColor = 'green';
          break;
        case 'rejected':
          backgroundColor = 'red';
          break;
        default:
          backgroundColor = 'blue';
      }
    } else {
      backgroundColor = 'blue';
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.9,
        color: 'white',
        border: '1px solid #ddd',
        display: 'block',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    };
  };

  return (
    <div style={{ height: '500pt', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
      <Calendar
        localizer={localizer}
        events={adjustedEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={(event: { title: string; type: string }) => `${event.title} (${event.type})`}
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default CalendarComponent;
