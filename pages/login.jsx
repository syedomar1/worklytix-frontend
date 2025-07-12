import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar'; // ✅ Make sure this path is correct

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expectedRole, setExpectedRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (router.query.role) {
      setExpectedRole(decodeURIComponent(router.query.role));
    }
  }, [router.query.role]);

  const handleToast = (type, message) => {
    type === 'error' ? toast.error(message) : toast.success(message);
  };

  const verifyRoleAndRedirect = (userRole) => {
    if (expectedRole && userRole !== expectedRole) {
      handleToast('error', `Unauthorized: Your role is '${userRole}', expected '${expectedRole}'`);
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        handleToast('error', 'User record not found in database.');
        return;
      }

      const userData = userDoc.data();
      if (!verifyRoleAndRedirect(userData.role)) return;

      sessionStorage.setItem('email', email);
      sessionStorage.setItem('role', userData.role);
      localStorage.setItem('isLoggedIn', 'true');

      handleToast('success', `Welcome ${userData.role}!`);
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        handleToast('error', 'User does not exist.');
      } else if (err.code === 'auth/wrong-password') {
        handleToast('error', 'Wrong password. Try again.');
      } else {
        handleToast('error', 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const docRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(docRef);

      if (!userDoc.exists()) {
        handleToast('error', 'No account found. Please sign up first.');
        return;
      }

      const userData = userDoc.data();
      if (!verifyRoleAndRedirect(userData.role)) return;

      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('role', userData.role);
      localStorage.setItem('isLoggedIn', 'true');

      handleToast('success', `Logged in as ${userData.role}`);
      setTimeout(() => router.push('/'), 1500);
    } catch (err) {
      handleToast('error', err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5] px-4 pt-28 pb-10">
        <ToastContainer position="top-center" autoClose={3000} />
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full"
        >
          <h2 className="text-3xl font-extrabold text-center mb-6" style={{ color: '#0071ce', fontFamily: 'Arial' }}>
            Log In to Worklytix
          </h2>

          {expectedRole && (
            <p className="text-sm text-center mb-4 text-gray-600">
              You are logging in as: <span className="font-semibold">{expectedRole}</span>
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0071ce',
                  fontFamily: 'Arial',
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              />
            </div>
            <div className="relative">
              <label className="block text-gray-700">Password</label>
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: '#0071ce',
                  fontFamily: 'Arial',
                  color: '#000000',
                  backgroundColor: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-10 transform -translate-y-1/2"
              >
                {showPass ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0071ce] text-white rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600 text-sm relative">
            <span className="bg-white px-2 relative z-10">or</span>
            <div className="absolute w-full top-3 left-0 border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            <FcGoogle className="mr-2 text-2xl" />
            {loading ? 'Processing...' : 'Sign In with Google'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-medium text-[#0071ce] hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}