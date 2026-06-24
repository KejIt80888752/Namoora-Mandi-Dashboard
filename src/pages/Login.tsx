import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, ShoppingBasket, MapPin, AlertTriangle } from "lucide-react";
import { useApp } from "../contexts/AppContext";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = users.find((u) => u.mobile === mobile.trim());
    if (found) {
      setCurrentUser(found);
      navigate("/dashboard");
    } else {
      setError("Mobile number not registered. Contact admin.");
    }
  };

  return (
    <div className="min-h-screen bg-army-800 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-army-700 border-2 border-army-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <ShoppingBasket size={38} className="text-army-200" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-widest uppercase">Namoora Mandi</h1>
          <p className="text-army-300 text-sm mt-1.5 font-medium">by Krishna Kaveri</p>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-army-400 text-xs">
            <MapPin size={11} />
            <span>No 80/3, Mandi No. 1083, Bengaluru - 560075</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back</h2>
          <p className="text-sm text-gray-400 mb-5">Enter your mobile number to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${
                mobile.length > 0 ? "border-army-500" : "border-gray-200"
              } focus-within:border-army-600`}>
                <div className="flex items-center gap-1.5 px-3 py-3 bg-army-50 border-r-2 border-gray-200">
                  <Phone size={14} className="text-army-600" />
                  <span className="text-sm text-army-700 font-bold">+91</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  placeholder="10-digit number"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  className="flex-1 px-3 py-3 text-base font-semibold outline-none bg-white tracking-widest text-gray-800"
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500">
                  <AlertTriangle size={12} />
                  <p className="text-xs">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={mobile.length !== 10}
              className="w-full bg-army-700 hover:bg-army-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide shadow-sm"
            >
              {mobile.length === 10 ? "Login" : "Enter 10-digit number"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-6 text-army-400 text-xs">
          <Phone size={11} />
          <span>+91 95138 03912</span>
        </div>
      </div>
    </div>
  );
}
