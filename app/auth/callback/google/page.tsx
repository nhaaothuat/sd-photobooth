import { useEffect } from 'react';
import { useRouter } from 'next/router';

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      // Gửi mã code tới backend để trao đổi lấy token
      fetch('/api/auth/callback/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Token received:', data);
          // Bạn có thể lưu token hoặc xử lý thông tin người dùng ở đây
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [router.query]);

  return (
    <div>
      <h1>Google Callback</h1>
      <p>Đang xử lý...</p>
    </div>
  );
};

export default GoogleCallback;