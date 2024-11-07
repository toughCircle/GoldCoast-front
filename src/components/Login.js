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

const Form = styled.form`
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
  margin-bottom: 0.5rem;
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
    border-color: #d4af37;
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
  background-color: #d4af37;
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
  color: #d4af37;
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

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetchWithAuth(
        `/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        },
        false
      );

      const data = await response.json();

      if (response.ok) {
        const authHeader = response.headers.get("authorization");
        const refresh = response.headers.get("refresh-token");

        const token =
          authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.slice(7)
            : null;

        localStorage.setItem("role", data.data.role);
        localStorage.setItem("email", data.data.email);
        localStorage.setItem("username", data.data.username);
        localStorage.setItem("createdAt", data.data.createdAt);

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("refresh", refresh);

          setIsAuthenticated(true);

          alert("로그인 성공!");
          navigate("/"); // 홈으로 이동
        } else {
          setError("토큰을 가져오는 데 실패했습니다.");
        }
      } else {
        const data = await response.json();
        setError(data.message || "로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err) {
      setError("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleLogin}>
        <Title>Gold Coast</Title>
        <InputContainer>
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
        </InputContainer>
        <Link href="/signup">SignUp</Link>
        <ButtonWrapper>
          <Button type="submit">&rarr;</Button>
        </ButtonWrapper>
      </Form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Login;
