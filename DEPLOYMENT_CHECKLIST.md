# 🚀 배포 체크리스트

프로젝트를 프로덕션 환경에 배포하기 전에 확인해야 할 항목들입니다.

## ✅ Google Apps Script 설정

### 1. Spreadsheet 설정
- [ ] Google Spreadsheet 생성 완료
- [ ] Spreadsheet ID 복사 완료
- [ ] 시트 이름 `submissions` 확인
- [ ] 적절한 공유 권한 설정 (본인만 편집 가능)

### 2. Template 문서 설정
- [ ] Google Docs 템플릿 생성 완료
- [ ] 모든 플레이스홀더 확인 ({{회사명}}, {{대표자}} 등)
- [ ] 템플릿 문서 ID 복사 완료
- [ ] 템플릿 문서 읽기 권한 확인

### 3. Apps Script 프로젝트
- [ ] Apps Script 프로젝트 생성
- [ ] `Code.gs` 코드 복사 완료
- [ ] `appsscript.json` 매니페스트 파일 설정
- [ ] `CONFIG` 섹션 모든 값 설정:
  - [ ] `SPREADSHEET_ID`
  - [ ] `TEMPLATE_DOC_ID`
  - [ ] `PDF_FOLDER_ID` (선택사항)
  - [ ] `ADMIN_EMAILS` (관리자 이메일 목록)
  - [ ] `TIMEZONE` 확인 (Asia/Seoul)

### 4. Apps Script 배포
- [ ] 웹 앱으로 배포 완료
- [ ] 배포 설정 확인:
  - [ ] "다음 계정으로 실행": 나
  - [ ] "액세스 권한": 모든 사용자
- [ ] 웹 앱 URL 복사 완료
- [ ] 권한 승인 완료

### 5. 트리거 설정
- [ ] `sendDailyBatch` 트리거 추가
- [ ] 트리거 설정 확인:
  - [ ] 함수: `sendDailyBatch`
  - [ ] 이벤트: 시간 기반
  - [ ] 유형: 일 타이머
  - [ ] 시간: 오후 2-3시
- [ ] 트리거 권한 승인 완료

### 6. 테스트
- [ ] `testInitSheet()` 실행 성공
- [ ] `testCreatePdf()` 실행 성공
- [ ] `testSendEmail()` 실행 성공 (선택사항)
- [ ] Apps Script 로그 확인

## ✅ React 프론트엔드 설정

### 1. 의존성 설치
- [ ] `cd frontend && npm install` 실행 완료
- [ ] 모든 패키지 정상 설치 확인
- [ ] 의존성 버전 충돌 없음

### 2. 환경 변수 설정
- [ ] `.env` 파일 생성 (`.env.example` 복사)
- [ ] `VITE_APPS_SCRIPT_URL` 설정 (Apps Script 웹 앱 URL)
- [ ] `VITE_ADMIN_EMAIL` 설정 (선택사항)
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인

### 3. 로컬 테스트
- [ ] `npm run dev` 로컬 서버 실행 성공
- [ ] `/apply` 페이지 정상 작동
- [ ] `/admin` 페이지 정상 작동
- [ ] 폼 제출 테스트 성공
- [ ] PDF 생성 확인
- [ ] 관리자 대시보드 데이터 로드 확인

### 4. 빌드 테스트
- [ ] `npm run build` 빌드 성공
- [ ] TypeScript 에러 없음
- [ ] `dist/` 폴더 생성 확인
- [ ] 빌드된 파일 용량 확인

### 5. 코드 품질
- [ ] `npm run lint` 린트 에러 없음
- [ ] 불필요한 console.log 제거
- [ ] TODO 주석 확인 및 처리
- [ ] 하드코딩된 값 확인

## ✅ 배포 플랫폼 설정

### Vercel 배포 시
- [ ] Vercel 계정 생성/로그인
- [ ] GitHub 저장소 연결
- [ ] 프로젝트 설정:
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
- [ ] 환경 변수 추가:
  - [ ] `VITE_APPS_SCRIPT_URL`
  - [ ] `VITE_ADMIN_EMAIL` (선택사항)
- [ ] 배포 성공 확인
- [ ] 배포된 URL 접속 테스트

### Netlify 배포 시
- [ ] Netlify 계정 생성/로그인
- [ ] GitHub 저장소 연결
- [ ] 빌드 설정:
  - [ ] Base directory: `frontend`
  - [ ] Build command: `npm run build`
  - [ ] Publish directory: `frontend/dist`
