import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

export const slideIn = keyframes`
 from { transform: translateX(-20px); opacity: 0; }
 to { transform: translateX(0); opacity: 1; }
`;

export const gradientAnimation = keyframes`
 0% { background-position: 0% 50%; }
 50% { background-position: 100% 50%; }
 100% { background-position: 0% 50%; }
`;

export const glassEffect = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

// Hoisted to module scope so this identical object isn't recreated on every render
export const styles = {
  dropdownHeaderRow: { display: "flex", alignItems: "center" },
};

export const SidebarContainer = styled.div`
  background: linear-gradient(135deg, #6e8efb, #a777e3, #e56f8f);
  background-size: 300% 300%;
  animation: ${gradientAnimation} 15s ease infinite;
  color: white;
  height: 100vh;
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 1000;
  transform: ${({ isOpen }) =>
    isOpen ? "translateX(0)" : "translateX(-100%)"};
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.15);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

export const SignOutWrapper = styled.div`
  margin-top: auto;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LogoContainer = styled.div`
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  h1 {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const UserInfoContainer = styled.div`
  ${glassEffect}
  padding: 20px;
  margin: 10px 15px 20px 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

export const UserDetails = styled.div`
  text-align: center;
  width: 100%;
`;

export const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const UserRole = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 4px;
`;

export const EmployeeId = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 400;
`;

export const SidebarToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1100;
  background-color: rgba(110, 142, 251, 0.9);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(167, 119, 227, 0.9);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SidebarContent = styled.div`
  padding: 0 15px 20px;
`;

export const SectionDivider = styled.div`
  margin: 15px 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.5),
    transparent
  );
`;

export const SidebarNavLink = styled(NavLink)`
  color: white;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    transition: width 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateX(5px);

    &:before {
      width: 100%;
    }
  }

  &.active {
    ${glassEffect}
    font-weight: 600;
    transform: translateX(5px);
  }
`;

export const DropdownHeader = styled.div`
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    ${glassEffect}
    transform: translateX(5px);
  }

  ${(props) =>
    props.isOpen &&
    css`
      ${glassEffect}
      transform: translateX(5px);
    `}
`;

export const DropdownContent = styled.div`
  overflow: hidden;
  max-height: ${(props) => (props.isOpen ? "500px" : "0")};
  transition: max-height 0.4s ease-in-out;
  margin-left: 10px;

  & > * {
    animation: ${slideIn} 0.3s ease forwards;
  }
`;

export const SubLink = styled(NavLink)`
  color: white;
  padding: 12px 18px 12px 30px;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  margin-bottom: 4px;
  transition: all 0.3s ease;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: 15px;
    top: 50%;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translateY(-50%);
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }

  &.active {
    background: rgba(255, 255, 255, 0.15);
    font-weight: 600;
  }
`;

export const IconWrapper = styled.span`
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const ChevronIcon = styled(FaChevronDown)`
  transition: transform 0.3s ease;
  transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0)")};
`;
