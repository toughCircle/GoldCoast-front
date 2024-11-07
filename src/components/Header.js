import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { handleLogout } from "../api";

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333333;
  border-bottom: 1px solid #ddd;
`;

const HomeButton = styled.button`
  font-size: 1rem;
  color: #d4af37;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 800;
  &:hover {
    color: #fff;
  }
`;

const NavGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const MyPageButton = styled.button`
  font-size: 1rem;
  color: #d4af37;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 800;
  &:hover {
    color: #fff;
  }
`;

const AuthButton = styled.button`
  font-size: 1rem;
  color: #d4af37;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 800;
  &:hover {
    color: #fff;
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
      onLogout();
    } else {
      navigate("/login");
    }
  };

  const handleMyPageClick = () => {
    navigate("/myPage");
  };

  return (
    <HeaderContainer>
      <HomeButton onClick={handleHomeClick}>GOLD COAST</HomeButton>

      <NavGroup>
        {/* 로그인 상태일 때만 마이페이지 버튼을 표시 */}
        {isAuthenticated && (
          <MyPageButton onClick={handleMyPageClick}>마이페이지</MyPageButton>
        )}
        <AuthButton onClick={handleAuthClick}>
          {isAuthenticated ? "로그아웃" : "로그인"}
        </AuthButton>
      </NavGroup>
    </HeaderContainer>
  );
};

export default Header;
