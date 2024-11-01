// OrderResult.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 4rem;
`;

const OrderNumber = styled.h3`
  font-size: 1.2rem;
  color: #007bff;
  margin-bottom: 1rem;
  margin-top: -1rem;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-top: -1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  width: 50%;
`;

const ItemWrapper = styled.div`
  background-color: #eee;
  padding: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  border-radius: 20px;
`;

const ItemName = styled.h4`
  font-size: 1rem;
  color: #555;
`;

const Quantity = styled.p`
  font-size: 1rem;
  color: #333;
`;

const ItemPrice = styled.p`
  font-size: 1rem;
  color: #333;
`;

const Price = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: ##333;
`;

const TotalPrice = styled.h3`
  font-size: 1.4rem;
  font-weight: bold;
  color: #007bff;
  margin-top: -1rem;
`;

const Button = styled.button`
  margin-top: 3rem;
  padding: 1rem 2rem;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const OrderResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <Container>
      <Title>Order Result</Title>
      <Price>주문 번호</Price>
      <OrderNumber>{state.orderNumber}</OrderNumber>

      <Price>주문 내역</Price>
      <ItemContainer>
        {state.orderItems.length > 0 ? (
          state.orderItems.map((item, index) => (
            <ItemWrapper key={index}>
              <ItemName>ITEM.{item.id}</ItemName>
              <Quantity>수량: {item.quantity}g</Quantity>
              <ItemPrice>{item.price.toLocaleString()} 원</ItemPrice>
            </ItemWrapper>
          ))
        ) : (
          <p>주문 항목이 없습니다.</p>
        )}
      </ItemContainer>

      <Price>총 결제 금액</Price>
      <TotalPrice>{state.totalPrice?.toLocaleString()} 원</TotalPrice>
      <Button onClick={() => navigate("/")}>메인화면</Button>
    </Container>
  );
};

export default OrderResult;
