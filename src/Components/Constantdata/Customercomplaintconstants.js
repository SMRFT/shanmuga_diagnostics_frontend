// constants/customerComplaintConstants.js
//
// Central place for the "Issue Type" checkbox options used on the
// Customer Complaints form. Add/remove/rename options here — the
// component reads from this list, nothing is hardcoded in the JSX.

export const OTHER_ISSUE_VALUE = "Other";

export const ISSUE_TYPE_OPTIONS = [
  { value: "Report Delay", label: "Report Delay" },
  { value: "Pickup Delay", label: "Pickup Delay" },
  { value: "Phone Not Answering", label: "Phone Not Answering" },
  { value: "Sample Integrity", label: "Sample Integrity" },
  { value: OTHER_ISSUE_VALUE, label: "Other" },
];

export const COMPLAINT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
};