// Google Apps Script WebApp API 호출 유틸리티

const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL || ''

export interface ApplicationData {
  name: string
  email: string
  phone: string
  companyName: string
  businessNumber: string
  desiredSupport: string
  businessIdea: string
  targetMarket: string
  competitiveness: string
}

export interface SubmissionRecord {
  timestamp: string
  name: string
  email: string
  phone: string
  companyName: string
  businessNumber: string
  desiredSupport: string
  pdfFileId: string
  pdfViewUrl: string
  sendDueDate: string
  sentFlag: boolean
  sentAt: string
  error: string
}

export interface ApiResponse<T = any> {
  ok: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 사용자 신청 데이터를 Apps Script로 전송
 */
export async function submitApplication(data: ApplicationData): Promise<ApiResponse<{ pdfViewUrl: string }>> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Submit application error:', error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : '신청 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 관리자 페이지용 - 전체 제출 목록 조회
 */
export async function fetchSubmissionList(): Promise<ApiResponse<SubmissionRecord[]>> {
  try {
    const url = `${API_URL}?action=list`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Fetch submission list error:', error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : '목록 조회 중 오류가 발생했습니다.',
    }
  }
}

/**
 * 특정 행의 PDF URL 조회
 */
export async function fetchPdfUrl(rowIndex: number): Promise<ApiResponse<{ pdfViewUrl: string }>> {
  try {
    const url = `${API_URL}?action=pdf&row=${rowIndex}`
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Fetch PDF URL error:', error)
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'PDF URL 조회 중 오류가 발생했습니다.',
    }
  }
}
