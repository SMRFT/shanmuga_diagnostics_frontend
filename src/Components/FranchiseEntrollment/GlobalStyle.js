import styled, { createGlobalStyle } from 'styled-components';

// ============================================================
// Shanmuga Diagnostics – Franchise Color System (Light & Clean Theme)
// Matches Patient Registration / Lab Details aesthetic:
//   Background  → Subtle Pastel Gradient
//   Card        → Glassmorphic White with soft shadow
//   Fieldsets   → Dashed pink/purple border (#f093fb)
//   Labels      → Purple (#4c51bf / #764ba2)
//   Inputs      → Crisp white with light purple border (#e1e8ff)
// ============================================================

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    min-height: 100vh;
    color: #2d3748;
    background: #f8fafc;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html {
    scroll-behavior: smooth;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(102, 126, 234, 0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(102, 126, 234, 0.3);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(102, 126, 234, 0.5);
  }

  :focus-visible {
    outline: 2px solid #667eea;
    outline-offset: 2px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

// ── Buttons ──────────────────────────────────────────────────

export const PrimaryButton = styled.button`
  background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);

  &:hover {
    background: linear-gradient(135deg, #f093fb 0%, #764ba2 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.20);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SecondaryButton = styled.button`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f093fb 0%, #667eea 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const AccentButton = styled.button`
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(168, 85, 247, 0.25);

  &:hover {
    background: linear-gradient(135deg, #c084fc 0%, #9333ea 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(168, 85, 247, 0.35);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ── Layout ────────────────────────────────────────────────────

export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
`;

// Clean white card with soft shadow matching PatientForm
export const GradientCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 232, 255, 0.8);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  color: #2d3748;
`;

export const PageBackground = styled.div`
  min-height: 100vh;
  position: relative;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  font-family: 'Poppins', 'Inter', sans-serif;
`;

// Main page background – light clean gradient
export const LiquidBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05));
  position: relative;
  font-family: 'Poppins', 'Inter', sans-serif;
`;

// DualTone card in clean light style
export const DualToneCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(225, 232, 255, 0.8);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.08);
  transition: all 0.3s ease;
  color: #2d3748;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.12);
  }
`;

// ── Color Tokens Export ───────────────────────────────────────

export const colors = {
  primary: {
    50:  '#f0f4ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#667eea',
    600: '#5a67d8',
    700: '#4c51bf',
    800: '#434190',
    900: '#3c366b',
    // convenient aliases
    light:   '#818cf8',
    base:    '#667eea',
    bright:  '#667eea',
    dark:    '#4c51bf',
    darker:  '#764ba2',
    deep:    '#434190',
    deepNavy:'#ffffff',
  },
  secondary: {
    50:  '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f472b6',
    400: '#f093fb',
    500: '#e879f9',
    600: '#d946ef',
    700: '#c026d3',
    800: '#a21caf',
    900: '#86198f',
    light:  '#f093fb',
    base:   '#e879f9',
    dark:   '#764ba2',
    darker: '#581c87',
  },
  gradients: {
    primary:    'linear-gradient(135deg, #f093fb 0%, #667eea 100%)',
    secondary:  'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
    accent:     'linear-gradient(135deg, #f093fb 0%, #667eea 100%)',
    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05))',
    dualTone:   'linear-gradient(135deg, #f093fb 0%, #667eea 100%)',
  },
  backgrounds: {
    page:    'linear-gradient(135deg, rgba(240, 147, 251, 0.05), rgba(102, 126, 234, 0.05))',
    card:    'rgba(255, 255, 255, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.4)',
  },
  text: {
    primary:   '#2d3748',
    secondary: '#4a5568',
    light:     '#718096',
    inverse:   '#ffffff',
    accent:    '#4c51bf',
  },
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#667eea',
  },
};