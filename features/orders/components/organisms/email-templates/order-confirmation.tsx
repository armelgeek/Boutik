import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface OrderConfirmationEmailProps {
  customerName: string;
  orderId: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  total: number;
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export const OrderConfirmationEmail = ({
  customerName,
  orderId,
  orderItems,
  total,
  shippingAddress
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Order Confirmation - Thank you for your purchase! #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Boutik</Heading>
          </Section>

          {/* Confirmation Icon and Title */}
          <Section style={confirmationSection}>
            <Text style={confirmationIcon}>🎉</Text>
            <Heading style={confirmationTitle}>Thank you for your order!</Heading>
            <Text style={confirmationMessage}>
              Your order has been confirmed and is being prepared for shipment.
            </Text>
          </Section>

          {/* Order Details */}
          <Section style={orderSection}>
            <Text style={greeting}>Hello {customerName},</Text>
            <Text style={orderInfo}>
              Order #{orderId} • Status: <strong style={statusBadge}>CONFIRMED</strong>
            </Text>
            
            <Hr style={divider} />
            
            {/* Order Items */}
            <Text style={sectionTitle}>Order Items:</Text>
            {orderItems.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  {item.size && <Text style={itemSize}>Size: {item.size}</Text>}
                  <Text style={itemQuantity}>Qty: {item.quantity}</Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={priceText}>${(item.price / 100).toFixed(2)}</Text>
                </Column>
              </Row>
            ))}
            
            <Hr style={divider} />
            
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Total Paid:</Text>
              </Column>
              <Column>
                <Text style={totalAmount}>${(total / 100).toFixed(2)}</Text>
              </Column>
            </Row>

            {/* Shipping Address */}
            {shippingAddress && (
              <>
                <Hr style={divider} />
                <Text style={sectionTitle}>Shipping Address:</Text>
                <Text style={addressText}>
                  {shippingAddress.fullName}<br />
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.postalCode}<br />
                  {shippingAddress.country}
                </Text>
              </>
            )}
          </Section>

          {/* What&apos;s Next */}
          <Section style={nextStepsSection}>
            <Text style={sectionTitle}>What&apos;s Next?</Text>
            <Text style={nextStepsText}>
              • We&apos;ll prepare your order and update you when it ships<br />
              • You&apos;ll receive a tracking number once your order is dispatched<br />
              • Expected delivery: 3-5 business days
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Thank you for shopping with Boutik! If you have any questions, please don&apos;t hesitate to contact us.
            </Text>
            <Text style={footerContact}>
              Email: support@boutik.com | Phone: +1 (555) 123-4567
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "20px 40px",
  backgroundColor: "#f97316",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const confirmationSection = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
};

const confirmationIcon = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const confirmationTitle = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const confirmationMessage = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const orderSection = {
  padding: "20px 40px",
};

const greeting = {
  color: "#1f2937",
  fontSize: "16px",
  margin: "0 0 16px 0",
};

const orderInfo = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 20px 0",
};

const statusBadge = {
  color: "#059669",
  fontWeight: "600",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const sectionTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const itemRow = {
  marginBottom: "12px",
};

const itemDetails = {
  verticalAlign: "top" as const,
  width: "70%",
};

const itemName = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0 0 4px 0",
};

const itemSize = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0 0 4px 0",
};

const itemQuantity = {
  color: "#6b7280",
  fontSize: "12px",
  margin: "0",
};

const itemPrice = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
  width: "30%",
};

const priceText = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "500",
  margin: "0",
};

const totalRow = {
  marginTop: "16px",
};

const totalLabel = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
  textAlign: "left" as const,
};

const totalAmount = {
  color: "#059669",
  fontSize: "18px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
};

const addressText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const nextStepsSection = {
  padding: "20px 40px",
  backgroundColor: "#f3f4f6",
  margin: "20px 40px",
  borderRadius: "8px",
};

const nextStepsText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const footer = {
  padding: "20px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
  marginTop: "32px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const footerContact = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
};

export default OrderConfirmationEmail;
