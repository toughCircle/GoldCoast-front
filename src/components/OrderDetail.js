import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import fetchWithAuth from "../api";
import OrderDetailModal from "./Modal";

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f9f9f9;
  padding: 1rem 2rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  width: 600px;
  cursor: pointer;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
    background-color: #f1f1f1;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderNumber = styled.p`
  font-weight: bold;
  color: #555;
`;

const OrderDetails = styled.p`
  color: #777;
  font-size: 0.9rem;
`;

const Status = styled.span`
  font-weight: bold;
  color: #d4af37;
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

const OrderList = () => {
  const { itemId } = useParams(); // URL에서 itemId를 가져옵니다.
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async (currentPage = 1) => {
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
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, itemId, fetchOrders]);

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

  return (
    <OrderContainer>
      <h2>주문 내역</h2>
      {orders.length === 0 ? (
        <p>주문 내역이 없습니다.</p>
      ) : (
        orders.map((order) => (
          <OrderItem key={order.id} onClick={() => openModal(order)}>
            <OrderInfo>
              <OrderNumber>종류 | {order.orderItems[0].itemType}</OrderNumber>
              <OrderDetails>
                재고 | {order.orderItems[0].quantity}g
              </OrderDetails>
              <OrderDetails>
                1g | {order.orderItems[0].price.toLocaleString()}원
              </OrderDetails>
            </OrderInfo>
            <Status>{getOrderStatusText(order.status)}</Status>
          </OrderItem>
        ))
      )}
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

      {/* 주문 상세 모달 */}
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={closeModal} />
      )}
    </OrderContainer>
  );
};

export default OrderList;
