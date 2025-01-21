import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useNavigate } from 'react-router-dom';

//Created by Michelle and Tyson
//With help from Chat-GPT to fine tune the Tailwind CSS
//This is a standard Sign in page allowing for only verified users to access the webpage or redirecting to the forgot password page


function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/ManagerDashboard');
    } catch (err) {
      setError(err.message);
    }
  };
  const ToForgotPassword = ()=>{
    try {
      navigate('/ForgotPassword');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white p-7 rounded-2xl shadow-lg w-80" onSubmit={handleLogin}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="text-shift-blue text-bold p-2 rounded text-[#847A7A] hover:text-[#373333] w-full text-right"
          onClick={ToForgotPassword}
        >
          forgot password
        </button>
        <button
          type="submit"
          className="w-full bg-main-blue text-white font-bold p-2 rounded hover:bg-hover-blue"
        >
          Login
        </button>
        {/*<button
          type="submit"
          className="w-full bg-green-500 text-shift-blue text-bold p-2 rounded hover:bg-green-600"
        >
          (Manager)
        </button>*/}

      </form>
    </div>
  );
}

export default SignIn;


