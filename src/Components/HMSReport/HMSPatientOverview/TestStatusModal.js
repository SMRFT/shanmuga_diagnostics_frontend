import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  TestStatusList,
  TestStatusItem,
  TestNameText,
  StatusBadgeContainer,
  Badge,
  TATIndicator,
  TATLabel,
  TATText,
  NoData,
} from "./styles";
import { formatTimeRemaining, getBadgeColor } from "./helpers";

// Modal showing the live TAT (turn-around-time) status of every test for a
// patient. Extracted verbatim from the inline `TestStatusModal` component
// that used to live inside HMSPatientOverview.
const TestStatusModal = ({ isOpen, patient, onClose }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second for live countdown
  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen || !patient) return null;

  const testStatuses = patient.test_statuses || [];

  const calculateLiveSecondsLeft = (test) => {
    if (test.tat_status === "completed") {
      // For completed tests, return the static value
      return test.seconds_left;
    }

    if (test.tat_status === "pending" && test.tat_deadline) {
      // Calculate live countdown
      const deadline = new Date(test.tat_deadline);
      const secondsLeft = Math.floor((deadline - currentTime) / 1000);
      return secondsLeft;
    }

    return test.seconds_left;
  };

  const formatTATDisplay = (test) => {
    if (!test.tat_time) return null;

    const liveSecondsLeft = calculateLiveSecondsLeft(test);

    if (test.tat_status === "completed") {
      // Test is completed
      const timeStr = formatTimeRemaining(liveSecondsLeft);
      if (liveSecondsLeft >= 0) {
        return {
          label: "Completed",
          time: `${timeStr} early`,
          isOverdue: false,
        };
      } else {
        return {
          label: "Completed",
          time: `${timeStr} late`,
          isOverdue: true,
        };
      }
    } else if (test.tat_status === "pending") {
      // Test is still pending
      const timeStr = formatTimeRemaining(liveSecondsLeft);
      if (liveSecondsLeft > 0) {
        return {
          label: "Time Left",
          time: timeStr,
          isOverdue: false,
        };
      } else {
        return {
          label: "Overdue",
          time: timeStr,
          isOverdue: true,
        };
      }
    }

    return {
      label: "TAT",
      time: test.tat_time,
      isOverdue: false,
    };
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            Test Status - {patient.patient_name}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>

        <TestStatusList>
          {testStatuses.length > 0 ? (
            testStatuses.map((test, index) => {
              const tatDisplay = formatTATDisplay(test);
              const liveSecondsLeft = calculateLiveSecondsLeft(test);

              return (
                <TestStatusItem
                  key={index}
                  highlight={
                    test.status === "Approved" || test.status === "Dispatched"
                  }
                >
                  <div style={{ flex: 1 }}>
                    <TestNameText>{test.test_name}</TestNameText>
                    {test.sample_collected_time && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray)",
                          marginTop: "0.25rem",
                        }}
                      >
                        Collected:{" "}
                        {format(
                          new Date(test.sample_collected_time),
                          "dd MMM yy, HH:mm:ss",
                        )}
                      </div>
                    )}
                    {test.approve_time && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--gray)",
                          marginTop: "0.25rem",
                        }}
                      >
                        Approved:{" "}
                        {format(
                          new Date(test.approve_time),
                          "dd MMM yy, HH:mm:ss",
                        )}
                      </div>
                    )}
                  </div>
                  <StatusBadgeContainer
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.5rem",
                    }}
                  >
                    <Badge color={getBadgeColor(test.status)}>
                      {test.status}
                    </Badge>
                    {tatDisplay && (
                      <TATIndicator secondsLeft={liveSecondsLeft}>
                        <div style={{ textAlign: "center" }}>
                          <TATLabel>{tatDisplay.label}</TATLabel>
                          <TATText>{tatDisplay.time}</TATText>
                        </div>
                      </TATIndicator>
                    )}
                  </StatusBadgeContainer>
                </TestStatusItem>
              );
            })
          ) : (
            <NoData>No test status information available</NoData>
          )}
        </TestStatusList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default TestStatusModal;
