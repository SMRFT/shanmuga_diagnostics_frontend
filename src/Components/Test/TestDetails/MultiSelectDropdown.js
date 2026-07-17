import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

// Extracted verbatim from the inline `MultiSelectDropdown` component that
// used to live inside TestDetails.
const MultiSelectDropdown = ({ options, value, onChange, disabled }) => {
  const [open, setOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = React.useRef(null);
  const optionRefs = React.useRef([]);

  const selected = value
    ? value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
    : [];

  const toggleOption = (option) => {
    const updated = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    onChange(updated.join(", "));
  };

  const removeOption = (option) => {
    const updated = selected.filter((s) => s !== option);
    onChange(updated.join(", "));
  };

  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll focused option into view
  React.useEffect(() => {
    if (focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex].scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleTriggerKeyDown = (e) => {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((prev) => !prev);
      setFocusedIndex(-1);
    }
  };

  const handleDropdownKeyDown = (e) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0) {
        toggleOption(options[focusedIndex]);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setFocusedIndex(-1);
    } else if (e.key === "Tab") {
      setOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div
      ref={ref}
      style={{ position: "relative" }}
      onKeyDown={handleDropdownKeyDown}
    >
      {/* Trigger */}
      <div
        tabIndex={disabled ? -1 : 0}
        data-focusable="true"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        style={{
          minHeight: "42px",
          padding: "0.4rem 2rem 0.4rem 0.75rem",
          border: "1px solid var(--gray-light)",
          borderRadius: "var(--border-radius)",
          fontSize: "1rem",
          backgroundColor: disabled ? "var(--gray-light)" : "white",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.35rem",
          alignItems: "center",
          position: "relative",
          outline: "none",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(67,97,238,0.1)";
          e.currentTarget.style.borderColor = "var(--primary)";
        }}
        onBlur={(e) => {
          // only blur-style if focus left the whole dropdown
          if (!ref.current?.contains(e.relatedTarget)) {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "var(--gray-light)";
          }
        }}
      >
        {selected.length === 0 && (
          <span style={{ color: "var(--gray)", fontSize: "0.9rem" }}>
            Select value(s)
          </span>
        )}
        {selected.map((s) => (
          <span
            key={s}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.25rem",
              backgroundColor: "var(--primary)",
              color: "white",
              borderRadius: "4px",
              padding: "0.1rem 0.5rem",
              fontSize: "0.8rem",
            }}
          >
            {s}
            {!disabled && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(s);
                }}
                style={{
                  cursor: "pointer",
                  fontWeight: "bold",
                  marginLeft: "2px",
                }}
              >
                ×
              </span>
            )}
          </span>
        ))}
        <ChevronDown
          size={16}
          style={{
            position: "absolute",
            right: "0.5rem",
            top: "50%",
            transform: open
              ? "translateY(-50%) rotate(180deg)"
              : "translateY(-50%)",
            color: "var(--gray)",
            pointerEvents: "none",
            transition: "transform 0.2s",
          }}
        />
      </div>

      {/* Dropdown list */}
      {open && !disabled && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid var(--gray-light)",
            borderRadius: "var(--border-radius)",
            zIndex: 999,
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((option, idx) => {
            const isSelected = selected.includes(option);
            const isFocused = focusedIndex === idx;
            return (
              <div
                key={option}
                ref={(el) => (optionRefs.current[idx] = el)}
                onClick={() => toggleOption(option)}
                style={{
                  padding: "0.6rem 0.75rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: isFocused
                    ? "#dde3fb"
                    : isSelected
                      ? "#eef1fd"
                      : "white",
                  color: isSelected ? "var(--primary)" : "var(--dark)",
                  fontWeight: isSelected ? "600" : "400",
                  fontSize: "0.95rem",
                  borderBottom: "1px solid var(--gray-light)",
                }}
              >
                <span
                  style={{
                    width: "16px",
                    height: "16px",
                    border: `2px solid ${isSelected ? "var(--primary)" : "var(--gray)"}`,
                    borderRadius: "3px",
                    backgroundColor: isSelected ? "var(--primary)" : "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {isSelected && (
                    <span
                      style={{
                        color: "white",
                        fontSize: "11px",
                        lineHeight: 1,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </span>
                {option}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
