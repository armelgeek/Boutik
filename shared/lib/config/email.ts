import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
import {
  ChangeEmailVerificationTemplate,
  ResetPasswordEmailTemplate,
  VerificationEmailTemplate,
  WelcomeEmailTemplate,
  EmailChangeVerificationImprovedTemplate,
  PasswordResetImprovedTemplate
} from '@/features/auth/components/organisms/email-templates';
import { OrderStatusUpdateEmail, OrderConfirmationEmail } from '@/features/orders/components/organisms/email-templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendVerificationEmail = async ({ email, verificationUrl, }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your Email address",
    html: await render(
      VerificationEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendResetPasswordEmail = async ({
                                               email,
                                               verificationUrl,
                                             }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset Password Link",
    html: await render(
      ResetPasswordEmailTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendChangeEmailVerification = async ({ email, verificationUrl }: {
  email: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Change Email Verification",
    html: await render(
      ChangeEmailVerificationTemplate({ inviteLink: verificationUrl })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
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

export const sendOrderStatusUpdateEmail = async (orderData: OrderEmailData) => {
  const statusSubjects = {
    processing: "Your order is being prepared",
    shipped: "Your order has been shipped",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
    payment_failed: "Payment failed for your order"
  };

  const subject = statusSubjects[orderData.status as keyof typeof statusSubjects] || "Order Status Update";

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: orderData.customerEmail,
    subject: `${subject} - Order #${orderData.orderId}`,
    html: await render(
      OrderStatusUpdateEmail({
        customerName: orderData.customerName,
        orderId: orderData.orderId,
        status: orderData.status,
        trackingUrl: orderData.trackingUrl,
        orderItems: orderData.orderItems,
        total: orderData.total
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order status email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order status email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (orderData: OrderEmailData & { 
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  } 
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: orderData.customerEmail,
    subject: `Order Confirmation - Thank you for your purchase! #${orderData.orderId}`,
    html: await render(
      OrderConfirmationEmail({
        customerName: orderData.customerName,
        orderId: orderData.orderId,
        orderItems: orderData.orderItems,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    throw error;
  }
};

// Fonctions d'email améliorées pour Better Auth

export const sendWelcomeEmail = async ({ email, userName, verificationUrl }: {
  email: string;
  userName: string;
  verificationUrl: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to Boutik - Verify your email to get started!",
    html: await render(
      WelcomeEmailTemplate({ 
        userName, 
        verificationUrl 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendImprovedResetPasswordEmail = async ({
  email,
  verificationUrl,
  userName,
}: {
  email: string;
  verificationUrl: string;
  userName?: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your Boutik password",
    html: await render(
      PasswordResetImprovedTemplate({ 
        verificationUrl, 
        userName 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Improved reset password email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending improved reset password email:', error);
    throw error;
  }
};

export const sendImprovedChangeEmailVerification = async ({ email, verificationUrl, newEmail }: {
  email: string;
  verificationUrl: string;
  newEmail: string;
}) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify your new email address for Boutik",
    html: await render(
      EmailChangeVerificationImprovedTemplate({ 
        verificationUrl, 
        newEmail 
      })
    ),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Improved email change verification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending improved email change verification:', error);
    throw error;
  }
};


