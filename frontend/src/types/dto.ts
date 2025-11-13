export interface ApplicationData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  businessNumber: string;
  desiredSupport: string;
  businessIdea: string;
  problemStatement: string;
  developmentStage: '아이디어 단계' | '시제품 단계' | '서비스 운영 중' | '매출 발생 중' | string;
  targetMarket: string;
  customerAndValue: string;
  competitiveness: string;
  goals: string;
}

export interface SubmissionRecord {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  businessNumber: string;
  desiredSupport: string;
  businessIdea: string;
  problemStatement: string;
  developmentStage: string;
  pdfFileId: string;
  pdfViewUrl: string;
  sendDueDate: string;
  sentFlag: boolean;
  sentAt: string;
  error: string;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}
