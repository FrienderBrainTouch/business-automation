# 한결 경영혁신센터 - 사업계획서 사전진단 웹앱

React + Google Apps Script 기반의 자동화된 사업계획서 사전진단 시스템입니다.

## 📋 프로젝트 개요

사용자가 웹 폼을 통해 사업 정보를 제출하면, Google Apps Script가 자동으로:
- 데이터를 Google Spreadsheet에 저장
- AI 기반 PDF 문서 생성
- 다음날 오후 2시에 이메일로 자동 발송

관리자는 대시보드에서 모든 제출 내역과 발송 상태를 실시간으로 확인할 수 있습니다.

## 🏗️ 기술 스택

### Frontend
- **React 18** + **TypeScript**
- **Vite** (빌드 도구)
- **React Router** (라우팅)
- **Tailwind CSS** (스타일링)
- **Fetch API** (백엔드 통신)

### Backend
- **Google Apps Script**
  - SpreadsheetApp (데이터베이스)
  - DriveApp (파일 관리)
  - DocumentApp (PDF 생성)
  - MailApp (이메일 발송)
  - 시간 기반 트리거 (자동 발송)

### Database
- **Google Spreadsheet**

## 📁 프로젝트 구조

```
business-automation/
├── frontend/                     # React 프론트엔드
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Apply.tsx        # 사용자 신청 페이지
│   │   │   └── Admin.tsx        # 관리자 대시보드
│   │   ├── components/
│   │   │   ├── ApplyForm.tsx    # 신청 폼 컴포넌트
│   │   │   ├── SuccessMessage.tsx  # 제출 완료 메시지
│   │   │   ├── AdminTable.tsx   # 관리자 테이블
│   │   │   └── PdfModal.tsx     # PDF 모달
│   │   ├── utils/
│   │   │   └── api.ts           # Apps Script API 호출
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── apps-script/                 # Google Apps Script 백엔드
│   ├── Code.gs                  # 메인 백엔드 로직
│   ├── appsscript.json          # Apps Script 설정
│   └── Template.md              # 템플릿 가이드
│
├── index.html                   # PDF 템플릿 (기존)
└── README.md                    # 이 파일
```

## 🚀 설치 및 설정

### 1️⃣ Google Apps Script 설정

#### 1-1. Google Spreadsheet 생성

