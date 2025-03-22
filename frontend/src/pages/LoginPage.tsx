import React, { useCallback, useState } from 'react';
import Box from '../componets/Box';
import Logo from '../componets/Logo';
import axios from 'axios';
import MultiToggle from '../componets/MultiTiggle';
import { useNavigate } from 'react-router-dom';
import { userIdStore } from '../stores/userIdStore';

interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = ({}) => {
  const hostname = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [learnWeb3Url, setLearnWeb3Url] = useState('');
  const [activeOption, setActiveOption] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');

  const navigate = useNavigate();

  const setUserId = userIdStore((state) => state.setUserId);

  const handleRegister = useCallback(() => {
    setRegisterError('');
    if (!email || !password || !firstName || !lastName || !walletAddress || !learnWeb3Url) {
      setRegisterError("All fields are required!");
      return;
    }
    const data = {
      email,
      password,
      firstName,
      lastName,
      walletAddress,
      learnWeb3url: learnWeb3Url,
    };

    axios
      .post(`api/auth/register`, data)
      .then((response) => {
        const id = response.data.user.id;
        setUserId(id);
        navigate("/dashboard", { state: { user_id: id } });
      })
      .catch((error) => {
        console.log(error, error.response);
      });
  }, [email, password, firstName, lastName, walletAddress, learnWeb3Url]);

  const handleLogin = useCallback(() => {
    setLoginError('');
    if (!loginEmail || !loginPassword) {
      setLoginError("All fields are required!");
      return;
    }
    const data = {
      email: loginEmail,
      password: loginPassword,
    };
    axios
      .post(`api/auth/login`, data)
      .then((response) => {
        const id = response.data.user.id;
        setUserId(id);
        navigate("/dashboard", { state: { user_id: id } });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [loginEmail, loginPassword]);

  const handleClickGuest = useCallback(() => {
    const data = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      walletAddress: '',
      learnWeb3url: "",
      mock: true
    };
    axios
      .post(`api/auth/register`, data)
      .then((response) => {
        const id = response.data.user.id;
        setUserId(id);
        navigate("/dashboard", { state: { user_id: id } });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClickMetamask = useCallback(() => {
    const ethereum = (window as any).ethereum;
    async function connectMetaMask() {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const balance = await ethereum.request({ method: 'eth_getBalance', params: [accounts[0], 'latest'] });

      if (accounts) {
        setWalletAddress(accounts[0]);
        setActiveOption('register');
      }
    }
    if (ethereum) {
      try {
        connectMetaMask();
      } catch (error) {
        console.error("Error: ", error);
      }
    } else {
      console.error("Please install MetaMask!");
    }
  }, []);

  return (
    <div className="">
      <div className="h-screen flex flex-col gap-8 items-center justify-center">
        <div className="flex flex-col gap-2 w-full items-center">
          <div onClick={handleClickMetamask} className="flex flex-row gap-2 bg-[#FF7423] text-white p-2 rounded-md w-72 text-center cursor-pointer items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 142 137"  width="30" height="30">
              <path fill="#0A0A0A" d="m131.215 130.727-29.976-8.883-22.604 13.449H62.861l-22.619-13.449-29.96 8.883-9.11-30.63 9.117-33.992-9.117-28.742 9.11-35.618 46.817 27.847h27.298l46.818-27.847 9.117 35.618-9.117 28.742 9.117 33.992-9.117 30.63Z"/>
              <path fill="#89B0FF" d="m138.828 101.219-8.364 28.103-28.088-8.335-2.257-.669-3.219-.956-13.78-4.092-1.204.158-.466 1.7 17.015 5.048-20.145 11.99H63.193l-20.144-11.99 17.008-5.04-.467-1.708-1.196-.158-17.007 5.048-2.257.669-28.08 8.335-8.365-28.103L0 100.121l9.53 32.006 30.57-9.079 22.469 13.374h16.376l22.468-13.374 30.57 9.079 9.523-32.006-2.678 1.098Z"/>
              <path fill="#D075FF" d="M39.13 101.218v19.768l2.257-.669v-17.948l17.007 12.9 1.196.158 1.113-1.241-20.076-15.225H2.647l8.508-31.728-2.038-1.106L0 100.12l2.685 1.098H39.13Zm70.128-17.827-7.221 1.783v2.332l10.636-2.633.068-17.64h-1.497l-.76-.518-.06 14.66-8.718-8.229H83.615l-.346 2.264h17.542l8.447 7.981Z"/>
              <path fill="#D075FF" d="M39.475 87.506v-2.332l-7.222-1.783 8.448-7.98h17.534l-.346-2.265H40.242l-.775.309-8.38 7.92-.06-14.66-.76.519h-1.504l.068 17.64 10.644 2.632Zm90.877-20.273 8.508 31.728h-37.979l-20.077 15.225 1.114 1.241 1.203-.158 17-12.9v17.948l2.257.669v-19.768h36.452l2.678-1.098-9.11-33.993-2.046 1.106Z"/>
              <path fill="#FF5C16" d="M28.765 67.233h1.504l.76-.52 23.386-16.021 3.483 22.46.346 2.265 5.491 35.422 1.956-.79h.203l-9.508-61.35 1.752-17.971h25.237L85.12 48.72l-9.508 61.328h.204l1.955.79 5.491-35.422.346-2.264h.008l3.483-22.461 23.378 16.022.76.526h19.114l2.038-1.105 9.11-28.735L131.938 0 84.12 28.464H57.394L9.568 0 0 37.4l9.11 28.735 2.038 1.105h17.61l.007-.007Zm110.394-29.9-8.77 27.643h-18.422l-23.973-16.42 42.635-44.562 8.53 33.338ZM124.672 6.957 87.152 46.17l-1.558-15.955 39.078-23.258Zm-68.76 23.25-1.55 15.963-37.52-39.22 39.07 23.25v.008ZM2.347 37.333l8.53-33.338 42.635 44.561-23.972 16.42H11.118L2.347 37.332Z"/>
              <path fill="#BAF24A" d="M77.07 110.049H64.442l-4.852 5.379 2.415 8.808h17.489l2.415-8.808-4.852-5.379h.015Zm.7 11.93H63.75l-1.64-5.972 3.317-3.679h10.666l3.317 3.679-1.64 5.972ZM58.26 90.807l-.211-.55v-.014l-3.739-9.689H44.2l-4.723 4.619v2.324l16.676 4.122 2.106-.812Zm-13.142-7.989h7.643l2.4 6.214-13.104-3.235 3.054-2.978h.007Zm40.228 8.802 16.677-4.121v-2.325l-4.724-4.61h-10.11l-3.738 9.68v.015l-.211.55 2.106.812Zm14.09-5.822-13.104 3.235 2.4-6.22h7.642l3.054 2.986h.007Z"/>
            </svg>
            Sign in with Metamask
          </div>
        </div>
        <Box
          children={
            <div className="flex flex-col gap-6">
              <div className="text-xl flex justify-between">
                {activeOption === 'register' ? 'Register' : 'Login'}
                <Logo />
              </div>
              <div className="">
                <MultiToggle
                  options={[
                    { value: 'login', title: 'Login' },
                    { value: 'register', title: 'Register' },
                  ]}
                  activeOption={activeOption}
                  handleChange={setActiveOption}
                />
              </div>
              {activeOption === 'register' && (
                <div className="flex flex-col gap-4 w-[436px]">
                  <div className="flex flex-row gap-2">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border border-purple rounded p-2 bg-[#2C3039] w-full"
                      placeholder="First Name"
                      required
                    />
                    <input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="border border-purple rounded p-2 bg-[#2C3039] w-full"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Email"
                    required
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Password"
                    required
                  />
                  <input
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Wallet Address"
                    required
                  />
                  <input
                    value={learnWeb3Url}
                    onChange={(e) => setLearnWeb3Url(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="LearnWeb3 Profile URL"
                    required
                  />
                  <button
                    onClick={handleRegister}
                    className="bg-purple text-white p-2 rounded-md"
                  >
                    Register
                  </button>
                  {registerError && (
                    <div className="text-red-500 text-sm mt-2">
                      {registerError}
                    </div>
                  )}
                </div>
              )}
              {activeOption === 'login' && (
                <div className="flex flex-col gap-4 w-[436px]">
                  <input
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Email"
                  />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border border-purple rounded p-2 bg-[#2C3039]"
                    placeholder="Password"
                  />
                  <button
                    onClick={handleLogin}
                    className="bg-purple text-white p-2 rounded-md"
                  >
                    Login
                  </button>
                  {loginError && (
                    <div className="text-red-500 text-sm">
                      {loginError}
                    </div>
                  )}
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default LoginPage;