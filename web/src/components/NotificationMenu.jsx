import React, { useState, useRef, useEffect } from "react";
import { CiBellOn } from "react-icons/ci";

const TestNotifications = [
    { id: 1, text: "📢 Event A is starting soon!" },
    { id: 2, text: "🎉 Your request was approved!" },
    { id: 3, text: "⚠️ System maintenance at 10 PM." },
    { id: 4, text: "✅ Your schedule has been updated." },
    { id: 5, text: "🛑 A request was declined." },
    { id: 6, text: "🚀 New feature released!" },
    { id: 7, text: "🔔 Reminder: Meeting at 3 PM." },
  ];


//Chat-GPT 4 Used to create the notification model in "Industry Standard form" which I then editied -Tyson
const NotificationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  // Toggle the modal open/close
  const openModal = () => setIsOpen(!isOpen);

  // Close modal when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative">
      {/* Notification Button */}
      <button className="text-white text-3xl relative" onClick={openModal}>
        <CiBellOn className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
        {TestNotifications.length}
        </span>
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>

          {/* Notification Items */}
          {/* Scrollable Notifications Container */}
          <div className="max-h-60 overflow-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
            {TestNotifications.map((note) => (
              <div key={note.id} className="p-2 bg-gray-100 rounded-md text-black">
                <p>{note.text}</p>
              </div>
            ))}

          </div>

          {/* View All Button */}
          <button className="mt-3 text-blue-600 w-full text-sm hover:underline">
            View All
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationMenu;
