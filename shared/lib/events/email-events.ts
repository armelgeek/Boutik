import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from '@/shared/lib/config/email';
import { sendPostRegistrationWelcomeEmail } from '@/features/auth/utils/post-registration-email';

// Types d'événements
export type EmailEvent = 
  | 'user.registered'
  | 'user.verified'
  | 'order.created'
  | 'order.status_updated'
  | 'order.cancelled'
  | 'order.delivered';

// Interface pour les données d'événement
interface EventData {
  'user.registered': {
    userId: string;
    email: string;
    name: string;
  };
  'user.verified': {
    userId: string;
    email: string;
    name: string;
  };
  'order.created': {
    orderId: string;
    customerEmail: string;
    customerName: string;
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
  };
  'order.status_updated': {
    orderId: string;
    customerEmail: string;
    customerName: string;
    status: string;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
      size?: string;
    }>;
    total: number;
    trackingUrl?: string;
  };
  'order.cancelled': {
    orderId: string;
    customerEmail: string;
    customerName: string;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
      size?: string;
    }>;
    total: number;
    reason?: string;
  };
  'order.delivered': {
    orderId: string;
    customerEmail: string;
    customerName: string;
    orderItems: Array<{
      name: string;
      quantity: number;
      price: number;
      size?: string;
    }>;
    total: number;
  };
}

// Gestionnaire d'événements email
export class EmailEventHandler {
  static async handleEvent<T extends EmailEvent>(
    event: T,
    data: EventData[T]
  ): Promise<void> {
    try {
      switch (event) {
        case 'user.registered':
          await this.handleUserRegistered(data as EventData['user.registered']);
          break;
        
        case 'user.verified':
          await this.handleUserVerified(data as EventData['user.verified']);
          break;
        
        case 'order.created':
          await this.handleOrderCreated(data as EventData['order.created']);
          break;
        
        case 'order.status_updated':
          await this.handleOrderStatusUpdated(data as EventData['order.status_updated']);
          break;
        
        case 'order.cancelled':
          await this.handleOrderCancelled(data as EventData['order.cancelled']);
          break;
        
        case 'order.delivered':
          await this.handleOrderDelivered(data as EventData['order.delivered']);
          break;
        
        default:
          console.warn(`Unhandled email event: ${event}`);
      }
    } catch (error) {
      console.error(`Error handling email event ${event}:`, error);
    }
  }

  private static async handleUserRegistered(data: EventData['user.registered']): Promise<void> {
    // Envoyer un email de bienvenue après l'inscription
    await sendPostRegistrationWelcomeEmail({
      email: data.email,
      name: data.name,
    });
  }

  private static async handleUserVerified(data: EventData['user.verified']): Promise<void> {
    // Optionnel: envoyer un email de félicitation après vérification
    console.log(`User ${data.email} has been verified successfully`);
  }

  private static async handleOrderCreated(data: EventData['order.created']): Promise<void> {
    // Envoyer un email de confirmation de commande
    await sendOrderConfirmationEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      orderItems: data.orderItems,
      total: data.total,
      status: 'processing',
      shippingAddress: data.shippingAddress,
    });
  }

  private static async handleOrderStatusUpdated(data: EventData['order.status_updated']): Promise<void> {
    // Envoyer un email de mise à jour de statut
    await sendOrderStatusUpdateEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      status: data.status,
      orderItems: data.orderItems,
      total: data.total,
      trackingUrl: data.trackingUrl,
    });
  }

  private static async handleOrderCancelled(data: EventData['order.cancelled']): Promise<void> {
    // Envoyer un email de confirmation d'annulation
    await sendOrderStatusUpdateEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      status: 'cancelled',
      orderItems: data.orderItems,
      total: data.total,
    });
  }

  private static async handleOrderDelivered(data: EventData['order.delivered']): Promise<void> {
    // Envoyer un email de confirmation de livraison
    await sendOrderStatusUpdateEmail({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      status: 'delivered',
      orderItems: data.orderItems,
      total: data.total,
    });
  }
}

// Fonction helper pour émettre des événements
export const emitEmailEvent = async <T extends EmailEvent>(
  event: T,
  data: EventData[T]
): Promise<void> => {
  await EmailEventHandler.handleEvent(event, data);
};
