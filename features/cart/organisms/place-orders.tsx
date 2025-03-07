"use client";
import Heading from '@/shared/components/atoms/heading';
import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import CartTotal from '../molecules/cart-total';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import { useCart } from '../hooks/use-cart';
import { useToast } from '@/shared/hooks/use-toast';

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
  const { items, clearCart } = useCart();
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
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      toast({
        title: 'Succès',
        description: 'Votre commande a été passée avec succès!',
      });
      router.push('/orders');
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
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.isCompleted || currentStep === step.id
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            }`}
          >
            {step.isCompleted ? '✓' : step.id}
          </div>
          {index < steps.length - 1 && (
            <div className="w-20 h-1 bg-gray-200 mx-2">
              <div
                className={`h-full ${
                  step.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderDeliveryForm = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg p-6">
        {/* Contact */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4">Contact</h4>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Adresse de livraison */}
        <div className="mb-8">
          <h4 className="text-lg font-medium mb-4">Adresse de livraison</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pays
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-medium mb-4">Notes de commande (optionnel)</h4>
          <textarea
            name="orderNotes"
            value={formData.orderNotes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            placeholder="Instructions spéciales pour la livraison..."
          />
        </div>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-4">Résumé de la commande</h3>
        
        <CartTotal showTitle={false} className="mb-6" />

        <div className="space-y-2 mb-6 border-t pt-4">
          <h4 className="font-medium">Informations de livraison</h4>
          <div className="text-sm text-gray-600">
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.street}</p>
            <p>{formData.city}, {formData.state} {formData.zipcode}</p>
            <p>{formData.country}</p>
            <p>Tél: {formData.phone}</p>
            <p>Email: {formData.email}</p>
          </div>
        </div>
      </div>

      <div className="border rounded p-4">
        <h4 className="font-medium mb-3">Méthode de paiement</h4>
        <div className="flex items-center gap-3">
          <Image className="h-8" src={assets.stripe_logo} alt="Stripe" />
          <span className="text-sm">Paiement sécurisé par Stripe</span>
        </div>
      </div>

      {formData.orderNotes && (
        <div className="border rounded p-4">
          <h4 className="font-medium mb-2">Notes de commande</h4>
          <p className="text-sm text-gray-600">{formData.orderNotes}</p>
        </div>
      )}

      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="h-4 w-4"
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
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
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
            className="ml-auto px-6 py-2 bg-black text-white rounded"
          >
            Continuer
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading || !acceptTerms}
            className="ml-auto px-6 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            {loading ? 'Traitement en cours...' : 'Payer maintenant'}
          </button>
        )}
      </div>
    </form>
  );
};

export default PlaceOrder;
