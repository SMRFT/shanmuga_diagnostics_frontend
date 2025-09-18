import styled, { createGlobalStyle, keyframes } from "styled-components"

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`

export const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`

export const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`

// Global Styles
export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    /* Primary Colors - Modern Purple/Blue Gradient */
    --primary-50: #f0f4ff;
    --primary-100: #e0e7ff;
    --primary-200: #c7d2fe;
    --primary-300: #a5b4fc;
    --primary-400: #818cf8;
    --primary-500: #6366f1;
    --primary-600: #4f46e5;
    --primary-700: #4338ca;
    --primary-800: #3730a3;
    --primary-900: #312e81;

    /* Secondary Colors - Teal/Cyan */
    --secondary-50: #f0fdfa;
    --secondary-100: #ccfbf1;
    --secondary-200: #99f6e4;
    --secondary-300: #5eead4;
    --secondary-400: #2dd4bf;
    --secondary-500: #14b8a6;
    --secondary-600: #0d9488;
    --secondary-700: #0f766e;
    --secondary-800: #115e59;
    --secondary-900: #134e4a;

    /* Accent Colors */
    --accent-orange: #f97316;
    --accent-pink: #ec4899;
    --accent-yellow: #eab308;
    --accent-green: #22c55e;

    /* Neutral Colors */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;

    /* Status Colors */
    --success-50: #f0fdf4;
    --success-500: #22c55e;
    --success-600: #16a34a;
    --warning-50: #fffbeb;
    --warning-500: #f59e0b;
    --warning-600: #d97706;
    --error-50: #fef2f2;
    --error-500: #ef4444;
    --error-600: #dc2626;

    /* Semantic Colors */
    --text-primary: var(--gray-900);
    --text-secondary: var(--gray-600);
    --text-tertiary: var(--gray-500);
    --text-inverse: #ffffff;
    --text-accent: var(--primary-600);

    /* Background Colors */
    --bg-primary: #ffffff;
    --bg-secondary: var(--gray-50);
    --bg-tertiary: var(--gray-100);
    --bg-inverse: var(--gray-900);
    --bg-overlay: rgba(0, 0, 0, 0.5);

    /* Border Colors */
    --border-light: var(--gray-200);
    --border-medium: var(--gray-300);
    --border-dark: var(--gray-400);
    --border-focus: var(--primary-500);
    --border-error: var(--error-500);
    --border-success: var(--success-500);

    /* Shadows */
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);

    /* Glass Effect */
    --glass-bg: rgba(255, 255, 255, 0.25);
    --glass-border: rgba(255, 255, 255, 0.18);
    --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);

    /* Spacing */
    --space-1: 0.25rem;  /* 4px */
    --space-2: 0.5rem;   /* 8px */
    --space-3: 0.75rem;  /* 12px */
    --space-4: 1rem;     /* 16px */
    --space-5: 1.25rem;  /* 20px */
    --space-6: 1.5rem;   /* 24px */
    --space-8: 2rem;     /* 32px */
    --space-10: 2.5rem;  /* 40px */
    --space-12: 3rem;    /* 48px */
    --space-16: 4rem;    /* 64px */
    --space-20: 5rem;    /* 80px */

    /* Border Radius */
    --radius-sm: 0.25rem;   /* 4px */
    --radius-md: 0.375rem;  /* 6px */
    --radius-lg: 0.5rem;    /* 8px */
    --radius-xl: 0.75rem;   /* 12px */
    --radius-2xl: 1rem;     /* 16px */
    --radius-3xl: 1.5rem;   /* 24px */
    --radius-full: 9999px;

    /* Typography */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;

    /* Font Sizes */
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.125rem;   /* 18px */
    --text-xl: 1.25rem;    /* 20px */
    --text-2xl: 1.5rem;    /* 24px */
    --text-3xl: 1.875rem;  /* 30px */
    --text-4xl: 2.25rem;   /* 36px */
    --text-5xl: 3rem;      /* 48px */

    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  body {
    font-family: var(--font-family);
    background-attachment: fixed;
    min-height: 100vh;
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Scrollbar Styles */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--primary-400);
    border-radius: var(--radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--primary-600);
  }

  /* Selection Styles */
  ::selection {
    background: var(--primary-100);
    color: var(--primary-800);
  }

  ::-moz-selection {
    background: var(--primary-100);
    color: var(--primary-800);
  }

  /* Focus Styles */
  :focus-visible {
    outline: 2px solid var(--primary-500);
    outline-offset: 2px;
  }

  /* Disable focus for mouse users */
  .js-focus-visible :focus:not(.focus-visible) {
    outline: none;
  }

  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
  }

  /* Remove default button styles */
  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  /* Remove default input styles */
  input, select, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  /* Remove default link styles */
  a {
    color: inherit;
    text-decoration: none;
  }

  /* Remove list styles */
  ul, ol {
    list-style: none;
  }

  /* Image styles */
  img {
    max-width: 100%;
    height: auto;
  }
`

