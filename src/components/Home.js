import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";

const Container = styled.div`
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 2rem;
  width: 600px;
`;

const Icon = styled.span`
  cursor: pointer;
  font-size: 1.5rem;
  color: #333;
  &:hover {
    color: #007bff;
  }
`;

const ContentWrapper = styled.div`
  margin-right: 2rem;
  width: 600px;
  text-align: left;
  margin-top: 5rem;
`;

const ItemTitle = styled.h2`
  margin-left: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  width: 100%;
`;

const DetailContainer = styled.div`
  display: flex;
  width: 480px;
  align-items: center;
  justify-content: space-between;
`;

const ItemName = styled.span`
  font-size: 0.9rem;
  color: #333;
`;

const ItemPrice = styled.span`
  text-align: left;
  width: 120px;
  font-size: 0.9rem;
  color: #333;
`;

const BuyLink = styled.a`
  font-size: 0.9rem;
  color: #007bff;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const UpdateInfo = styled.span`
  font-size: 0.8rem;
  color: #888;
  margin-top: -1rem;
  display: block;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 1rem;
`;

const Home = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updateTime, setUpdateTime] = useState("16:00 UPDATE");
  const [itemData, setItemData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        // authRequired를 false로 설정해 토큰이 필요 없는 요청 보내기
        const response = await fetchWithAuth(
          "/resource/goldPrice",
          {
            method: "GET",
          },
          false
        );
        if (response.ok) {
          const data = await response.json();
          setPriceData(data.data);
        } else {
          console.error("데이터를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchPriceData();
  }, []);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        const response = await fetchWithAuth(
          `/resource/items`,
          {
            method: "GET",
          },
          false
        );
        if (!response.ok) {
          throw new Error("상품 정보를 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        setItemData(data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchItemData();
  }, []);

  useEffect(() => {
    const checkUpdateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const date = now.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
      });

      if (hours >= 23) {
        setUpdateTime(`${date} 23:00 UPDATE`);
      } else if (hours >= 16) {
        setUpdateTime(`${date} 16:00 UPDATE`);
      } else {
        const previousDate = new Date(now);
        previousDate.setDate(now.getDate() - 1);
        const previousDateString = previousDate.toLocaleDateString("ko-KR", {
          month: "long",
          day: "numeric",
        });
        setUpdateTime(`${previousDateString} 23:00 UPDATE`);
      }
    };

    // 페이지 로드 시 처음 실행
    checkUpdateTime();

    // 이후 1시간마다 현재 시간 확인
    const interval = setInterval(checkUpdateTime, 600000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : priceData.length - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < priceData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handleBuyClick = (itemId) => {
    navigate(`/itemDetail/${itemId}`);
  };

  if (loading) return <p>로딩 중...</p>;

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title>Today</Title>

      {priceData.length > 0 ? (
        <PriceInfo>
          <Icon onClick={handlePrev}>&lt;</Icon>
          <span>{priceData[currentIndex].goldType}K</span>
          <span>{priceData[currentIndex].price.toLocaleString()} 원</span>
          <Icon onClick={handleNext}>&gt;</Icon>
        </PriceInfo>
      ) : (
        <p>가격 정보를 불러오는 중입니다...</p>
      )}

      <UpdateInfo>{updateTime}</UpdateInfo>
      <br />
      <UpdateInfo>1g당 가격</UpdateInfo>

      <ContentWrapper>
        <ItemTitle>ITEMS</ItemTitle>
        <ItemContainer>
          {itemData.map((item, index) => (
            <Item key={index}>
              <DetailContainer>
                <ItemName>{item.id}</ItemName>
                <ItemPrice>종류 | {item.itemType}K</ItemPrice>
                <ItemPrice>재고 | {item.quantity}g</ItemPrice>
                <ItemPrice>{item.price.toLocaleString()}원</ItemPrice>
              </DetailContainer>
              {item.quantity > 0 ? (
                <BuyLink onClick={() => handleBuyClick(item.id)}>
                  구매하기
                </BuyLink>
              ) : (
                <BuyLink
                  as="span"
                  style={{ color: "#888", cursor: "not-allowed" }}
                >
                  판매 완료
                </BuyLink>
              )}
            </Item>
          ))}
        </ItemContainer>
      </ContentWrapper>
    </Container>
  );
};

export default Home;
