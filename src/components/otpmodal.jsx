"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiX, FiRotateCw, FiShield } from "react-icons/fi";

function OtpModal({ email, name, password, onClose }) {
  const router = useRouter();

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isVerifyingAndRedirecting, setIsVerifyingAndRedirecting] =
    useState(false);

  const inputRefs = useRef([]);

  const enteredOtp = otp.join("");

  // countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;

    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // paste OTP
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 4);

    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    newOtp.forEach((digit, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = digit;
      }
    });
  };

  // resend OTP
  const resendOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/emailVerification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      setTimeLeft(120);
      setMessage("OTP resent successfully");
      setMsgType("success");
    } catch (error) {
      setMessage(error.message);
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  // verify OTP
  const verifyOTP = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/auth/emailVerification", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp: enteredOtp,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        setMsgType("error");
        return;
      }

      // OTP verified
      await createAccount();
    } catch (error) {
      setMessage("Verification failed");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  // create account after OTP verification
  const createAccount = async () => {
    try {
      setIsVerifyingAndRedirecting(true);

      const res = await fetch("/api/auth/Signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsVerifyingAndRedirecting(false);
        setMessage(data.error);
        setMsgType("error");
        return;
      }

      localStorage.setItem("token", data.token);
      console.log("Account created and logged in successfully", data.token);
      alert("Account created successfully!");

    //   setTimeout(() => {
    //     router.push("/connect");
    //   }, 1500);
    } catch (error) {
      setIsVerifyingAndRedirecting(false);
      setMessage("Account creation failed");
      setMsgType("error");
      console.error("Error creating account:", error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-60 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* background */}
        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-lg"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="relative bg-[#0C0C2A] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            {/* header */}
            <div className="relative p-6 pb-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-gray-300 hover:text-white"
              >
                <FiX />
              </motion.button>

              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {isVerifyingAndRedirecting
                    ? "Processing..."
                    : "Verify Your Email"}
                </h2>

                <p className="text-gray-400 text-sm">
                  Enter the 4-digit code sent to
                </p>

                <p className="text-[#E9164B] font-semibold">{email}</p>
              </div>
            </div>

            {!isVerifyingAndRedirecting && (
              <div className="px-6 pb-6">
                {/* OTP boxes */}
                <div className="flex justify-center space-x-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-14 h-14 text-center text-xl font-bold bg-[#0C0C2A] border border-gray-300 rounded-xl"
                    />
                  ))}
                </div>

                {/* timer */}
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-400">
                    {timeLeft > 0
                      ? `Code expires in ${formatTime(timeLeft)}`
                      : "OTP expired"}
                  </p>

                  <button
                    onClick={resendOTP}
                    disabled={timeLeft > 0}
                    className="text-[#E9164B] text-sm mt-2 flex items-center justify-center mx-auto"
                  >
                    <FiRotateCw className="mr-2" />
                    Resend OTP
                  </button>
                </div>

                {/* message */}
                {message && (
                  <p
                    className={`text-center text-sm mb-4 ${
                      msgType === "error"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {message}
                  </p>
                )}

                {/* verify button */}
                <motion.button
                  onClick={verifyOTP}
                  disabled={loading || enteredOtp.length !== 4}
                  className="w-full py-3 rounded-xl bg-[#E9164B] text-white font-semibold"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </motion.button>

                <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
                  <FiShield className="mr-2 text-[#E9164B]" />
                  Secure OTP Verification
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OtpModal;























