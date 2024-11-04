import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 7rem;
`;

const Select = styled.select`
  font-size: 1rem;
  padding: 0.5rem;
  margin-bottom: 3rem;
  width: 200px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1.5px solid #ced4da;
  font-size: 1.2rem;
  padding: 0.5rem;
  width: 200px;
  text-align: center;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  margin-top: -0.5rem;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 7rem;
`;

const Button = styled.button`
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const AddProductPage = () => {
  const location = useLocation();
  const { priceData } = location.state || {};
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSelectChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async () => {
    if (!selectedType || !quantity) {
      alert("종류와 수량을 모두 입력하세요.");
      return;
    }

    if (quantity % 0.5 !== 0) {
      alert("수량은 0.5g 단위로만 입력 가능합니다.");
      return;
    }

    const selectedItem = priceData.find(
      (item) => item.goldType === selectedType
    );

    const createData = {
      itemType: selectedType,
      quantity: parseFloat(quantity), // 수량을 숫자로 변환
      price: selectedItem ? selectedItem.price : null, // 선택된 항목의 가격 추가
    };

    try {
      const response = await fetchWithAuth("/resource/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createData),
      });

      if (response.ok) {
        alert("상품 등록이 성공했습니다!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(`상품 등록 실패: ${errorData.message || "알 수 없는 오류"}`);
      }
    } catch (error) {
      alert(`서버 요청 중 오류 발생: ${error.message}`);
    }
  };

  return (
    <Container>
      <Title>상품 등록</Title>

      {priceData && (
        <>
          <Select value={selectedType} onChange={handleSelectChange}>
            <option value="">금 종류 선택</option>
            {priceData.map((price, index) => (
              <option key={index} value={price.goldType}>
                {price.goldType} - {price.price.toLocaleString()}원
              </option>
            ))}
          </Select>
        </>
      )}

      <Input
        type="number"
        placeholder="수량"
        value={quantity}
        onChange={handleQuantityChange}
        step="0.5"
        min="0.5"
      />
      <InfoText>수량은 0.5g 단위로 등록 가능합니다.</InfoText>

      <Button onClick={handleSubmit}>등록하기</Button>
    </Container>
  );
};

export default AddProductPage;
