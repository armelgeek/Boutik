import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Row,
  Column,
} from "@react-email/components";

interface OrderStatusUpdateEmailProps {
  customerName: string;
  orderId: string;
  status: string;
  trackingUrl?: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
  }>;
  total: number;
}

const statusMessages = {
  processing: {
    title: "Your order is being prepared",
    message: "Great news! We've received your order and it's currently being prepared for shipment.",
    icon: "📦"
  },
  shipped: {
    title: "Your order has been shipped",
    message: "Your order is on its way! You should receive it within the next few days.",
    icon: "🚚"
  },
  delivered: {
    title: "Your order has been delivered",
    message: "Your order has been successfully delivered. We hope you enjoy your purchase!",
    icon: "✅"
  },
  cancelled: {
    title: "Your order has been cancelled",
    message: "Your order has been cancelled as requested. If you paid for this order, your refund will be processed soon.",
    icon: "❌"
  },
  payment_failed: {
    title: "Payment failed for your order",
    message: "Unfortunately, we couldn't process your payment. Please try placing your order again or contact us for assistance.",
    icon: "⚠️"
  }
};

export const OrderStatusUpdateEmail = ({
  customerName,
  orderId,
  status,
  trackingUrl,
  orderItems,
  total
}: OrderStatusUpdateEmailProps) => {
  const statusInfo = statusMessages[status as keyof typeof statusMessages] || statusMessages.processing;

  return (
    <Html>
      <Head />
      <Preview>{statusInfo.title} - Order #{orderId}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>Boutik</Heading>
          </Section>

          {/* Status Icon and Title */}
          <Section style={statusSection}>
            <Text style={statusIcon}>{statusInfo.icon}</Text>
            <Heading style={statusTitle}>{statusInfo.title}</Heading>
            <Text style={statusMessage}>{statusInfo.message}</Text>
          </Section>

          {/* Order Details */}
          <Section style={orderSection}>
            <Text style={greeting}>Hello {customerName},</Text>
            <Text style={orderInfo}>
              Order #{orderId} • Status: <strong style={statusBadge}>{status.toUpperCase()}</strong>
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
                <Text style={totalLabel}>Total:</Text>
              </Column>
              <Column>
                <Text style={totalAmount}>${(total / 100).toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Tracking Button */}
          {trackingUrl && status === 'shipped' && (
            <Section style={buttonSection}>
              <Button style={trackingButton} href={trackingUrl}>
                Track Your Order
              </Button>
            </Section>
          )}

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

const statusSection = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
};

const statusIcon = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const statusTitle = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const statusMessage = {
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
  color: "#f97316",
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
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0",
  textAlign: "right" as const,
};

const buttonSection = {
  padding: "20px 40px",
  textAlign: "center" as const,
};

const trackingButton = {
  backgroundColor: "#f97316",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
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

export default OrderStatusUpdateEmail;
