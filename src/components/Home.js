import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";
import LoadingSpinner from "./Loading";

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
  margin-top: 1.5rem;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #ddd;
  border-radius: 10px;
  margin-bottom: 2rem;
  width: 600px;
`;

const Icon = styled.span`
  cursor: pointer;
  font-size: 1.5rem;
  color: #333333;
  &:hover {
    color: #d4af37;
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
  color: #333333;
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

const ItemQuantity = styled.span`
  text-align: left;
  width: 80px;
  font-size: 0.9rem;
  color: #333;
`;

const ItemPrice = styled.span`
  text-align: left;
  width: 100px;
  font-size: 0.9rem;
  color: #333;
`;

const BuyLink = styled.a`
  font-size: 0.9rem;
  color: #1a2a3a;
  cursor: pointer;
  text-decoration: none;
  font-weight: 800;
  &:hover {
    color: #d4af37;
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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const TabButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${({ active }) => (active ? "#d4af37" : "#f0f0f0")};
  color: ${({ active }) => (active ? "white" : "#333")};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d4af37;
    color: white;
  }
`;

const AddProductButton = styled.button`
  font-size: 1rem;
  color: #d4af37;
  background: none;
  border: 1px solid #d4af37;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  margin-top: 2rem; // 탭 버튼과 간격 추가
  &:hover {
    background-color: #f0f0f0;
  }
`;

const Home = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [updateTime, setUpdateTime] = useState("16:00 UPDATE");
  const [itemData, setItemData] = useState([]);
  const [sortedItemData, setSortedItemData] = useState([]);
  const [activeTab, setActiveTab] = useState("available");
  const navigate = useNavigate();
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === priceData.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 2초마다 자동으로 다음 인덱스로 이동

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 해제
  }, [priceData.length, currentIndex]);

  // 상품 등록 페이지로 priceData를 전달하며 이동하는 함수
  const handleAddProduct = () => {
    navigate("/item", { state: { priceData } });
  };

  useEffect(() => {
    // itemData가 업데이트될 때마다 정렬된 데이터를 필터링하여 보여줌
    const filteredData = itemData.filter((item) =>
      activeTab === "available" ? item.quantity > 0 : item.quantity === 0
    );

    const sortedData = filteredData.sort((a, b) => {
      const quantityA = parseFloat(a.quantity);
      const quantityB = parseFloat(b.quantity);

      if (quantityA === 0 && quantityB !== 0) return 1;
      if (quantityA !== 0 && quantityB === 0) return -1;
      return 0;
    });

    setSortedItemData(sortedData);
  }, [itemData, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Title>GOLD COAST</Title>

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

      {/* SELLER 사용자일 경우에만 상품 등록 버튼을 표시 */}
      {userRole === "SELLER" && (
        <AddProductButton onClick={handleAddProduct}>
          상품 등록
        </AddProductButton>
      )}

      {/* 탭 메뉴 추가 */}
      <TabContainer>
        <TabButton
          active={activeTab === "available"}
          onClick={() => handleTabClick("available")}
        >
          판매 중인 상품
        </TabButton>
        <TabButton
          active={activeTab === "soldOut"}
          onClick={() => handleTabClick("soldOut")}
        >
          품절 상품
        </TabButton>
      </TabContainer>
      <ContentWrapper>
        <ItemTitle>ITEMS</ItemTitle>
        <ItemContainer>
          {sortedItemData.map((item, index) => (
            <Item key={index}>
              <DetailContainer>
                <ItemName>{index}</ItemName>
                <ItemName>종류 | {item.itemType}K</ItemName>
                <ItemQuantity>재고 | {item.quantity}g</ItemQuantity>
                <ItemPrice>1g | {item.price.toLocaleString()}원</ItemPrice>
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