// Common Button Component
export const Button = styled.button`
  /* Base styles */
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: ${(props) => {
    switch (props.size) {
      case "sm":
        return "var(--space-2) var(--space-4)"
      case "lg":
        return "var(--space-4) var(--space-6)"
      case "xl":
        return "var(--space-5) var(--space-8)"
      default:
        return "var(--space-3) var(--space-5)"
    }
  }};
  border-radius: var(--radius-lg);
  font-size: ${(props) => {
    switch (props.size) {
      case "sm":
        return "var(--text-sm)"
      case "lg":
        return "var(--text-lg)"
      case "xl":
        return "var(--text-xl)"
      default:
        return "var(--text-base)"
    }
  }};
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  transition: all var(--transition-normal);
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-height: ${(props) => {
    switch (props.size) {
      case "sm":
        return "32px"
      case "lg":
        return "48px"
      case "xl":
        return "56px"
      default:
        return "40px"
    }
  }};
  overflow: hidden;

  /* Variant styles */
  ${(props) => {
    switch (props.variant) {
      case "secondary":
        return `
          background: var(--bg-primary);
          color: var(--text-primary);
          border: 2px solid var(--border-medium);
          box-shadow: var(--shadow-sm);
          
          &:hover:not(:disabled) {
            border-color: var(--primary-300);
            box-shadow: var(--shadow-md);
            transform: translateY(-2px);
          }
        `
      case "outline":
        return `
          background: transparent;
          color: var(--primary-600);
          border: 2px solid var(--primary-600);
          
          &:hover:not(:disabled) {
            background: var(--primary-600);
            color: var(--text-inverse);
            transform: translateY(-2px);
          }
        `
      case "ghost":
        return `
          background: transparent;
          color: var(--primary-600);
          
          &:hover:not(:disabled) {
            background: var(--primary-50);
            transform: translateY(-2px);
          }
        `
      case "danger":
        return `
          background: linear-gradient(135deg, var(--error-500), var(--error-600));
          color: var(--text-inverse);
          box-shadow: var(--shadow-md);
          
          &:hover:not(:disabled) {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
        `
      case "success":
        return `
          background: linear-gradient(135deg, var(--success-500), var(--success-600));
          color: var(--text-inverse);
          box-shadow: var(--shadow-md);
          
          &:hover:not(:disabled) {
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
        `
      default: // primary
        return `
          background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
          color: var(--text-inverse);
          box-shadow: var(--shadow-md);
          
          &:hover:not(:disabled) {
            background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
            box-shadow: var(--shadow-lg);
            transform: translateY(-2px);
          }
        `
    }
  }}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    transform: none !important;
    box-shadow: var(--shadow-sm);
  }

  /* Active state */
  &:active:not(:disabled) {
    transform: translateY(0) !important;
  }

  /* Loading state */
  ${(props) =>
    props.loading &&
    `
    pointer-events: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: inherit;
      opacity: 0.8;
    }
  `}

  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:active::after {
    width: 300px;
    height: 300px;
  }
`

// Common Title Component
export const Title = styled.h2`
  font-size: ${(props) => {
    switch (props.size) {
      case "sm":
        return "var(--text-xl)"
      case "lg":
        return "var(--text-4xl)"
      case "xl":
        return "var(--text-5xl)"
      default:
        return "var(--text-3xl)"
    }
  }};
  font-weight: var(--font-weight-bold);
  text-align: ${(props) => props.align || "center"};
  margin-bottom: ${(props) => props.marginBottom || "var(--space-8)"};
  position: relative;
  
  /* Gradient text */
  background: ${(props) => props.gradient || "linear-gradient(135deg, var(--primary-600), var(--secondary-500))"};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  /* Animated underline */
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: ${(props) => props.underlineWidth || "60px"};
    height: 4px;
    background: ${(props) => props.gradient || "linear-gradient(135deg, var(--primary-600), var(--secondary-500))"};
    border-radius: var(--radius-full);
    animation: ${slideIn} 0.6s ease-out;
  }

  /* No underline variant */
  ${(props) =>
    props.noUnderline &&
    `
    &::after {
      display: none;
    }
  `}
`

// Common Input Component
export const Input = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--bg-primary);
  transition: all var(--transition-normal);
  
  &::placeholder {
    color: var(--text-tertiary);
  }
  
  &:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
    background: var(--bg-primary);
  }
  
  &:disabled {
    background: var(--bg-secondary);
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  /* Error state */
  ${(props) =>
    props.error &&
    `
    border-color: var(--border-error);
    
    &:focus {
      border-color: var(--border-error);
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
    }
  `}
  
  /* Success state */
  ${(props) =>
    props.success &&
    `
    border-color: var(--border-success);
    
    &:focus {
      border-color: var(--border-success);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
    }
  `}
`

// Common Select Component
export const Select = styled.select`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition-normal);
  appearance: none;
  
  /* Custom arrow */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right var(--space-3) center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: var(--space-10);
  
  &:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
  }
  
  &:disabled {
    background-color: var(--bg-secondary);
    cursor: not-allowed;
    opacity: 0.7;
  }
