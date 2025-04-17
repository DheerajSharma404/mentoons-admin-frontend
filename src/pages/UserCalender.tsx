import React, { useState } from 'react';
import CalendarComponent from "../components/common/UseCalender";
import { IEvent } from '../types';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const UserCalender = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<IEvent>({ title: '', start: new Date(), end: new Date(), type: 'event', status: 'pending' });
  const [events, setEvents] = useState<IEvent[]>([
    { title: 'Sick Leave', start: new Date('2024-10-02'), end: new Date('2024-10-02'), type: 'leave', status: 'pending' },
    { title: 'Sick Leave 2', start: new Date('2024-10-09'), end: new Date('2024-10-09'), type: 'leave', status: 'rejected' },
    { title: 'Sick Leave 3', start: new Date('2024-10-15'), end: new Date('2024-10-15'), type: 'leave', status: 'approved' }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    const endDate = selection.endDate ? new Date(selection.endDate) : new Date();
    endDate.setDate(endDate.getDate());
    console.log(ranges)
    setFormData({
      ...formData,
      start: selection.startDate || new Date(),
      end: endDate
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const eventToAdd = formData.type === 'event' ? { ...formData, status: undefined } : formData;
    setEvents([...events, eventToAdd]);
    setShowForm(false);
  };

  return (
    <div className="flex flex-col h-full p-6 w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Calender</h1>
        <button
          className={`bg-${showForm ? 'red' : 'blue'}-500 hover:bg-${showForm ? 'red' : 'blue'}-700 text-white font-bold py-2 px-4 rounded`}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close' : 'Add Event'}
        </button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
              Date Range
            </label>
            <div className='max-w-[22rem]'>
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={[{
                  startDate: formData.start,
                  endDate: formData.end,
                  key: 'selection'
                }]}
                onChange={handleDateChange}
                className="shadow appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="event">Event</option>
              <option value="leave">Leave</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
      )}
      <div className="flex-1 overflow-hidden bg-white rounded-lg p-6">
        <CalendarComponent events={events} />
      </div>
    </div>
  );
};

export default UserCalender;
