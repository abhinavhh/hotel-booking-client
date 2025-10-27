import { useState } from "react";
import api from "../../../lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  bookingId?: string;
  onSuccess: (response: any) => void;
  onFailure?: (error: any) => void;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
      document.body.appendChild(script);
    });
  };

  const initiatePayment = async (options: PaymentOptions) => {
    try {
      setIsProcessing(true);

      // Create order from backend
      const response = await api.post("/payment/create-order", {
        amountRupees: options.amount,
        bookingId: options.bookingId,
      });

      const order = response.data;

      // Load Razorpay script
      await loadRazorpayScript();

      // Razorpay options
      const razorpayOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RT0KOt1Gk77tvT",
        amount: order.amount,
        currency: order.currency,
        name: "Hotel Booking",
        description: "Hotel Room Booking Payment",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post("/payment/verify", {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId: options.bookingId,
            });

            if (verifyResponse.data.success) {
              options.onSuccess(response);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            console.error("Payment verification error:", err);
            if (options.onFailure) {
              options.onFailure(err);
            }
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            console.log("Payment cancelled by user");
          },
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3B82F6",
        },
      };

      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment failed:", response.error);
        if (options.onFailure) {
          options.onFailure(response.error);
        }
        setIsProcessing(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      if (options.onFailure) {
        options.onFailure(error);
      }
      setIsProcessing(false);
      throw error;
    }
  };

  return {
    initiatePayment,
    isProcessing,
  };
};