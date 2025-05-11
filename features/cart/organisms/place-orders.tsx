"use client";
import axios from 'axios';
import Heading from '@/shared/components/atoms/heading';
import { redirect, useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import CartTotal from '../molecules/cart-total';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useCart } from '../hooks/use-cart';
import { useToast } from '@/shared/hooks/use-toast';
import { useShop } from '@/features/products/hooks/use-shop';
import useSortedCart from '../hooks/use-sorted-cart';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  orderNotes?: string;
}

interface CheckoutStep {
  id: number;
  title: string;
  isCompleted: boolean;
}

const PlaceOrder = () => {
  const router = useRouter();
  const { cartItems } = useShop();
  const items = useSortedCart(cartItems);
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [steps, setSteps] = useState<CheckoutStep[]>([
    { id: 1, title: 'Panier', isCompleted: true },
    { id: 2, title: 'Informations de livraison', isCompleted: false },
    { id: 3, title: 'Confirmation et Paiement', isCompleted: false }
  ]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: '',
    orderNotes: ''
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Object.keys(items).length > 0;

      case 2:
        if (currentStep === 2) {
          const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
          const hasEmptyFields = requiredFields.some(field => !formData[field as keyof FormData]);

          if (hasEmptyFields) {
            toast({
              title: 'Erreur',
              description: 'Veuillez remplir tous les champs obligatoires',
              variant: 'destructive'
            });
            return false;
          }
          return true;
        }
        return true;

      case 3:
        if (currentStep === 3) {
          if (!acceptTerms) {
            toast({
              title: 'Erreur',
              description: 'Veuillez accepter les conditions générales de vente',
              variant: 'destructive'
            });
            return false;
          }
          return true;
        }
        return true;

      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      const newSteps = [...steps];
      newSteps[currentStep - 1].isCompleted = true;
      setSteps(newSteps);
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setLoading(true);
    try {


      const {
        data: { url },
      } = await axios.post('/api/stripe/checkout_sessions', {
        items: cartItems,
      });
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de la commande. Veuillez réessayer.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step.isCompleted || currentStep === step.id
              ? 'bg-green-500 text-white'
              : 'bg-gray-200'
              }`}
          >
            {step.isCompleted ? '✓' : step.id}
          </div>
          {index < steps.length - 1 && (
            <div className="bg-gray-200 mx-2 w-20 h-1">
              <div
                className={`h-full ${step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDeliveryForm = () => (
    <div className="mx-auto max-w-2xl">
      <div className="bg-white p-6 rounded-lg">
        {/* Contact */}
        <div className="mb-8">
          <h4 className="mb-4 font-medium text-lg">Contact</h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
              />
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="mb-8">
          <h4 className="mb-4 font-medium text-lg">Adresse de livraison</h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Adresse
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
              />
            </div>
            <div className="gap-4 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Code postal
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
            </div>
            <div className="gap-4 grid grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Région
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-medium text-lg">Notes de commande (optionnel)</h4>
          <textarea
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleInputChange}
            rows={4}
            className="px-4 py-2.5 border focus:border-transparent rounded-lg focus:ring-2 focus:ring-black w-full resize-none"
            placeholder="Instructions spéciales pour la livraison..."
          />
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="space-y-4">
      <div className="p-4 border rounded">
        <h3 className="mb-4 font-semibold">Résumé de la commande</h3>

        <CartTotal showTitle={false} className="mb-6" />

        <div className="space-y-2 mb-6 pt-4 border-t">
          <h4 className="font-medium">Informations de livraison</h4>
          <div className="text-gray-600 text-sm">
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.street}</p>
            <p>{formData.city}, {formData.state} {formData.zipcode}</p>
            <p>{formData.country}</p>
            <p>Tél: {formData.phone}</p>
            <p>Email: {formData.email}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border rounded">
        <h4 className="mb-3 font-medium">Méthode de paiement</h4>
        <div className="flex items-center gap-3">
          <Image className="h-8" src={assets.stripe_logo} alt="Stripe" />
          <span className="text-sm">Paiement sécurisé par Stripe</span>
        </div>
      </div>

      {formData.orderNotes && (
        <div className="p-4 border rounded">
          <h4 className="mb-2 font-medium">Notes de commande</h4>
          <p className="text-gray-600 text-sm">{formData.orderNotes}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="terms" className="text-sm">
          J'accepte les conditions générales de vente *
        </label>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <CartTotal />;
      case 2:
        return renderDeliveryForm();
      case 3:
        return renderOrderSummary();
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto px-4 py-8 max-w-4xl">
      {renderStepIndicator()}

      <div className="mb-8">
        <Heading
          text1={steps[currentStep - 1].title}
          text2=""
        />
      </div>

      <div className="mb-8">
        {renderCurrentStep()}
      </div>

      <div className="flex justify-between mt-8">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handlePreviousStep}
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Retour
          </button>
        )}

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="bg-black ml-auto px-6 py-2 rounded text-white"
          >
            Continuer
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="bg-black disabled:opacity-50 ml-auto px-6 py-2 rounded text-white"
          >
            {loading ? 'Traitement en cours...' : 'Payer maintenant'}
          </button>
        )}
      </div>
    </form>
  );
};

export default PlaceOrder;
