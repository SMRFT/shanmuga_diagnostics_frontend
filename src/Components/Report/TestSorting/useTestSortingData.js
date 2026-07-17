import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiRequest from "../../Auth/apiRequest";

// Owns the test list fetch (and dispatch actions on top of it) for
// TestSorting. Extracted verbatim from the component body — logic is
// unchanged, only relocated.
export default function useTestSortingData({ patient, Labbaseurl }) {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [dispatchedTests, setDispatchedTests] = useState(new Set());

  useEffect(() => {
    const fetchTests = async () => {
      setIsLoading(true);
      setLoadingMessage("Loading tests...");
      try {
        const response = await apiRequest(
          `${Labbaseurl}patient_test_sorting/?barcode=${patient.barcode}&date=${patient.date}`,
          "GET",
          null,
          {},
          {},
        );

        if (response.success) {
          if (response.data[patient.barcode]) {
            const testDetails =
              response.data[patient.barcode].testdetails || [];
            const sortedTests = testDetails.sort((a, b) => {
              const numA = parseInt(a.test_name.match(/\d+/)?.[0]) || 0;
              const numB = parseInt(b.test_name.match(/\d+/)?.[0]) || 0;
              return numA - numB;
            });

            const testsWithDispatch = sortedTests.map((test) => ({
              test_id: test.test_id,
              test_name: test.test_name,
              NABL: test.NABL || false,
              dispatched: test.dispatch || false,
              created_date: test.created_date, // Changed from test.dispatched to test.dispatch
              department: test.department || "",
            }));

            setTests(testsWithDispatch);

            // Initialize dispatched tests set
            const dispatchedSet = new Set();
            testsWithDispatch.forEach((test) => {
              if (test.dispatched) {
                dispatchedSet.add(test.test_id);
              }
            });
            setDispatchedTests(dispatchedSet);
          } else {
            setTests([]);
          }
        } else {
          console.error(
            "Error fetching tests:",
            response.error,
            response.status,
          );
          toast.error("Failed to load tests");
        }
      } catch (error) {
        console.error("Unexpected error fetching tests:", error);
        toast.error("An error occurred while loading tests");
      } finally {
        setIsLoading(false);
        setLoadingMessage("");
      }
    };

    fetchTests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.patient_id, patient.barcode, patient.date]);

  const handleDispatchTest = async (test, e) => {
    e.stopPropagation(); // Prevent test selection when clicking dispatch

    try {
      const response = await apiRequest(
        `${Labbaseurl}update_dispatch_status/${patient.barcode}/`,
        "PATCH",
        {
          test_id: test.test_id,
          created_date: test.created_date, // Send the created_date to target specific document
        },
        {
          "Content-Type": "application/json",
        },
      );

      if (response.success) {
        toast.success(`Test "${test.test_name}" dispatched successfully!`);

        // Update the dispatched tests set
        setDispatchedTests((prev) => {
          const newSet = new Set(prev);
          newSet.add(test.test_id);
          return newSet;
        });

        // Update the tests array
        setTests((prev) =>
          prev.map((t) =>
            t.test_id === test.test_id ? { ...t, dispatched: true } : t,
          ),
        );
      } else {
        toast.error(`Failed to dispatch test: ${response.error}`);
      }
    } catch (error) {
      console.error("Error dispatching test:", error);
      toast.error("Failed to dispatch test");
    }
  };

  const handleDispatchAll = async () => {
    const undispatched = tests.filter((t) => !dispatchedTests.has(t.test_id));

    if (!undispatched.length) {
      toast.info("All tests are already dispatched.");
      return;
    }

    setIsLoading(true);
    setLoadingMessage(`Dispatching ${undispatched.length} test(s)...`);

    let successCount = 0;
    for (const test of undispatched) {
      try {
        const response = await apiRequest(
          `${Labbaseurl}update_dispatch_status/${patient.barcode}/`,
          "PATCH",
          { test_id: test.test_id, created_date: test.created_date },
          { "Content-Type": "application/json" },
        );
        if (response.success) {
          successCount++;
          setDispatchedTests((prev) => {
            const newSet = new Set(prev);
            newSet.add(test.test_id);
            return newSet;
          });
          setTests((prev) =>
            prev.map((t) =>
              t.test_id === test.test_id ? { ...t, dispatched: true } : t,
            ),
          );
        }
      } catch (error) {
        console.error(`Failed to dispatch test ${test.test_name}:`, error);
      }
    }

    setIsLoading(false);
    setLoadingMessage("");
    toast.success(
      `${successCount} of ${undispatched.length} test(s) dispatched successfully!`,
    );
  };

  return {
    tests,
    isLoading,
    loadingMessage,
    dispatchedTests,
    handleDispatchTest,
    handleDispatchAll,
  };
}
