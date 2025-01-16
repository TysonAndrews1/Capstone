import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword(){
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
const cancel = ()=>{
    try {
        navigate('/');
      } catch (err) {
        setError(err.message);
      }
}

    const handleRequest = async (e) => {
      e.preventDefault();
      setError('');
      try {
        alert('Request Email Sent');
      } catch (err) {
        setError(err.message);
      }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <form className="bg-white p-7 rounded-2xl shadow-lg w-80" onSubmit={handleRequest}>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
            <input
              type="email"
              placeholder="Registered Email"
              className="w-full mb-4 p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required>

              </input>

            <button
              type="submit"
              className="w-half bg-[#457B9D] text-shift-blue text-bold p-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
            <button
              type="button"
              className="w-half bg-[#457B9D] text-shift-blue text-bold p-2 rounded hover:bg-green-600"
              onClick={cancel}
            >
              Go Back
            </button>
          </form>
        </div>
      );
}