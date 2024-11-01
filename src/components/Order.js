import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";

const Container = styled.div`
  text-align: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ProductInfo = styled.div`
  display: flex;
  background-color: #f7f7f7;
  text-align: center;
  justify-content: center; /* 중앙 정렬 */
  gap: 3rem; /* 요소 사이 간격 */
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  margin: 1rem auto;
  border-radius: 10px;
  width: 800px;
`;

const ProductName = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
`;

const ProductPrice = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
  text-align: center;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #0056b3;
  }
`;

const QuantityButton = styled.button`
  background-color: #eee;
  width: 30px;
  height: 30px;
  text-align: center;
  color: #333;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.5rem;
  &:hover {
    background-color: #ddd;
  }
`;

const QuantityDisplay = styled.span`
  font-size: 1.2rem;
  color: #333;
`;

const AddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 4rem;
  gap: 2rem;
`;

const AddressInput = styled.input`
  width: 400px;
  padding: 0.8rem;
  margin: 0.5rem;
  border: none;
  border-bottom: 1px solid #ddd;
`;

const PurchaseButton = styled.button`
  width: 520px;
  padding: 1rem;
  background-color: #007bff;
  color: white;
  font-size: 1.2rem;
  border: none;
  border-radius: 5px;
  margin-top: 4rem;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  &:hover {
    background-color: #0056b3;
  }
`;

const OrderPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { item, quantity: initialQuantity } = state || {};
  const [quantity, setQuantity] = useState(initialQuantity || 1);
  const [isEditing, setIsEditing] = useState(false);
  const [address, setAddress] = useState({
    zipCode: "",
    streetAddress: "",
    addressDetail: "",
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handlePurchase = async () => {
    const orderData = {
      items: [
        {
          id: item.id,
          quantity: quantity,
        },
      ],
      shippingAddress: address,
    };
    try {
      const response = await fetchWithAuth(`resource/orders`, {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("주문 완료:", responseData);
        // 주문 완료 후 동작 (예: 페이지 이동 또는 알림 표시)
        navigate("/order-result", { state: responseData.data });
      } else {
        console.error("주문 실패:", response.statusText);
      }
    } catch (error) {
      console.error("주문 요청 중 오류 발생:", error);
    }
  };

  const totalPrice = Math.round(item.price * quantity).toLocaleString();

  return (
    <Container>
      <Title>Order</Title>
      <InfoText>주문 상품</InfoText>
      <ProductInfo>
        <ProductName>{item?.itemType}</ProductName>
        <ProductPrice>{totalPrice?.toLocaleString()} 원</ProductPrice>

        {!isEditing && <QuantityDisplay>{quantity}</QuantityDisplay>}

        {/* 수량 조절 UI - 편집 모드일 때만 활성화 */}
        {isEditing && (
          <QuantityControl>
            <QuantityButton onClick={() => handleQuantityChange(-0.5)}>
              -
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton onClick={() => handleQuantityChange(0.5)}>
              +
            </QuantityButton>
          </QuantityControl>
        )}

        {/* 편집 버튼 */}
        <EditButton onClick={toggleEditMode}>
          {isEditing ? "완료" : "편집"}
        </EditButton>
      </ProductInfo>

      <AddressContainer>
        {/* 주소 입력 및 구매 버튼 */}
        <AddressInput
          type="text"
          name="zipCode"
          placeholder="우편번호"
          value={address.zipCode}
          onChange={handleAddressChange}
        />
        <AddressInput
          type="text"
          name="streetAddress"
          placeholder="도로명 주소"
          value={address.streetAddress}
          onChange={handleAddressChange}
        />
        <AddressInput
          type="text"
          name="addressDetail"
          placeholder="상세 주소"
          value={address.addressDetail}
          onChange={handleAddressChange}
        />
      </AddressContainer>

      <PurchaseButton onClick={handlePurchase}>구매하기</PurchaseButton>
    </Container>
  );
};

export default OrderPage;
