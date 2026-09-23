import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaThLarge,
  FaThList,
  FaFilePdf,
  FaEye,
  FaVial,
  FaClock,
  FaFlask,
  FaMicroscope,
  FaNotesMedical,
  FaBuilding,
  FaBookMedical,
  FaChevronLeft,
  FaChevronRight,
  FaSortAmountDown,
  FaFilter,
  FaTimesCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getTestDirectoryList,
  getTestDirectoryStats,
  getSampleReportUrl,
} from "./api";
import TestDirectoryDetailModal from "./TestDirectoryDetailModal";
import "./TestDirectory.css";

const ALPHABETS = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

export default function TestDirectoryReport() {
  const navigate = useNavigate();

  const [tests, setTests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [sortBy, setSortBy] = useState("name-asc"); // 'name-asc' | 'name-desc' | 'dept'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

  // Pagination state (Optimized for 300-400+ tests)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Modal inspection state
  const [selectedTestModal, setSelectedTestModal] = useState(null);

  const fetchTestsAndStats = async () => {
    setLoading(true);
    try {
      const [testsRes, statsRes] = await Promise.all([
        getTestDirectoryList({
          search: searchTerm,
          department: selectedDept !== "All" ? selectedDept : undefined,
        }),
        getTestDirectoryStats().catch(() => null),
      ]);

      if (testsRes && testsRes.success) {
        setTests(testsRes.data || []);
      }
      if (statsRes && statsRes.success) {
        setStats(statsRes);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load diagnostic test directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestsAndStats();
  }, [selectedDept]);

  // Reset pagination on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDept, selectedLetter, pageSize, sortBy]);

  // Unique departments for filter tabs
  const departmentsList = useMemo(() => {
    const set = new Set(tests.map((t) => t.department).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [tests]);

  // Letter count mapping for A-Z bar (e.g. A: 14, B: 28)
  const letterCounts = useMemo(() => {
    const map = {};
    ALPHABETS.forEach((l) => (map[l] = 0));
    map["ALL"] = tests.length;

    tests.forEach((t) => {
      const firstChar = (t.test_name || "").trim().toUpperCase().charAt(0);
      if (map[firstChar] !== undefined) {
        map[firstChar] += 1;
      }
    });
    return map;
  }, [tests]);

  // Filter & Sort Pipeline
  const filteredAndSortedTests = useMemo(() => {
    let result = [...tests];

    // 1. Search Query
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((t) => {
        return (
          t.test_name?.toLowerCase().includes(term) ||
          t.test_code?.toLowerCase().includes(term) ||
          t.specimen?.toLowerCase().includes(term) ||
          t.department?.toLowerCase().includes(term) ||
          t.method?.toLowerCase().includes(term) ||
          t.clinical_purpose?.toLowerCase().includes(term) ||
          t.unit?.toLowerCase().includes(term)
        );
      });
    }

    // 2. Alphabet Filter
    if (selectedLetter !== "ALL") {
      result = result.filter((t) => {
        return (t.test_name || "").trim().toUpperCase().startsWith(selectedLetter);
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortBy === "name-asc") {
        return (a.test_name || "").localeCompare(b.test_name || "");
      } else if (sortBy === "name-desc") {
        return (b.test_name || "").localeCompare(a.test_name || "");
      } else if (sortBy === "dept") {
        return (a.department || "").localeCompare(b.department || "") || (a.test_name || "").localeCompare(b.test_name || "");
      }
      return 0;
    });

    return result;
  }, [tests, searchTerm, selectedLetter, sortBy]);

  // Paginated tests slice
  const paginatedTests = useMemo(() => {
    if (pageSize === "ALL") return filteredAndSortedTests;
    const startIdx = (currentPage - 1) * pageSize;
    return filteredAndSortedTests.slice(startIdx, startIdx + pageSize);
  }, [filteredAndSortedTests, currentPage, pageSize]);

  const totalPages = pageSize === "ALL" ? 1 : Math.ceil(filteredAndSortedTests.length / pageSize);

  return (
    <div className="td-wrapper">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Detail & Sample Report Viewer Modal */}
      {selectedTestModal && (
        <TestDirectoryDetailModal
          test={selectedTestModal}
          onClose={() => setSelectedTestModal(null)}
        />
      )}

      <div className="td-container">
        {/* Navigation Bar */}
        <div className="td-nav-bar">
          <div className="td-brand">
            <div className="td-brand-icon">
              <FaBookMedical />
            </div>
            <div>
              <h1 className="td-brand-title">Shanmuga Diagnostics • Diagnostic Test Directory</h1>
              <p className="td-brand-subtitle">Explore 400+ Laboratory Investigations, Normal Ranges & Sample Reports</p>
            </div>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="td-stats-grid">
          <div className="td-stat-card">
            <div className="td-stat-icon-wrapper td-stat-icon-blue">
              <FaFlask />
            </div>
            <div>
              <p className="td-stat-number">{stats?.total_tests ?? tests.length}</p>
              <p className="td-stat-label">Total Tests Available</p>
            </div>
          </div>

          <div className="td-stat-card">
            <div className="td-stat-icon-wrapper td-stat-icon-teal">
              <FaBuilding />
            </div>
            <div>
              <p className="td-stat-number">
                {stats?.departments?.length || departmentsList.length - 1 || 1}
              </p>
              <p className="td-stat-label">Specialties / Depts</p>
            </div>
          </div>

          <div className="td-stat-card">
            <div className="td-stat-icon-wrapper td-stat-icon-purple">
              <FaFilePdf />
            </div>
            <div>
              <p className="td-stat-number">
                {stats?.tests_with_reports ??
                  tests.filter((t) => t.sample_report_file_id).length}
              </p>
              <p className="td-stat-label">Sample Report Templates</p>
            </div>
          </div>

          <div className="td-stat-card">
            <div className="td-stat-icon-wrapper td-stat-icon-green">
              <FaClock />
            </div>
            <div>
              <p className="td-stat-number">2-4 Hrs</p>
              <p className="td-stat-label">Standard Routine TAT</p>
            </div>
          </div>
        </div>

        {/* 1. Main Search & Filter Toolbar */}
        <div className="td-toolbar">
          <div className="td-search-box">
            <FaSearch className="td-search-icon" />
            <input
              type="text"
              className="td-search-input"
              placeholder="Search 400+ tests by test name, specimen, unit, purpose (e.g. CBC, Thyroid, Lipid, Urine)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="td-filter-controls">
            {/* Department Dropdown Filter */}
            <select
              className="td-filter-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="All">All Specialties ({tests.length})</option>
              {departmentsList
                .filter((d) => d !== "All")
                .map((dept, idx) => {
                  const count = tests.filter((t) => t.department === dept).length;
                  return (
                    <option key={idx} value={dept}>
                      {dept} ({count})
                    </option>
                  );
                })}
            </select>

            {/* Sorting Select */}
            <select
              className="td-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Sort: A to Z</option>
              <option value="name-desc">Sort: Z to A</option>
              <option value="dept">Sort by Specialty</option>
            </select>

            {/* View Mode Switch */}
            <div className="td-view-switch">
              <button
                type="button"
                className={`td-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Card Grid View"
              >
                <FaThLarge /> Grid
              </button>
              <button
                type="button"
                className={`td-view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Data Table View"
              >
                <FaThList /> Table
              </button>
            </div>
          </div>
        </div>

        {/* 2. Alphabetical A-Z Quick Jump Bar (Solves 300-400 test scrolling!) */}
        <div className="td-alphabet-bar-container">
          <div className="td-alphabet-bar">
            {ALPHABETS.map((letter, idx) => {
              const count = letterCounts[letter] || 0;
              const isSelected = selectedLetter === letter;
              const hasItems = count > 0 || letter === "ALL";

              return (
                <button
                  key={idx}
                  type="button"
                  className={`td-alpha-btn ${isSelected ? "active" : ""} ${!hasItems ? "disabled" : ""}`}
                  onClick={() => hasItems && setSelectedLetter(letter)}
                  disabled={!hasItems}
                  title={letter === "ALL" ? "Show All Tests" : `Tests starting with ${letter} (${count})`}
                >
                  <span className="td-alpha-letter">{letter}</span>
                  {count > 0 && letter !== "ALL" && (
                    <span className="td-alpha-count">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Tags Bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "14px 0 16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "13.5px", fontWeight: "700", color: "#334155" }}>
            Showing <span style={{ color: "var(--td-primary)" }}>{filteredAndSortedTests.length}</span> matching tests
            {selectedLetter !== "ALL" && (
              <span className="td-filter-tag">
                Starting with "{selectedLetter}"
                <FaTimesCircle style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => setSelectedLetter("ALL")} />
              </span>
            )}
            {selectedDept !== "All" && (
              <span className="td-filter-tag">
                {selectedDept}
                <FaTimesCircle style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => setSelectedDept("All")} />
              </span>
            )}
            {searchTerm && (
              <span className="td-filter-tag">
                "{searchTerm}"
                <FaTimesCircle style={{ marginLeft: "5px", cursor: "pointer" }} onClick={() => setSearchTerm("")} />
              </span>
            )}
          </div>

          {/* Items Per Page Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--td-text-muted)" }}>
            <span>Per page:</span>
            {[12, 24, 48, "ALL"].map((size, idx) => (
              <button
                key={idx}
                type="button"
                className={`td-chip-btn ${pageSize === size ? "active" : ""}`}
                style={{ padding: "3px 8px", fontSize: "11px" }}
                onClick={() => setPageSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Main Content Area */}
        {loading ? (
          <div className="td-spinner-container">
            <div className="td-spinner" />
            <p>Loading diagnostic test directory...</p>
          </div>
        ) : filteredAndSortedTests.length === 0 ? (
          <div className="td-empty-state">
            <FaVial className="td-empty-icon" />
            <h3 className="td-empty-title">No Diagnostic Tests Match Your Filter</h3>
            <p className="td-empty-sub">
              No tests found starting with '{selectedLetter}' or matching '{searchTerm}'.
            </p>
            <button
              className="td-btn td-btn-primary"
              onClick={() => {
                setSearchTerm("");
                setSelectedDept("All");
                setSelectedLetter("ALL");
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          /* =================================================================
             COMPACT, SLEEK CARD GRID (Optimized for 300-400+ tests)
             ================================================================= */
          <div className="td-grid-container">
            {paginatedTests.map((test) => {
              const hasReport = !!test.sample_report_file_id;

              return (
                <div
                  key={test.id}
                  className="td-card"
                  onClick={() => setSelectedTestModal(test)}
                >
                  <div>
                    {/* Top Row: Specialty Tag & Turnaround Time */}
                    <div className="td-card-top">
                      <div className="td-card-badge-row">
                        <span className="td-dept-badge">{test.department || "General"}</span>
                        {test.test_code && (
                          <span className="td-code-badge">{test.test_code}</span>
                        )}
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: "700", color: "#059669" }}>
                        <FaClock style={{ marginRight: "3px" }} /> {test.turnaround_time || "2-4 Hrs"}
                      </span>
                    </div>

                    {/* Test Title */}
                    <h3 className="td-card-title">{test.test_name}</h3>

                    {/* Clinical Purpose Short Excerpt */}
                    <p className="td-card-purpose">
                      {test.clinical_purpose || "Clinical laboratory investigation with automated accuracy."}
                    </p>

                    {/* Compact Parameters Strip */}
                    <div className="td-compact-strip">
                      <div className="td-strip-item">
                        <span className="td-strip-label">Specimen</span>
                        <span className="td-strip-val highlight">{test.specimen || "Serum"}</span>
                      </div>

                      <div className="td-strip-item">
                        <span className="td-strip-label">Unit</span>
                        <span className="td-strip-val">{test.unit || "N/A"}</span>
                      </div>

                      <div className="td-strip-item" style={{ gridColumn: "span 2" }}>
                        <span className="td-strip-label">Reference Interval</span>
                        <span className="td-strip-val" title={test.reference_range}>
                          {test.reference_range ? test.reference_range.replace(/\n/g, " | ") : "Standard Normal Values"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer: 1-Click Modal Triggers */}
                  <div className="td-card-footer" onClick={(e) => e.stopPropagation()}>
                    {hasReport ? (
                      <button
                        className="td-report-badge-btn"
                        onClick={() => setSelectedTestModal(test)}
                        title="Click to view official sample diagnostic report"
                      >
                        <FaFilePdf /> Sample Report
                      </button>
                    ) : (
                      <span className="td-no-report-badge">Sample Report N/A</span>
                    )}

                    <button
                      className="td-btn-view-monograph"
                      onClick={() => setSelectedTestModal(test)}
                    >
                      <FaEye /> View Monograph
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =================================================================
             CLEAN DATA TABLE VIEW
             ================================================================= */
          <div className="td-table-wrapper">
            <table className="td-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Test Name</th>
                  <th>Specialty</th>
                  <th>Specimen</th>
                  <th>Reference Range</th>
                  <th>Unit</th>
                  <th>TAT</th>
                  <th>Sample Report</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTests.map((test) => {
                  const hasReport = !!test.sample_report_file_id;

                  return (
                    <tr
                      key={test.id}
                      onClick={() => setSelectedTestModal(test)}
                      style={{ cursor: "pointer" }}
                    >
                      <td>
                        <span className="td-code-badge">{test.test_code || "N/A"}</span>
                      </td>
                      <td>
                        <strong style={{ color: "#0f172a" }}>{test.test_name}</strong>
                      </td>
                      <td>
                        <span className="td-dept-badge">{test.department || "General"}</span>
                      </td>
                      <td>
                        <span style={{ fontWeight: "700", color: "#0284c7" }}>
                          {test.specimen || "Serum"}
                        </span>
                      </td>
                      <td style={{ maxWidth: "200px" }}>
                        <span style={{ fontSize: "12px", color: "#334155" }}>
                          {test.reference_range ? test.reference_range.replace(/\n/g, ", ") : "Standard Range"}
                        </span>
                      </td>
                      <td>
                        <strong>{test.unit || "N/A"}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", fontWeight: "700", color: "#059669" }}>
                          {test.turnaround_time || "2-4 Hrs"}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        {hasReport ? (
                          <button
                            className="td-report-badge-btn"
                            onClick={() => setSelectedTestModal(test)}
                          >
                            <FaFilePdf /> Sample Report
                          </button>
                        ) : (
                          <span className="td-no-report-badge">None</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className="td-btn-view-monograph"
                          onClick={() => setSelectedTestModal(test)}
                        >
                          <FaEye /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Smart Pagination Bar */}
        {totalPages > 1 && (
          <div className="td-pagination-bar">
            <button
              className="td-page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft /> Prev
            </button>

            <div className="td-page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                .map((p, idx, arr) => {
                  const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="td-page-ellipsis">...</span>}
                      <button
                        type="button"
                        className={`td-page-num-btn ${currentPage === p ? "active" : ""}`}
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              className="td-page-nav-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <FaChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
