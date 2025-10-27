import React from "react";
// import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { usePayment } from "../hooks/usePayment";
import { Button } from "../../../components/ui/Button";

interface PaymentButtonProps {
  amount: number;
  bookingId?: string;
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
  disabled?: boolean;
  className?: string;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  bookingId,
  onSuccess,
  onFailure,
  disabled = false,
  className = "",
}) => {
  const { initiatePayment, isProcessing } = usePayment();

  const handlePayment = async () => {
    try {
      await initiatePayment({
        amount,
        bookingId,
        onSuccess,
        onFailure,
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handlePayment}
      disabled={disabled || isProcessing}
      isLoading={isProcessing}
      icon={!isProcessing && <CreditCard className="w-5 h-5" />}
      className={`w-full ${className}`}
    >
      {isProcessing
        ? "Processing Payment..."
        : `Pay ₹${amount.toLocaleString()}`}
    </Button>
  );
};
