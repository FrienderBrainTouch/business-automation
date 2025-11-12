interface SuccessMessageProps {
  email: string;
  pdfViewUrl?: string;
}

export default function SuccessMessage({ email, pdfViewUrl }: SuccessMessageProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="card text-center">
        <div className="mb-6">
          <svg
            className="w-20 h-20 mx-auto text-green-500"
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

        <h2 className="text-2xl font-bold text-gray-800 mb-4">제출이 완료되었습니다!</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <p className="text-lg text-gray-700 mb-2">제출 감사합니다.</p>
          <p className="text-lg font-semibold text-blue-700">
            내일 오후 2시에 <span className="underline">{email}</span>로<br />
            사업계획서 초안을 보내드릴게요.
          </p>
        </div>

        <div className="text-sm text-gray-600 space-y-2 mb-6">
          <p>📧 이메일이 도착하지 않으면 스팸함을 확인해주세요.</p>
          <p>💡 더 자세한 컨설팅이 필요하시면 아래로 문의해주세요.</p>
        </div>

        <a href="mailto:contact@hangyeol-center.com" className="inline-block btn-primary">
          한결 경영혁신센터 문의하기
        </a>
      </div>

      {/* PDF 미리보기 (선택적) */}
      {pdfViewUrl && (
        <div className="card mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">생성된 문서 미리보기</h3>
          <div className="relative w-full" style={{ paddingBottom: '141.4%' }}>
            <iframe
              src={pdfViewUrl}
              className="absolute top-0 left-0 w-full h-full border border-gray-300 rounded"
              title="PDF 미리보기"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={pdfViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              새 창에서 보기
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
