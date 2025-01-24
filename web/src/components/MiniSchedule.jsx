import React from 'react';

export default function MiniSchedule({ EventName, EventStartTime }) {
  const Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const date = new Date(EventStartTime);
  const MonthNumber = date.getMonth();
  const day = date.getDate();

  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' }).slice(0, 3);
  const Month = Months[MonthNumber];

  return (
    <div className="w-full bg-white m-3 rounded-md">
      <div className="">
      <span className="">{weekday} </span>
        <span className="">{Month} </span>
        <span className="">{day}</span>
      </div>
      <div className="child-container">
        <span className="">{EventName}</span>
      </div>
      <div className="child-container">
        <span className="text-orange-400">View Event</span>
      </div>
    </div>
  );
}