1. [Google Spreadsheet](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. URL에서 Spreadsheet ID 복사
   - 형식: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
4. 시트 이름을 `submissions`로 변경 (또는 원하는 이름)

#### 1-2. Google Docs 템플릿 생성

1. [Google Docs](https://docs.google.com) 접속
2. 새 문서 생성
3. `apps-script/Template.md` 참고하여 템플릿 작성
4. 플레이스홀더 사용: `{{회사명}}`, `{{대표자}}` 등
5. URL에서 Document ID 복사
   - 형식: `https://docs.google.com/document/d/[DOCUMENT_ID]/edit`

#### 1-3. Apps Script 프로젝트 생성

1. [Google Apps Script](https://script.google.com) 접속
2. "새 프로젝트" 클릭
3. `apps-script/Code.gs` 내용 복사하여 붙여넣기
4. `apps-script/appsscript.json` 내용으로 매니페스트 파일 업데이트
   - 좌측 메뉴: 프로젝트 설정 → "appsscript.json" 매니페스트 파일 표시 체크
5. `Code.gs`의 `CONFIG` 섹션 수정:
   ```javascript
   const CONFIG = {
     SPREADSHEET_ID: 'your_spreadsheet_id',      // 1-1에서 복사한 ID
     SHEET_NAME: 'submissions',
     TEMPLATE_DOC_ID: 'your_template_doc_id',    // 1-2에서 복사한 ID
     PDF_FOLDER_ID: '',                          // 선택사항
     ADMIN_EMAILS: ['admin@example.com'],        // 관리자 이메일
     TIMEZONE: 'Asia/Seoul',
   };
   ```

#### 1-4. Apps Script 배포

1. 우측 상단 "배포" → "새 배포"
2. 유형 선택: "웹 앱"
3. 설정:
   - **설명**: "Business Automation API v1"
   - **다음 계정으로 실행**: 나
   - **액세스 권한**: **모든 사용자** (익명 사용자 포함)
4. "배포" 클릭
5. **웹 앱 URL 복사** (나중에 사용)
   - 형식: `https://script.google.com/macros/s/[SCRIPT_ID]/exec`

#### 1-5. 시간 기반 트리거 설정

1. Apps Script 편집기 좌측 메뉴 → "트리거" (⏰)
2. "트리거 추가" 클릭
3. 설정:
   - **실행할 함수**: `sendDailyBatch`
   - **이벤트 소스**: 시간 기반
   - **시간 기반 트리거 유형**: 일 타이머
   - **시간 선택**: 오후 2시~3시
4. "저장" 클릭
5. 권한 승인 (최초 1회)

### 2️⃣ React 프론트엔드 설정

#### 2-1. 의존성 설치

```bash
cd frontend
npm install
```

#### 2-2. 환경 변수 설정

```bash
# .env.example을 .env로 복사
cp .env.example .env
```

`.env` 파일 수정:
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[SCRIPT_ID]/exec
VITE_ADMIN_EMAIL=admin@example.com
```

**중요**: `[SCRIPT_ID]`를 1-4에서 복사한 웹 앱 URL로 교체하세요.

#### 2-3. 로컬 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

- `/apply` - 사용자 신청 페이지
- `/admin` - 관리자 대시보드

#### 2-4. 프로덕션 빌드

```bash
npm run build
```

`dist/` 폴더에 빌드된 파일이 생성됩니다.

### 3️⃣ 배포

#### Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프론트엔드 폴더에서
cd frontend
vercel

# 환경 변수 설정
vercel env add VITE_APPS_SCRIPT_URL
# 웹 앱 URL 입력

# 프로덕션 배포
vercel --prod
```

#### Netlify 배포

1. [Netlify](https://netlify.com) 접속
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. 빌드 설정:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. 환경 변수 추가:
   - `VITE_APPS_SCRIPT_URL`: Apps Script 웹 앱 URL

#### Firebase Hosting 배포

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 프로젝트 초기화
firebase init hosting

# 빌드
cd frontend
npm run build

# 배포
firebase deploy
```

## 📖 사용 방법

### 사용자 (User)

1. `/apply` 페이지 접속
2. 기업 정보 및 사업 계획 입력:
   - 회사명, 대표자, 사업자등록번호
   - 이메일, 연락처, 희망 지원과제
   - 사업 아이디어, 목표 시장, 경쟁력
3. "제출하기" 클릭
4. 제출 완료 메시지 확인
   - PDF 미리보기 (선택사항)
   - 내일 오후 2시에 이메일로 발송 안내
5. 다음날 오후 2시에 이메일 수신 확인

### 관리자 (Admin)

1. `/admin` 페이지 접속
2. Google 계정 로그인 (관리자 이메일)
3. 대시보드에서 확인:
   - 전체 제출 통계 (전체, 발송완료, 대기중)
   - 제출 목록 테이블
     - 제출 시간, 회사명, 이름, 이메일, 연락처
     - 발송 예정일, 발송 여부, 발송 시간
4. "보기" 버튼 클릭 → PDF 모달로 미리보기
5. "새로고침" 버튼으로 최신 데이터 갱신

## 🔧 주요 기능

### 자동화 워크플로우

1. **사용자 제출** → Apps Script `doPost()` 호출
2. **데이터 저장** → Google Spreadsheet에 행 추가
3. **PDF 생성** → Docs 템플릿 복제 → 플레이스홀더 치환 → PDF 변환
4. **Drive 저장** → PDF 파일 업로드 → 공유 권한 설정
5. **발송 예약** → `send_due_date` = 내일, `sent_flag` = false
6. **자동 발송** → 매일 14:00 트리거 → `sendDailyBatch()` 실행 → 이메일 발송 → 상태 업데이트

### API 엔드포인트

#### POST `/` - 사용자 신청 제출

**요청**:
```json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "phone": "010-1234-5678",
  "companyName": "테스트컴퍼니",
  "businessNumber": "123-45-67890",
  "desiredSupport": "예비창업패키지",
  "businessIdea": "...",
  "targetMarket": "...",
  "competitiveness": "..."
}
```

**응답**:
```json
{
  "ok": true,
  "data": {
    "pdfViewUrl": "https://drive.google.com/file/d/.../preview",
    "message": "제출이 완료되었습니다."
  },
  "error": null
}
```

#### GET `/?action=list` - 전체 제출 목록 조회 (관리자)

**응답**:
```json
{
  "ok": true,
  "data": [
    {
      "timestamp": "2025-01-15 10:30:00",
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "companyName": "테스트컴퍼니",
      "businessNumber": "123-45-67890",
      "desiredSupport": "예비창업패키지",
      "pdfFileId": "1abc...",
      "pdfViewUrl": "https://drive.google.com/...",
      "sendDueDate": "2025-01-16",
      "sentFlag": false,
      "sentAt": "",
      "error": ""
    }
  ],
  "error": null
}
```

#### GET `/?action=pdf&row=3` - 특정 PDF URL 조회

**응답**:
```json
{
  "ok": true,
  "data": {
    "pdfViewUrl": "https://drive.google.com/file/d/.../preview"
  },
  "error": null
}
```

## 🗄️ 데이터베이스 스키마

Google Spreadsheet `submissions` 시트:

| 열 | 이름 | 타입 | 설명 |
|---|---|---|---|
| A | timestamp | Date | 제출 시간 |
| B | name | String | 대표자 이름 |
| C | email | String | 이메일 |
| D | phone | String | 연락처 |
| E | company_name | String | 회사명 |
| F | business_number | String | 사업자등록번호 |
| G | desired_support | String | 희망 지원과제 |
| H | business_idea | String | 사업 아이디어 |
| I | target_market | String | 목표 시장 |
| J | competitiveness | String | 경쟁력 |
| K | pdf_file_id | String | Drive PDF 파일 ID |
| L | pdf_view_url | String | PDF 미리보기 URL |
| M | send_due_date | String | 발송 예정일 (yyyy-MM-dd) |
| N | sent_flag | Boolean | 발송 완료 여부 |
| O | sent_at | Date | 발송 시간 |
| P | error | String | 에러 메시지 |

## 🧪 테스트

### Apps Script 테스트

Apps Script 편집기에서 다음 테스트 함수 실행:

```javascript
// 1. 시트 초기화 테스트
testInitSheet()

// 2. PDF 생성 테스트
testCreatePdf()

// 3. 이메일 발송 테스트
testSendEmail()
```

### 프론트엔드 테스트

```bash
cd frontend

# 개발 서버 실행
npm run dev

# 린트 체크
npm run lint

# 타입 체크
npx tsc --noEmit
```

## 🔐 보안 고려사항

1. **Apps Script 배포**:
   - "모든 사용자" 액세스는 웹 폼 제출에 필요
   - 관리자 기능은 `isAdmin()` 함수로 이메일 체크 (선택적)

2. **환경 변수**:
   - `.env` 파일은 Git에 커밋하지 않음
   - 프로덕션 환경에서는 배포 플랫폼의 환경 변수 사용

3. **CORS**:
   - Apps Script에서 자동으로 CORS 헤더 처리
   - 모든 도메인에서 접근 가능

4. **데이터 검증**:
   - 프론트엔드: HTML5 validation + React validation
   - 백엔드: Apps Script에서 필수 필드 체크

## 🛠️ 트러블슈팅

### 1. Apps Script 배포 오류

**문제**: "권한이 없습니다" 오류

**해결**:
1. Apps Script 프로젝트 → 프로젝트 설정
2. "Google Cloud Platform(GCP) 프로젝트" 확인
3. 필요한 OAuth 스코프 추가 (`appsscript.json` 참고)

### 2. CORS 오류

**문제**: "CORS policy blocked" 오류

**해결**:
1. Apps Script 웹 앱 배포 시 "모든 사용자" 액세스 확인
2. `createResponse()` 함수에서 CORS 헤더 설정 확인
3. 새로 배포 (버전 업데이트)

### 3. PDF 생성 실패

**문제**: PDF가 생성되지 않음

**해결**:
1. `TEMPLATE_DOC_ID`가 올바른지 확인
2. 템플릿 문서에 대한 읽기 권한 확인
3. `testCreatePdf()` 함수로 테스트
4. Apps Script 로그 확인 (보기 → 로그)

### 4. 이메일 발송 안 됨

**문제**: 트리거가 실행되지 않음

**해결**:
1. 트리거 설정 확인 (트리거 메뉴)
2. 트리거 실행 기록 확인
3. `sendDailyBatch()` 수동 실행 테스트
4. 할당량 확인 (MailApp 일일 할당량: 100통/일)

### 5. 프론트엔드 빌드 오류

**문제**: `npm run build` 실패

**해결**:
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# TypeScript 에러 확인
npx tsc --noEmit

# 캐시 삭제
npm run build -- --force
```

## 📝 커스터마이징

### 폼 필드 추가

1. **프론트엔드** (`ApplyForm.tsx`):
   - `ApplicationData` 인터페이스에 필드 추가
   - 폼 UI에 input/textarea 추가

2. **백엔드** (`Code.gs`):
   - `doPost()` 함수에서 데이터 파싱
   - 시트 appendRow에 열 추가
   - 템플릿 플레이스홀더 추가

3. **스프레드시트**:
   - 헤더 행에 열 추가

### 이메일 템플릿 수정

`Code.gs`의 `sendDailyBatch()` 함수:
```javascript
const subject = '[한결 경영혁신센터] ...';
const body = `...`;  // 이메일 본문 수정
```

### PDF 템플릿 수정

1. Google Docs 템플릿 문서 수정
2. 플레이스홀더 추가/수정
3. `createPdfFromTemplate()` 함수에서 `replaceText()` 추가

## 📄 라이선스

MIT License

## 👥 기여

Issues와 Pull Requests를 환영합니다!

## 📞 문의

한결 경영혁신센터
- 이메일: contact@hangyeol-center.com
- 웹사이트: https://hangyeol-center.com

---

**제작**: 한결 경영혁신센터 개발팀
**최종 수정**: 2025년 1월
