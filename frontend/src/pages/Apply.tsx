import { useState } from 'react';
import { ApplyForm, SuccessMessage } from '../components/user';
import { ApplicationData } from '../components/types/dto';
// import { submitApplication, ApplicationData } from '../utils/api';

export default function Apply() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState('');

  // 더미 API
  const handleSubmit = async (data: ApplicationData) => {
    setIsSubmitting(true);
    setError('');
    try {
      await new Promise((res) => setTimeout(res, 800));
      const statusCode = 200;

      if (statusCode === 200) {
        setIsSubmitted(true);
        setSubmittedEmail(data.email);
      } else {
        setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
      console.error('Submit simulation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 실제 API
  // const handleSubmit = async (data: ApplicationData) => {
  //   setIsSubmitting(true);
  //   setError('');

  //   try {
  //     const response = await submitApplication(data);

  //     if (response.ok && response.data) {
  //       setIsSubmitted(true);
  //       setSubmittedEmail(data.email);
  //       setPdfViewUrl(response.data.pdfViewUrl || '');
  //     } else {
  //       setError(response.error || '제출 중 오류가 발생했습니다. 다시 시도해주세요.');
  //     }
  //   } catch (err) {
  //     setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
  //     console.error('Submit error:', err);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            하니 플랜 (HANI Plan)
          </h1>
          <p className="text-lg text-gray-600">사업계획서 사전진단 신청</p>
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
                <h3 className="text-sm font-medium text-red-800">오류가 발생했습니다.</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 메인 컨텐츠 */}
        {!isSubmitted ? (
          <>
            <div className="card mb-6">
              <div className="prose max-w-none">
                <p className="text-gray-700">안녕하십니까, 한결 경영혁신센터입니다.</p>
                <p className="text-gray-700">
                  본 설문은 귀사의 사업 아이템과 계획을 분석하여 <strong>사전 진단 보고서</strong>를
                  생성합니다.
                </p>
                <ul className="text-gray-700 list-disc pl-5 space-y-1">
                  <li>
                    <strong>다음날 오후 2시</strong>에 입력하신 이메일로 발송됩니다.
                  </li>
                  <li>더 자세한 컨설팅이 필요하시면 문의해 주세요.</li>
                </ul>
              </div>
            </div>

            <ApplyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </>
        ) : (
          <SuccessMessage email={submittedEmail} />
        )}
      </div>
    </div>
  );
}
