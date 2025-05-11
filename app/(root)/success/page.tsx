'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/features/cart/hooks/use-cart';
import { Check } from 'lucide-react';
import { shootFireworks } from '@/shared/lib/utils';

const Success = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const { clearCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionData, setSessionData] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setLoading(false);
            return;
        }

        const fetchSessionData = async () => {
            try {
                const { data } = await axios.get(`/api/stripe/checkout_sessions/${sessionId}`);
                setSessionData(data);
                shootFireworks();
                clearCart();
            } catch (err) {
                console.error('Error fetching session data:', err);
                setError('Une erreur est survenue lors de la récupération des données de commande');
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [sessionId, clearCart]);

    useEffect(() => {
        if (sessionData) {
            const redirectTimer = setTimeout(() => {
                router.push('/');
            }, 5000);

            return () => clearTimeout(redirectTimer);
        }
    }, [sessionData, router]);

    return (
        <div className="mx-auto px-6 py-12 xl:max-w-screen-xl text-center container">
            {error ? (
                <div className="bg-rose-100 mx-auto p-4 rounded-md max-w-md text-rose-500">
                    <p className="text-lg">Désolé, une erreur est survenue!</p>
                    <p className="mt-2 text-sm">{error}</p>
                </div>
            ) : loading ? (
                <div className="bg-gray-100 mx-auto p-4 rounded-md max-w-md text-gray-500">
                    <p className="text-lg animate-pulse">Chargement...</p>
                </div>
            ) : (
                <div className="bg-gray-100 mx-auto px-10 py-8 rounded-md max-w-lg">
                    <h2 className="flex flex-col items-center gap-4 font-semibold text-4xl">
                        <Check className="flex-shrink-0 w-12 h-12 text-green-600" />
                        <span>Merci pour votre commande!</span>
                    </h2>
                    <p className="mt-4 text-lg">Consultez votre boîte mail pour votre reçu.</p>
                    <p className="mt-6 text-gray-500 text-sm">
                        Vous serez redirigé vers la page d&apos;accueil dans quelques secondes...
                    </p>
                </div>
            )}
        </div>
    );
};

export default Success;