import React from 'react';

export default function MiniSchedule({ EventName, EventStartTime }) {
  const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const date = new Date(EventStartTime);
  const MonthNumber = date.getMonth();
  const day = date.getDate();

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3);
  const Month = Months[MonthNumber];

  return (
    <div className="container">
      <div className="child-container">
        <span className="bold">{Month}</span>
        <span className="orange">{day}</span>
        <span className="bold">{weekday}</span>
      </div>
      <div className="child-container">
        <span className="bold">{EventName}</span>
      </div>
      <div className="child-container">
        <span className="grey">View Event</span>
      </div>
    </div>
  );
}
