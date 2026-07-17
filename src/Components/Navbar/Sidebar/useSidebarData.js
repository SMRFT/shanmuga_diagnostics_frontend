import { useState, useEffect } from "react";
import { loadDropdownState, saveDropdownState, loadUserInfo } from "./helpers";

// Encapsulates all of the Sidebar's non-rendering state: the
// open/closed state of the mobile sidebar drawer, the logged-in
// user's role/name/employeeId (read from localStorage), and the
// open/closed state of each collapsible nav dropdown (persisted to
// localStorage). Behavior is identical to what previously lived
// directly inside the Sidebar component body.
export default function useSidebarData() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [dropdowns, setDropdowns] = useState(() => loadDropdownState());

  const toggleDropdown = (dropdown) => {
    setDropdowns((prev) => {
      const updated = { ...prev, [dropdown]: !prev[dropdown] };
      saveDropdownState(updated);
      return updated;
    });
  };

  useEffect(() => {
    const { role: userRole, name: userName, employeeId: userEmployeeId } =
      loadUserInfo();

    setRole(userRole);
    setName(userName);
    setEmployeeId(userEmployeeId);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return {
    isSidebarOpen,
    setIsSidebarOpen,
    toggleSidebar,
    role,
    name,
    employeeId,
    dropdowns,
    toggleDropdown,
  };
}
