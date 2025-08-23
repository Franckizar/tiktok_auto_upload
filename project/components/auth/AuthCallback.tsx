// // pages/auth/callback.tsx or app/auth/callback/page.tsx
// 'use client';

// import { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// export default function AuthCallback() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const code = searchParams.get('code');
//     const state = searchParams.get('state');

//     if (code) {
//       // Handle the callback
//       handleTikTokCallback(code, state);
//     } else {
//       // Handle error
//       router.push('/auth/login?error=auth_failed');
//     }
//   }, [searchParams, router]);

//   const handleTikTokCallback = async (code: string, state: string | null) => {
//     try {
//       const response = await fetch(`http://localhost:8080/auth/tiktok/callback?code=${code}&state=${state || ''}`);
      
//       if (response.ok) {
//         const data = await response.json();
//         localStorage.setItem('token', data.token);
//         router.push('/dashboard');
//       } else {
//         router.push('/auth/login?error=tiktok_auth_failed');
//       }
//     } catch (error) {
//       router.push('/auth/login?error=tiktok_auth_failed');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="text-center">
//         <h2 className="text-xl font-semibold mb-4">Authenticating with TikTok...</h2>
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
//       </div>
//     </div>
//   );
// }