'use client';

import authStore from '../../zustand/store';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const setAuth = authStore((state) => state.setAuth);
  const router = useRouter();

  const handleSignOut = () => {
    setAuth({
      token: null,
      email: null,
      id: null,
    });
    router.push('/'); 
  };

  return (
    <div className="p-4">
      <h1 className="text-black text-xl mb-4">Profile</h1>
      <button onClick={handleSignOut} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
}
