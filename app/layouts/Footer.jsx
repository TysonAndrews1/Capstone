import React from 'react';
import ManagerFooter from './ManagerFooter'; // Manager-specific footer component
import EmployeeFooter from './EmployeeFooter'; // Employee-specific footer component

export default function AppFooter({ role }) {
  // This will return the footer based on the role
  return role === "Manager" ? <ManagerFooter /> : <EmployeeFooter />;
}