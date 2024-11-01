import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 8rem;
`;

const ProductType = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 4rem;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.2rem;
  margin-bottom: 4rem;
`;

const Icon = styled.button`
  font-size: 1.5rem;
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: #0056b3;
  }
`;

const StockInfo = styled.p`
  font-size: 1rem;
  color: #555;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #888;
  margin-bottom: 5rem;
`;

const BuyButton = styled.button`
  padding: 0.75rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ProductDetail = () => {
  const { itemId } = useParams();
  const [quantity, setQuantity] = useState(0.5); // 초기 수량 설정 (예: 0.5g)
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePurchase = () => {
    navigate("/order", {
      state: { item, quantity },
    });
  };

  useEffect(() => {
    const fetchItemDetail = async () => {
      try {
        const response = await fetchWithAuth(`/resource/items/${itemId}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("상품 정보를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setItem(data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItemDetail();
  }, [itemId]);

  // 수량 증가
  const increaseQuantity = () => {
    if (quantity + 0.5 <= item.quantity) {
      setQuantity((prevQuantity) => prevQuantity + 0.5);
    }
  };

  // 수량 감소
  const decreaseQuantity = () => {
    if (quantity - 0.5 >= 0.5) {
      setQuantity((prevQuantity) => prevQuantity - 0.5);
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container>
      <Title>Product</Title>

      <ProductType>{item.itemType}K</ProductType>

      <QuantityContainer>
        <Icon onClick={decreaseQuantity}>−</Icon>
        <span>{quantity.toFixed(1)} g</span>
        <Icon onClick={increaseQuantity}>+</Icon>
      </QuantityContainer>

      <StockInfo>재고 | {item.quantity}g</StockInfo>

      <InfoText>수량은 0.5g 단위로 선택 가능합니다.</InfoText>

      <BuyButton onClick={handlePurchase}>구매하기</BuyButton>
    </Container>
  );
};

export default ProductDetail;
