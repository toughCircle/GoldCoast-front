import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { handleLogout } from "../api/fetchWithAuth";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #ddd;
`;

const HomeButton = styled.button`
  font-size: 1rem;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const AuthButton = styled.button`
  font-size: 1rem;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const Header = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      handleLogout();
    } else {
      navigate("/login");
    }
  };

  return (
    <HeaderContainer>
      <HomeButton onClick={handleHomeClick}>홈</HomeButton>
      <AuthButton onClick={handleAuthClick}>
        {isAuthenticated ? "로그아웃" : "로그인"}
      </AuthButton>
    </HeaderContainer>
  );
};

export default Header;
