import React from "react";
import styled from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1a2a3a;
`;

const Section = styled.div`
  width: 100%;
  margin-top: 0.7rem;
`;

const SectionTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: #555;
  margin-bottom: 0.8rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
`;

const InfoText = styled.p`
  font-size: 1rem;
  color: #333;
  margin: 0.3rem 0;
  line-height: 1.5;
`;

const HighlightedText = styled.span`
  font-weight: bold;
  color: #d4af37;
`;

const CancelButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem 1.2rem;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  &:hover {
    background-color: #c9302c;
  }
`;

const OrderDetailModal = ({ order, onClose, onCancelOrder }) => {
  if (!order) return null;

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
        return status;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Title>주문 상세</Title>

        <Section>
          <InfoText>
            <HighlightedText>주문 번호:</HighlightedText> {order.orderNumber}
          </InfoText>
          <InfoText>
            <HighlightedText>주문 날짜:</HighlightedText> {order.orderDate}
          </InfoText>
          <InfoText>
            <HighlightedText>총 금액:</HighlightedText>{" "}
            {order.totalPrice.toLocaleString()}원
          </InfoText>
          <InfoText>
            <HighlightedText>상태:</HighlightedText>{" "}
            {getOrderStatusText(order.status)}
          </InfoText>
        </Section>

        <Section>
          <SectionTitle>배송지</SectionTitle>
          <InfoText>주소: {order.shippingAddress.streetAddress}</InfoText>
          <InfoText>우편번호: {order.shippingAddress.zipCode}</InfoText>
          <InfoText>상세 주소: {order.shippingAddress.addressDetail}</InfoText>
        </Section>

        <Section>
          <SectionTitle>주문 항목</SectionTitle>
          {order.orderItems.map((item) => (
            <InfoText key={item.id}>
              <HighlightedText>상품 타입:</HighlightedText> {item.itemType} |
              <HighlightedText> 수량:</HighlightedText> {item.quantity}g |
              <HighlightedText> 가격:</HighlightedText>{" "}
              {item.price.toLocaleString()}원
            </InfoText>
          ))}
        </Section>

        {/* 주문 취소 버튼: 주문 상태가 "ORDER_PLACED"일 때만 표시 */}
        {order.status === "ORDER_PLACED" && (
          <CancelButton onClick={() => onCancelOrder(order.id)}>
            주문 취소
          </CancelButton>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export default OrderDetailModal;
