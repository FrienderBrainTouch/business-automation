import { useState, FormEvent } from 'react';
import { ApplicationData } from '../../utils/api';

interface ApplyFormProps {
  onSubmit: (data: ApplicationData) => Promise<void>;
  isSubmitting: boolean;
}

export default function ApplyForm({ onSubmit, isSubmitting }: ApplyFormProps) {
  const [formData, setFormData] = useState<ApplicationData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    businessNumber: '',
    desiredSupport: '',
    businessIdea: '',
    problemStatement: '',
    developmentStage: '',
    targetMarket: '',
    customerAndValue: '',
    competitiveness: '',
    goals: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기업 정보 섹션 */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">기업 정보</h2>

        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="companyName">
              회사명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              className="input-field"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="예: 한결 경영혁신센터"
            />
          </div>

          <div>
            <label className="label" htmlFor="name">
              대표자 성명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 홍길동"
            />
          </div>

          {/* <div>
            <label className="label" htmlFor="businessNumber">
              사업자 등록번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="businessNumber"
              name="businessNumber"
              required
              className="input-field"
              value={formData.businessNumber}
              onChange={handleChange}
              placeholder="123-45-67890"
              pattern="[0-9]{3}-[0-9]{2}-[0-9]{5}"
            />
            <p className="text-xs text-gray-500 mt-1">형식: 000-00-00000</p>
          </div> */}

          <div>
            <label className="label" htmlFor="email">
              이메일 <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@company.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              다음날 오후 2시에 작성하신 이메일로 사업계획서 초안을 보내드립니다.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="phone">
              연락처 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="input-field"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              pattern="[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}"
            />
            <p className="text-xs text-gray-500 mt-1">형식: 010-0000-0000</p>
          </div>

          <div>
            <label className="label" htmlFor="desiredSupport">
              희망 지원과제 <span className="text-red-500">*</span>
            </label>
            <select
              id="desiredSupport"
              name="desiredSupport"
              required
              className="input-field"
              value={formData.desiredSupport}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="예비창업패키지">예비창업패키지</option>
              <option value="초기창업패키지">초기창업패키지</option>
              <option value="창업도약패키지">창업도약패키지</option>
              <option value="청년창업사관학교">청년창업사관학교</option>
              <option value="기술개발·R&D">기술개발·R&D</option>
              <option value="데이터 바우처 지원사업">데이터 바우처 지원사업</option>
              <option value="수출 바우처 지원사업">수출 바우처 지원사업</option>
              <option value="제조혁신 바우처 지원사업">제조혁신 바우처 지원사업</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </div>
      </div>

      {/* 사업 계획 섹션 */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">사업 계획</h2>

        <div className="space-y-4">
          <div>
            <label className="label" htmlFor="businessIdea">
              사업의 핵심 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="businessIdea"
              name="businessIdea"
              required
              rows={6}
              className="input-field resize-none"
              value={formData.businessIdea}
              onChange={handleChange}
              placeholder="현재 진행 중이거나 추진하려는 사업의 핵심을 간결하고 구체적으로 적어 주세요. (핵심 기능/서비스 및 제공하는 가치)"
              minLength={100}
            />
            <p className="text-xs text-gray-500 mt-1">
              현재: {formData.businessIdea.length}자/100자
            </p>
          </div>

          <div>
            <label className="label" htmlFor="problemStatement">
              해결하려는 문제 / 사회적·기술적 필요성 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="problemStatement"
              name="problemStatement"
              required
              rows={4}
              className="input-field resize-none"
              value={formData.problemStatement}
              onChange={handleChange}
              placeholder="이 사업이 해결하고자 하는 문제는 무엇인가요? (누가, 어떤 불편을 겪고 있는지, 기존 솔루션의 한계 등)"
              minLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              현재: {formData.problemStatement.length}자/50자
            </p>
          </div>

          <div>
            <label className="label" htmlFor="developmentStage">
              현재 개발 단계 <span className="text-red-500">*</span>
            </label>
            <select
              id="developmentStage"
              name="developmentStage"
              required
              className="input-field"
              value={formData.developmentStage}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              <option value="아이디어 단계">아이디어 단계</option>
              <option value="시제품 단계">시제품 단계</option>
              <option value="서비스 운영 중">서비스 운영 중</option>
              <option value="매출 발생 중">매출 발생 중</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              현재 단계에 가장 가까운 항목을 선택해 주세요.
            </p>
          </div>

          <div>
            <label className="label" htmlFor="customerAndValue">
              주요 고객 및 제공 가치 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="customerAndValue"
              name="customerAndValue"
              required
              rows={4}
              className="input-field resize-none"
              value={formData.customerAndValue}
              onChange={handleChange}
              placeholder="주요 고객(또는 사용자)은 누구이며, 귀사가 제공하는 핵심 가치는 무엇인가요?"
              minLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              현재: {formData.customerAndValue.length}자/50자
            </p>
          </div>

          <div>
            <label className="label" htmlFor="goals">
              지원을 통해 달성하고 싶은 목표 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="goals"
              name="goals"
              required
              rows={4}
              className="input-field resize-none"
              value={formData.goals}
              onChange={handleChange}
              placeholder="지원 과제를 통해 구체적으로 달성하고 싶은 목표(성과지표, 기간, 기대효과 등)를 적어 주세요."
              minLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">현재: {formData.goals.length}자/50자</p>
          </div>

          {/* <div>
            <label className="label" htmlFor="targetMarket">
              목표 시장 및 고객층 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="targetMarket"
              name="targetMarket"
              required
              rows={4}
              className="input-field resize-none"
              value={formData.targetMarket}
              onChange={handleChange}
              placeholder="목표로 하는 시장과 고객층에 대해 설명해 주세요."
              minLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              현재: {formData.targetMarket.length}자/50자
            </p>
          </div>

          <div>
            <label className="label" htmlFor="competitiveness">
              경쟁력 및 차별성 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="competitiveness"
              name="competitiveness"
              required
              rows={4}
              className="input-field resize-none"
              value={formData.competitiveness}
              onChange={handleChange}
              placeholder="기존 경쟁사 대비 귀사의 경쟁력과 차별점을 설명해 주세요."
              minLength={50}
            />
            <p className="text-xs text-gray-500 mt-1">
              현재: {formData.competitiveness.length}자/50자
            </p>
          </div> */}
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-12 py-3 text-lg font-semibold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="spinner w-5 h-5 border-2"></div>
              처리 중...
            </span>
          ) : (
            '제출하기'
          )}
        </button>
      </div>
    </form>
  );
}
