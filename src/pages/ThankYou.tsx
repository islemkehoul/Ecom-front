import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Package, MapPin, Phone, User, CreditCard } from 'lucide-react';

interface OrderData {
    orderId?: string;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerRegion?: string;
    productName: string;
    productImage?: string;
    variantSize: string;
    variantColor: string;
    price: string;
    orderDate: string;
}

const ThankYou = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state as OrderData;

    useEffect(() => {
        // If no order data, redirect to home
        if (!orderData) {
            navigate('/');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Success Animation Header */}
                <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-success/10 rounded-full mb-6 animate-in zoom-in duration-500 delay-200">
                        <CheckCircle className="w-16 h-16 text-success animate-in zoom-in duration-300 delay-500" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                        {t('thank_you.title')}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t('thank_you.subtitle')}
                    </p>
                </div>

                {/* Order Details Card */}
                <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-6 text-primary-foreground">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="text-sm opacity-90 mb-1">{t('thank_you.order_number')}</p>
                                <p className="text-2xl font-bold">#{orderData.orderId || 'PENDING'}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-90 mb-1">{t('thank_you.order_date')}</p>
                                <p className="text-lg font-semibold">{orderData.orderDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary" />
                            {t('thank_you.product_details')}
                        </h2>
                        <div className="flex gap-4 items-start">
                            {orderData.productImage && (
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                                    <img
                                        src={orderData.productImage}
                                        alt={orderData.productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-foreground mb-2">{orderData.productName}</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">{t('product_details.size')}:</span>
                                        <span className="ml-2 font-semibold text-foreground">{orderData.variantSize}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">{t('product_details.color')}:</span>
                                        <span className="ml-2 font-semibold text-foreground">{orderData.variantColor}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground mb-1">{t('thank_you.total_price')}</p>
                                <p className="text-3xl font-bold text-primary">{orderData.price} DZD</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            {t('thank_you.customer_info')}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                <User className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{t('product_details.full_name')}</p>
                                    <p className="font-semibold text-foreground">{orderData.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                <Phone className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{t('product_details.phone_number')}</p>
                                    <p className="font-semibold text-foreground">{orderData.customerPhone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">{t('product_details.wilaya')}</p>
                                    <p className="font-semibold text-foreground">{orderData.customerCity}</p>
                                </div>
                            </div>
                            {orderData.customerRegion && (
                                <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">{t('product_details.region')}</p>
                                        <p className="font-semibold text-foreground">{orderData.customerRegion}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="p-6 bg-muted/20 border-t border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <h2 className="text-xl font-bold text-foreground">{t('thank_you.payment_method')}</h2>
                        </div>
                        <div className="bg-card p-4 rounded-lg border border-border">
                            <p className="text-foreground font-semibold">{t('thank_you.cash_on_delivery')}</p>
                            <p className="text-sm text-muted-foreground mt-1">{t('thank_you.payment_note')}</p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                    <h3 className="text-lg font-bold text-foreground mb-3">{t('thank_you.what_next')}</h3>
                    <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">✓</span>
                            <span>{t('thank_you.step_1')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">✓</span>
                            <span>{t('thank_you.step_2')}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-accent mt-1">✓</span>
                            <span>{t('thank_you.step_3')}</span>
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
                    <Link
                        to="/products"
                        className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        {t('thank_you.continue_shopping')}
                    </Link>
                    <Link
                        to="/"
                        className="px-8 py-4 bg-card hover:bg-muted text-foreground border-2 border-border rounded-xl font-bold text-center transition-all duration-200 transform hover:scale-105"
                    >
                        {t('thank_you.back_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
