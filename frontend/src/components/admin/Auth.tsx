import { useState } from 'react';

export default function Auth({
  setAdminUnlocked,
}: {
  setAdminUnlocked: (unlocked: boolean) => void;
}) {
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">관리자 로그인</h2>
        <p className="text-sm text-gray-600 mb-4">
          관리자 페이지 접근을 위해 비밀번호를 입력해 주세요.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAuthError('');
            if (adminPassword.trim() === ADMIN_PASSWORD) {
              try {
                localStorage.setItem('isAdmin', '1');
              } catch (e) {
                // localStorage may be unavailable in some environments
                console.warn('Unable to persist admin flag to localStorage', e);
              }
              setAdminUnlocked(true);
            } else {
              setAuthError('비밀번호가 올바르지 않습니다.');
            }
          }}
        >
          <input
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="input-field w-full"
            placeholder="관리자 비밀번호"
            aria-label="관리자 비밀번호"
          />
          {authError && <p className="text-sm text-red-600 mt-2">{authError}</p>}
          <div className="mt-4 flex items-center justify-between">
            <button type="submit" className="btn-primary px-4 py-2">
              로그인
            </button>
            <button
              type="button"
              onClick={() => {
                setAdminPassword('');
                setAuthError('');
              }}
              className="text-sm text-gray-600"
            >
              초기화
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            주의: 이 인증 방식은 클라이언트 전용입니다. 민감한 데이터 보호에는 적합하지 않습니다.
          </p>
        </form>
      </div>
    </div>
  );
}
