import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { ToastContainer, toast } from 'react-toastify';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleToast = (type, message) => {
    type === 'error' ? toast.error(message) : toast.success(message);
  };

  const saveUserToFirestore = async (user, role = '') => {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role,
      createdAt: new Date(),
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return handleToast('error', 'Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await saveUserToFirestore(user);
      sessionStorage.setItem('email', email);
      localStorage.setItem('isLoggedIn', 'true');

      handleToast('success', 'Account created successfully!');
      router.push('/');
    } catch (err) {
      handleToast('error', err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await saveUserToFirestore(user);
      sessionStorage.setItem('email', user.email);
      localStorage.setItem('isLoggedIn', 'true');

      handleToast('success', 'Google sign-up successful!');
      router.push('/');
    } catch (err) {
      handleToast('error', err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <ToastContainer position="top-center" autoClose={3000} />
      <motion.div
        className="bg-white rounded-xl shadow-xl p-10 max-w-lg w-full"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#0071ce', fontFamily: 'Arial' }}>
          Sign Up to Worklytix
        </h2>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#0071ce', fontFamily: 'Arial' }}
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#0071ce', fontFamily: 'Arial' }}
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#0071ce', fontFamily: 'Arial' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0071ce] hover:bg-blue-800 text-white rounded-lg font-semibold transition-all"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600 text-sm relative">
          <span className="bg-white px-2 relative z-10">or</span>
          <div className="absolute w-full top-3 left-0 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle className="mr-2 text-2xl" />
          {loading ? 'Processing...' : 'Sign Up with Google'}
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-[#0071ce] hover:underline">
            Log In
          </a>
        </p>
      </motion.div>
    </div>
  );
}