`

// Common Card Component
export const Card = styled.div`
  background: ${(props) => (props.glass ? "var(--glass-bg)" : "var(--bg-primary)")};
  border: ${(props) => (props.glass ? "1px solid var(--glass-border)" : "1px solid var(--border-light)")};
  border-radius: var(--radius-2xl);
  padding: ${(props) => props.padding || "var(--space-8)"};
  box-shadow: ${(props) => (props.glass ? "var(--glass-shadow)" : "var(--shadow-lg)")};
  backdrop-filter: ${(props) => (props.glass ? "blur(10px)" : "none")};
  transition: all var(--transition-normal);
  animation: ${fadeIn} 0.6s ease-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-2xl);
  }

  @media (max-width: 768px) {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
  }
`

// Loading Spinner Component
export const LoadingSpinner = styled.div`
  width: ${(props) => props.size || "20px"};
  height: ${(props) => props.size || "20px"};
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

// Badge Component
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  
  ${(props) => {
    switch (props.variant) {
      case "success":
        return `
          background: var(--success-50);
          color: var(--success-600);
          border: 1px solid var(--success-200);
        `
      case "warning":
        return `
          background: var(--warning-50);
          color: var(--warning-600);
          border: 1px solid var(--warning-200);
        `
      case "error":
        return `
          background: var(--error-50);
          color: var(--error-600);
          border: 1px solid var(--error-200);
        `
      default:
        return `
          background: var(--primary-50);
          color: var(--primary-600);
          border: 1px solid var(--primary-200);
        `
    }
  }}
`

// Container Component
export const Container = styled.div`
  max-width: ${(props) => props.maxWidth || "1400px"};
  margin: 0 auto;
  padding: ${(props) => props.padding || "var(--space-5)"};
  
  @media (max-width: 768px) {
    padding: var(--space-4);
  }
`

// Grid Component
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "repeat(auto-fit, minmax(300px, 1fr))"};
  gap: ${(props) => props.gap || "var(--space-6)"};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
`

// Flex Component
export const Flex = styled.div`
  display: flex;
  align-items: ${(props) => props.align || "stretch"};
  justify-content: ${(props) => props.justify || "flex-start"};
  flex-direction: ${(props) => props.direction || "row"};
  flex-wrap: ${(props) => props.wrap || "nowrap"};
  gap: ${(props) => props.gap || "0"};
`

export default GlobalStyle
