import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Leaf } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo Card */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🧺</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">NAMOORA MANDI</h1>
          <p className="text-green-100 text-sm mt-1 flex items-center justify-center gap-1.5">
            <Leaf size={13} />
            by Krishna Kaveri
          </p>
          <p className="text-green-200 text-xs mt-1">No 80/3, Mandi No. 1083, Bengaluru - 560075</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Welcome Back 👋</h2>
          <p className="text-sm text-gray-400 mb-5">Enter your mobile number to continue</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
              <div className={`flex items-center border-2 rounded-xl overflow-hidden transition-colors ${mobile.length > 0 ? "border-green-400" : "border-gray-200"} focus-within:border-green-500`}>
                <div className="flex items-center gap-1.5 px-3 py-3 bg-green-50 border-r-2 border-gray-200">
                  <Phone size={14} className="text-green-600" />
                  <span className="text-sm text-green-700 font-bold">+91</span>
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
                  className="flex-1 px-3 py-3 text-base font-medium outline-none bg-white tracking-widest"
                  required
                />
              </div>
              {error && (
                <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mobile.length !== 10}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide shadow-sm hover:shadow-md"
            >
              {mobile.length === 10 ? "Login →" : "Enter 10-digit number"}
            </button>
          </form>
        </div>

        <p className="text-center text-green-200 text-xs mt-5">
          📞 +91 95138 03912 · Bengaluru - 560075
        </p>
      </div>
    </div>
  );
}
