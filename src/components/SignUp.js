import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;

const FormWrapper = styled.form`
  display: flex
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  padding: 4rem;
  background: #fff;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 2rem;
  margin-bottom: 3rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 2rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1.5px solid #ced4da;
  width: 80%;
  padding: 0.75rem;
  margin-bottom: 2rem;
  font-size: 1rem;
  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const Button = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  padding-bottom: 4px;
`;

const Link = styled.a`
  color: #007bff;
  font-size: 0.9rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetchWithAuth(
        "auth/register",
        {
          method: "POST",
          body: JSON.stringify({
            username,
            email,
            password,
            role,
          }),
        },
        false
      );

      if (response.ok) {
        alert("회원가입 성공!");
        navigate("/login"); // 로그인으로 이동
      } else {
        const data = await response.json();
        setError(data.message || "회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("회원가입 중 문제가 발생했습니다.");
    }
  };

  return (
    <Container>
      <FormWrapper onSubmit={handleSignUp}>
        <Title>Welcome</Title>

        <InputContainer>
          <Input
            type="username"
            placeholder="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="role"
            placeholder="USER/SELLER"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </InputContainer>
        <Link href="/login">Login</Link>
        <ButtonWrapper>
          <Button type="submit">&rarr;</Button>
        </ButtonWrapper>
      </FormWrapper>
    </Container>
  );
};

export default Login;
