import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Headset, ShoppingBag, WalletCards } from 'lucide-react';


const OurPolicies = () => {
  return (
    <div>
      <Card>
        <CardContent className='gap-4 grid md:grid-cols-4 p-4'>
          <div className='space-y-2'>
            <ShoppingBag />
            <div className='font-bold text-sm'>Free Shipping</div>
            <div className='text-muted-foreground text-sm'>
              Free shipping on orders above $100
            </div>
          </div>
          <div className='space-y-2'>
            <DollarSign />
            <div className='font-bold text-sm'>Money Back Guarantee</div>
            <div className='text-muted-foreground text-sm'>
              Within 30 days of purchase
            </div>
          </div>
          <div className='space-y-2'>
            <WalletCards />
            <div className='font-bold text-sm'>Flexible Payment</div>
            <div className='text-muted-foreground text-sm'>
              Pay with credit card, PayPal or COD
            </div>
          </div>
          <div className='space-y-2'>
            <Headset />
            <div className='font-bold text-sm'>24/7 Support</div>
            <div className='text-muted-foreground text-sm'>
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OurPolicies;
