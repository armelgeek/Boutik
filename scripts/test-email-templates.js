import { render } from "@react-email/render";
import { OrderStatusUpdateEmail } from "../features/orders/components/organisms/email-templates/order-status-update";
import { OrderConfirmationEmail } from "../features/orders/components/organisms/email-templates/order-confirmation";

// Test data
const testOrderData = {
  customerName: "John Doe",
  orderId: "ORD-123456",
  orderItems: [
    {
      name: "Premium T-Shirt",
      quantity: 2,
      price: 2999, // $29.99 in cents
      size: "L"
    },
    {
      name: "Jeans Classic",
      quantity: 1,
      price: 4999, // $49.99 in cents
      size: "32"
    }
  ],
  total: 8997, // $89.97 in cents
  shippingAddress: {
    fullName: "John Doe",
    address: "123 Main Street",
    city: "New York",
    postalCode: "10001",
    country: "USA"
  }
};

async function testEmailTemplates() {
  console.log("Testing email templates...");

  try {
    // Test order confirmation email
    const confirmationHtml = await render(
      OrderConfirmationEmail({
        customerName: testOrderData.customerName,
        orderId: testOrderData.orderId,
        orderItems: testOrderData.orderItems,
        total: testOrderData.total,
        shippingAddress: testOrderData.shippingAddress
      })
    );
    console.log("✅ Order confirmation email template rendered successfully");

    // Test order status update emails
    const statuses = ['processing', 'shipped', 'delivered', 'cancelled', 'payment_failed'];
    
    for (const status of statuses) {
      const statusHtml = await render(
        OrderStatusUpdateEmail({
          customerName: testOrderData.customerName,
          orderId: testOrderData.orderId,
          status: status,
          orderItems: testOrderData.orderItems,
          total: testOrderData.total,
          trackingUrl: status === 'shipped' ? 'https://tracking.example.com/123456' : undefined
        })
      );
      console.log(`✅ Order status email (${status}) template rendered successfully`);
    }

    console.log("\n🎉 All email templates are working correctly!");
    
  } catch (error) {
    console.error("❌ Error testing email templates:", error);
  }
}

// Run the test
testEmailTemplates();
