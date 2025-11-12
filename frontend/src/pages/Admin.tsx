import { useState, useEffect } from 'react';
// 유틸
// import { fetchSubmissionList, SubmissionRecord } from '../utils/api';
import { SubmissionRecord } from '../utils/api';
// 컴포넌트
import { AdminTable, PdfModal, Auth } from '../components/admin';

export default function Admin() {
  const [records, setRecords] = useState<SubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // PDF 모달 상태
  const [selectedPdf, setSelectedPdf] = useState<{
    url: string;
    title: string;
  } | null>(null);
  // 관리자 로그인 상태
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('isAdmin') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    loadRecords();
  }, []);

  // 더미 로드 함수
  const loadRecords = async () => {
    setIsLoading(true);
    setError('');

    try {
      // 실제 호출
      // const response = await fetchSubmissionList();
      // if (response.ok && response.data) {
      //   setRecords(response.data);
      // } else {
      //   setError(response.error || '데이터를 불러올 수 없습니다.');
      // }

      // 더미 데이터
      await new Promise((res) => setTimeout(res, 600));
      const now = new Date().toISOString();
      const dummy: SubmissionRecord[] = [
        {
          timestamp: now,
          name: '홍길동',
          email: 'hong@example.com',
          phone: '010-1234-5678',
          companyName: '한결 경영혁신센터',
          businessNumber: '123-45-67890',
          desiredSupport: '초기창업패키지',
          businessIdea: 'AI 기반 고객 상담 자동화 플랫폼',
          problemStatement: '중소기업의 고객응대 비용과 품질 편차 문제',
          developmentStage: '시제품 단계',
          pdfFileId: 'file_abc123',
          pdfViewUrl: 'https://example.com/sample.pdf',
          sendDueDate: '',
          sentFlag: false,
          sentAt: '',
          error: '',
        },
        {
          timestamp: now,
          name: '김창업',
          email: 'kim@example.com',
          phone: '010-9876-5432',
          companyName: '스타트업랩',
          businessNumber: '987-65-43210',
          desiredSupport: '기술개발·R&D',
          businessIdea: '저전력 IoT 센서 네트워크',
          problemStatement: '정밀 환경모니터링 비용 문제',
          developmentStage: '아이디어 단계',
          pdfFileId: 'file_def456',
          pdfViewUrl: '',
          sendDueDate: '',
          sentFlag: true,
          sentAt: now,
          error: '',
        },
      ];

      setRecords(dummy);
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('Load records error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPdf = (record: SubmissionRecord, _index: number) => {
    if (record.pdfViewUrl) {
      setSelectedPdf({
        url: record.pdfViewUrl,
        title: `${record.companyName || record.name} - 사업계획서 사전진단`,
      });
    }
  };

  // 통계 계산
  const stats = {
    total: records.length,
    sent: records.filter((r) => r.sentFlag).length,
    pending: records.filter((r) => !r.sentFlag).length,
  };

  if (!adminUnlocked) {
    return <Auth setAdminUnlocked={setAdminUnlocked} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* 헤역더 좌측 */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">관리자 대시보드</h1>
              <p className="text-sm text-gray-600 mt-1">사업계획서 사전진단 제출 현황</p>
            </div>
            {/* 헤더 우측 */}
            <button
              onClick={() => {
                // logout admin (client-side)
                try {
                  localStorage.removeItem('isAdmin');
                } catch (e) {
                  console.warn('Unable to remove admin flag from localStorage', e);
                }
                window.location.reload();
              }}
              className="ml-3 text-sm text-gray-600"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* 통계 카드 및 새로고침 버튼 */}
        <div className="flex items-start justify-between mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 제출</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">발송 완료</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">{stats.sent}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">발송 대기</p>
                  <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <div className="h-full flex items-center justify-center">
              <button
                onClick={() => loadRecords()}
                disabled={isLoading}
                className="flex items-center gap-2 p-10 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 disabled:opacity-50"
                aria-label="새로고침"
              >
                <svg
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''} text-white`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                새로고침
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                <p className="text-xs text-red-600 mt-2">
                  Google 계정으로 로그인되어 있는지, 관리자 권한이 있는지 확인해주세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 테이블 */}
        <div className="card">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="spinner mb-4"></div>
              <p className="text-gray-600">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <AdminTable records={records} onViewPdf={handleViewPdf} />
          )}
        </div>
      </main>

      {/* PDF 모달 */}
      {selectedPdf && (
        <PdfModal
          isOpen={!!selectedPdf}
          onClose={() => setSelectedPdf(null)}
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
        />
      )}
    </div>
  );
}
