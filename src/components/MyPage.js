import React, { useEffect, useState } from "react";
import styled from "styled-components";
import fetchWithAuth from "../api";
import { useNavigate } from "react-router-dom";
import OrderDetailModal from "./Modal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1a2a3a;
  text-align: center;
`;

const Section = styled.div`
  width: 100%;
  margin-top: 1.5rem;
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
`;

const MoreButton = styled.button`
  background-color: #d4af37;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #c5a020;
  }
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0.5rem 0;
  line-height: 1.5;
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #d4af37;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    background-color: #f1f1f1;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  background-color: #1a2a3a;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`;

const Status = styled.span`
  font-weight: bold;
  color: #d4af37;
`;

const MyPage = () => {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [isSeller, setIsSeller] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const userInfo = {
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    createdAt: localStorage.getItem("createdAt"),
    role: localStorage.getItem("role"),
  };

  useEffect(() => {
    if (userInfo.role === "SELLER") {
      setIsSeller(true);
      fetchItems();
    } else {
      fetchOrders(page);
    }
  }, [page]);

  const fetchOrders = async (currentPage = 1) => {
    try {
      const response = await fetchWithAuth(
        `/resource/orders?page=${currentPage}&limit=5`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setOrders(data.data);
        setTotalPages(Math.ceil(data.total / 5));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await fetchWithAuth(`/resource/items/seller`, {
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const formatDate = (utcDateString) => {
    const date = new Date(utcDateString);
    return date.toLocaleString("ko-KR", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleMoreClick = (itemId) => {
    navigate(`/order-detail/${itemId}`);
  };

  const openModal = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  const getOrderStatusText = (status) => {
    switch (status) {
      case "ORDER_PLACED":
        return "주문 완료";
      case "ORDER_CANCELLED":
        return "주문 취소";
      case "REFUND_REQUESTED":
        return "환불 요청";
      case "REFUND_COMPLETED":
        return "환불 완료";
      case "RETURN_REQUESTED":
        return "반품 요청";
      case "RETURN_COMPLETED":
        return "반품 완료";
      case "PAYMENT_RECEIVED":
        return "입금 완료";
      case "SHIPPED":
        return "발송 완료";
      case "RECEIVED":
        return "수령 완료";
      default:
        return status; // 혹시 모를 경우 원래 상태 반환
    }
  };

  // 주문 취소 함수 정의
  const onCancelOrder = async (orderId) => {
    try {
      // 주문 취소 API 호출
      const response = await fetchWithAuth(
        `/resource/orders/${orderId}/status?newStatus=ORDER_CANCELLED`,
        {
          method: "PATCH",
        }
      );
      if (response.ok) {
        alert("주문이 취소되었습니다.");
        fetchOrders(); // 주문 목록 새로고침
        setSelectedOrder(null); // 모달 닫기
      } else {
        alert("주문 취소에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <Container>
      <Title>마이페이지</Title>

      <Section>
        <SectionTitle>사용자 정보</SectionTitle>
        <InfoText>
          <HighlightedText>이름:</HighlightedText> {userInfo.username || "N/A"}
        </InfoText>
        <InfoText>
          <HighlightedText>이메일:</HighlightedText> {userInfo.email || "N/A"}
        </InfoText>
        <InfoText>
          <HighlightedText>가입일: </HighlightedText>
          {formatDate(userInfo.createdAt) || "N/A"}
        </InfoText>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>
            {isSeller ? "내 상품 목록" : "최근 주문 내역"}
          </SectionTitle>
          {isSeller && (
            <MoreButton onClick={() => navigate("/item")}>상품 추가</MoreButton>
          )}
        </SectionHeader>

        {isSeller ? (
          items.length === 0 ? (
            <InfoText>등록된 상품이 없습니다.</InfoText>
          ) : (
            <List>
              {items.map((item) => (
                <ListItem
                  key={item.id}
                  onClick={() => handleMoreClick(item.id)}
                >
                  <InfoText>
                    <HighlightedText>종류:</HighlightedText> {item.itemType}
                  </InfoText>
                  <InfoText>
                    <HighlightedText>재고:</HighlightedText> {item.quantity}g
                  </InfoText>
                  <Status>조회</Status>
                </ListItem>
              ))}
            </List>
          )
        ) : orders.length === 0 ? (
          <InfoText>주문 내역이 없습니다.</InfoText>
        ) : (
          <List>
            {orders.map((order) => (
              <ListItem key={order.id} onClick={() => openModal(order)}>
                <InfoText>
                  <HighlightedText>주문 번호:</HighlightedText>{" "}
                  {order.orderNumber}
                </InfoText>
                <InfoText>
                  <HighlightedText>주문 날짜:</HighlightedText>{" "}
                  {formatDate(order.orderDate)}
                </InfoText>
                <InfoText>
                  <HighlightedText>총 금액:</HighlightedText>{" "}
                  {order.totalPrice.toLocaleString()}원
                </InfoText>
                <Status>{getOrderStatusText(order.status)}</Status>
              </ListItem>
            ))}
          </List>
        )}

        {!isSeller && (
          <Pagination>
            <PaginationButton onClick={handlePrevPage} disabled={page === 1}>
              이전
            </PaginationButton>
            <span>
              {page} / {totalPages}
            </span>
            <PaginationButton
              onClick={handleNextPage}
              disabled={page === totalPages}
            >
              다음
            </PaginationButton>
          </Pagination>
        )}
      </Section>
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={closeModal}
          onCancelOrder={onCancelOrder}
        />
      )}
    </Container>
  );
};

export default MyPage;