- [ ] 환경 변수 추가:
  - [ ] `VITE_APPS_SCRIPT_URL`
- [ ] 배포 성공 확인
- [ ] 배포된 URL 접속 테스트

### Firebase Hosting 배포 시
- [ ] Firebase CLI 설치
- [ ] Firebase 프로젝트 생성
- [ ] `firebase init hosting` 실행
- [ ] `firebase.json` 설정 확인
- [ ] `firebase deploy` 배포 성공
- [ ] 배포된 URL 접속 테스트

## ✅ 프로덕션 테스트

### 엔드투엔드 테스트
- [ ] 프로덕션 URL 접속 성공
- [ ] 폼 제출 테스트:
  - [ ] 모든 필드 입력
  - [ ] 제출 버튼 클릭
  - [ ] 성공 메시지 확인
  - [ ] PDF 미리보기 확인
- [ ] Spreadsheet 데이터 저장 확인
- [ ] PDF Drive 저장 확인
- [ ] 관리자 대시보드 접속
- [ ] 관리자 대시보드 데이터 로드 확인
- [ ] PDF 모달 정상 작동 확인

### 이메일 발송 테스트
- [ ] 실제 이메일 주소로 테스트 제출
- [ ] 다음날 오후 2시 이메일 수신 확인
- [ ] 이메일 내용 확인
- [ ] PDF 첨부파일 확인
- [ ] Spreadsheet `sent_flag` 업데이트 확인

### 크로스 브라우저 테스트
- [ ] Chrome 정상 작동
- [ ] Firefox 정상 작동
- [ ] Safari 정상 작동 (Mac)
- [ ] Edge 정상 작동

### 모바일 테스트
- [ ] iOS Safari 반응형 확인
- [ ] Android Chrome 반응형 확인
- [ ] 터치 인터랙션 확인
- [ ] 폼 입력 정상 작동

## ✅ 보안 및 성능

### 보안
- [ ] `.env` 파일이 Git에 커밋되지 않음
- [ ] API 키가 코드에 하드코딩되지 않음
- [ ] Apps Script CORS 설정 확인
- [ ] Spreadsheet 접근 권한 적절히 설정
- [ ] 관리자 이메일 화이트리스트 설정

### 성능
- [ ] 초기 로딩 시간 확인 (< 3초)
- [ ] 폼 제출 응답 시간 확인 (< 5초)
- [ ] PDF 생성 시간 확인 (< 10초)
- [ ] 이미지 최적화 확인
- [ ] 번들 크기 확인

## ✅ 모니터링 및 유지보수

### 모니터링 설정
- [ ] Apps Script 실행 로그 확인 방법 숙지
- [ ] 에러 알림 설정 (선택사항)
- [ ] 일일 제출 수 모니터링 계획
- [ ] 이메일 발송 실패 모니터링 계획

### 문서화
- [ ] README.md 최신 상태 확인
- [ ] API 문서 최신 상태 확인
- [ ] 팀원 온보딩 가이드 작성 (선택사항)
- [ ] 트러블슈팅 가이드 확인

### 백업
- [ ] Spreadsheet 백업 계획 수립
- [ ] Apps Script 코드 백업 (Git)
- [ ] Template 문서 백업
- [ ] 환경 변수 기록 (안전한 곳에)

## ✅ 최종 확인

### 배포 전 마지막 체크
- [ ] 모든 테스트 통과
- [ ] 코드 리뷰 완료 (팀 작업 시)
- [ ] 프로덕션 환경 변수 이중 확인
- [ ] 롤백 계획 수립
- [ ] 배포 시간 결정 (트래픽 적은 시간)

### 배포 후 체크
- [ ] 프로덕션 URL 정상 접속
- [ ] 실제 사용자 플로우 테스트
- [ ] 에러 로그 확인
- [ ] 성능 메트릭 확인
- [ ] 팀원/사용자에게 공지

## 📋 할당량 확인

### Google Apps Script 할당량
- [ ] MailApp.sendEmail: 100통/일 (무료 계정)
- [ ] DriveApp 쿼터 확인
- [ ] 실행 시간: 6분/실행
- [ ] 트리거 실행 횟수 확인

필요 시 Google Workspace 유료 계정 고려

---

## ✨ 배포 완료!

모든 항목을 체크했다면 배포가 완료되었습니다. 🎉

**다음 단계**:
1. 사용자에게 서비스 공지
2. 피드백 수집
3. 지속적인 모니터링 및 개선
