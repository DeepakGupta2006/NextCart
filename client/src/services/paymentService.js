import api from "./api";

// Asks our backend to create a Razorpay order sized to the current cart total.
export const createRazorpayOrder = async () =>
  (await api.post("/payment/razorpay/order")).data.data;

// Loads Razorpay's checkout script once and caches the promise so repeat
// checkouts don't re-fetch it.
let razorpayScriptPromise;
export const loadRazorpayScript = () => {
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Could not load the Razorpay checkout script"));
    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};