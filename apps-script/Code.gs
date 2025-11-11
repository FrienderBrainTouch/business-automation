/**
 * Google Apps Script - Business Automation Backend
 *
 * 설정 방법:
 * 1. Google Spreadsheet 생성 및 SPREADSHEET_ID 설정
 * 2. Google Docs 템플릿 생성 및 TEMPLATE_DOC_ID 설정
 * 3. ADMIN_EMAILS 배열에 관리자 이메일 추가
 * 4. 웹 앱으로 배포 (모든 사용자, 익명 사용자 포함)
 * 5. 시간 기반 트리거 설정: sendDailyBatch() - 매일 오후 2시
 */

// ==================== 설정 ====================

const CONFIG = {
  // 스프레드시트 ID (https://docs.google.com/spreadsheets/d/[이 부분]/edit)
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',

  // 시트 이름
  SHEET_NAME: 'submissions',

  // Google Docs 템플릿 ID (PDF 생성용)
  TEMPLATE_DOC_ID: 'YOUR_TEMPLATE_DOC_ID_HERE',

  // PDF 저장 폴더 ID (선택사항, 없으면 루트 폴더)
  PDF_FOLDER_ID: '',

  // 관리자 이메일 목록
  ADMIN_EMAILS: [
    'admin@example.com',
    // 추가 관리자 이메일
  ],

  // 타임존
  TIMEZONE: 'Asia/Seoul',
};

// ==================== 메인 함수 ====================

/**
 * POST 요청 처리 - 사용자 신청 제출
 */
function doPost(e) {
  try {
    // CORS 헤더 설정
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    // 요청 데이터 파싱
    const data = JSON.parse(e.postData.contents);

    Logger.log('Received data: ' + JSON.stringify(data));

    // 데이터 검증
    if (!data.name || !data.email || !data.phone) {
      return createResponse(false, null, '필수 항목이 누락되었습니다.');
    }

    // 스프레드시트에 저장
    const sheet = getOrCreateSheet();
    const timestamp = new Date();

    // PDF 생성
    let pdfFileId = '';
    let pdfViewUrl = '';
    let error = '';

    try {
      const pdfResult = createPdfFromTemplate(data);
      pdfFileId = pdfResult.fileId;
      pdfViewUrl = pdfResult.viewUrl;
    } catch (pdfError) {
      Logger.log('PDF creation error: ' + pdfError);
      error = 'PDF 생성 실패: ' + pdfError.toString();
    }

    // 내일 날짜 계산
    const sendDueDate = new Date(timestamp);
    sendDueDate.setDate(sendDueDate.getDate() + 1);
    sendDueDate.setHours(14, 0, 0, 0); // 오후 2시

    // 시트에 데이터 추가
    sheet.appendRow([
      timestamp,                    // A: timestamp
      data.name,                    // B: name
      data.email,                   // C: email
      data.phone,                   // D: phone
      data.companyName || '',       // E: company_name
      data.businessNumber || '',    // F: business_number
      data.desiredSupport || '',    // G: desired_support
      data.businessIdea || '',      // H: business_idea
      data.targetMarket || '',      // I: target_market
      data.competitiveness || '',   // J: competitiveness
      pdfFileId,                    // K: pdf_file_id
      pdfViewUrl,                   // L: pdf_view_url
      Utilities.formatDate(sendDueDate, CONFIG.TIMEZONE, 'yyyy-MM-dd'), // M: send_due_date
      false,                        // N: sent_flag
      '',                           // O: sent_at
      error                         // P: error
    ]);

    Logger.log('Data saved successfully');

    // 성공 응답
    return createResponse(true, {
      pdfViewUrl: pdfViewUrl,
      message: '제출이 완료되었습니다.'
    });

  } catch (error) {
    Logger.log('doPost error: ' + error);
    return createResponse(false, null, error.toString());
  }
}

/**
 * GET 요청 처리 - 관리자 페이지용 API
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'list';

    // 관리자 권한 체크 (선택적)
    // const userEmail = Session.getActiveUser().getEmail();
    // if (!isAdmin(userEmail)) {
    //   return createResponse(false, null, '관리자 권한이 필요합니다.');
    // }

    if (action === 'list') {
      // 전체 목록 반환
      const records = getAllRecords();
      return createResponse(true, records);

    } else if (action === 'pdf') {
      // 특정 PDF URL 반환
      const rowIndex = parseInt(e.parameter.row);
      if (isNaN(rowIndex)) {
        return createResponse(false, null, '잘못된 행 번호입니다.');
      }

      const sheet = getSheet();
      const row = sheet.getRange(rowIndex + 2, 1, 1, 16).getValues()[0]; // +2는 헤더 고려
      const pdfViewUrl = row[11]; // L열 (pdf_view_url)

      return createResponse(true, { pdfViewUrl: pdfViewUrl });

    } else {
      return createResponse(false, null, '알 수 없는 액션입니다.');
    }

  } catch (error) {
    Logger.log('doGet error: ' + error);
    return createResponse(false, null, error.toString());
  }
}

/**
 * 매일 오후 2시 실행 - 이메일 일괄 발송
 * 트리거 설정: 프로젝트 트리거 > sendDailyBatch > 시간 기반 > 일 타이머 > 오후 2-3시
 */
function sendDailyBatch() {
  try {
    const sheet = getSheet();
    const data = sheet.getDataRange().getValues();
    const today = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd');

    Logger.log('Starting daily batch for: ' + today);

    let sentCount = 0;

    // 헤더 제외하고 순회 (i=1부터 시작)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sendDueDate = row[12]; // M열 (send_due_date)
      const sentFlag = row[13];     // N열 (sent_flag)
      const email = row[2];         // C열 (email)
      const name = row[1];          // B열 (name)
      const companyName = row[4];   // E열 (company_name)
      const pdfFileId = row[10];    // K열 (pdf_file_id)

      // 조건: 오늘 발송 예정 && 아직 발송하지 않음
      if (sendDueDate === today && !sentFlag && pdfFileId) {
        try {
          // PDF 파일 가져오기
          const pdfFile = DriveApp.getFileById(pdfFileId);

          // 이메일 발송
          const subject = '[한결 경영혁신센터] 사업계획서 사전진단 결과';
          const body = `
안녕하세요, ${name}님.

한결 경영혁신센터입니다.

${companyName || '귀사'}의 사업계획서 사전진단 결과를 첨부파일로 보내드립니다.

본 문서는 귀사의 설문 응답을 기반으로 작성된 초안입니다.
더 자세한 컨설팅이 필요하시면 아래로 문의해 주세요.

📧 문의: contact@hangyeol-center.com
🔗 웹사이트: https://hangyeol-center.com

감사합니다.

---
한결 경영혁신센터
          `.trim();

          MailApp.sendEmail({
            to: email,
            subject: subject,
            body: body,
            attachments: [pdfFile.getAs(MimeType.PDF)],
            name: '한결 경영혁신센터'
          });

          // 발송 상태 업데이트
          const now = new Date();
          sheet.getRange(i + 1, 14).setValue(true); // N열 (sent_flag)
          sheet.getRange(i + 1, 15).setValue(now);  // O열 (sent_at)

          sentCount++;
          Logger.log(`Email sent to ${email}`);

        } catch (emailError) {
          Logger.log(`Failed to send email to ${email}: ${emailError}`);
          // 에러 기록
          sheet.getRange(i + 1, 16).setValue('발송 실패: ' + emailError.toString());
        }
      }
    }

    Logger.log(`Daily batch completed. Sent: ${sentCount} emails`);

  } catch (error) {
    Logger.log('sendDailyBatch error: ' + error);
  }
}

// ==================== 유틸리티 함수 ====================

/**
 * PDF 생성 (Google Docs 템플릿 기반)
 */
function createPdfFromTemplate(data) {
  try {
    // 템플릿 문서 복제
    const templateDoc = DriveApp.getFileById(CONFIG.TEMPLATE_DOC_ID);
    const copyName = `사업계획서_${data.companyName || data.name}_${new Date().getTime()}`;
    const docCopy = templateDoc.makeCopy(copyName);

    // 문서 열기
    const doc = DocumentApp.openById(docCopy.getId());
    const body = doc.getBody();

    // 플레이스홀더 치환
    body.replaceText('{{회사명}}', data.companyName || '-');
    body.replaceText('{{대표자}}', data.name || '-');
    body.replaceText('{{사업자등록번호}}', data.businessNumber || '-');
    body.replaceText('{{이메일}}', data.email || '-');
    body.replaceText('{{연락처}}', data.phone || '-');
    body.replaceText('{{희망과제}}', data.desiredSupport || '-');
    body.replaceText('{{사업아이디어}}', data.businessIdea || '-');
    body.replaceText('{{목표시장}}', data.targetMarket || '-');
    body.replaceText('{{경쟁력}}', data.competitiveness || '-');

    // 저장 및 닫기
    doc.saveAndClose();

    // PDF로 변환
    const pdfBlob = docCopy.getAs('application/pdf');

    // PDF 저장 위치 결정
    let folder = DriveApp.getRootFolder();
    if (CONFIG.PDF_FOLDER_ID) {
      folder = DriveApp.getFolderById(CONFIG.PDF_FOLDER_ID);
    }

    // PDF 파일 생성
    const pdfFile = folder.createFile(pdfBlob);
    pdfFile.setName(copyName + '.pdf');

    // 원본 Doc 파일 삭제 (선택사항)
    docCopy.setTrashed(true);

    // 누구나 읽기 권한 설정
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    // 미리보기 URL 생성
    const fileId = pdfFile.getId();
    const viewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

    return {
      fileId: fileId,
      viewUrl: viewUrl
    };

  } catch (error) {
    Logger.log('createPdfFromTemplate error: ' + error);
    throw error;
  }
}

/**
 * 스프레드시트 가져오기 또는 생성
 */
function getOrCreateSheet() {
  try {
    const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
      // 시트 생성 및 헤더 설정
      sheet = ss.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow([
        'timestamp',
        'name',
        'email',
        'phone',
        'company_name',
        'business_number',
        'desired_support',
        'business_idea',
        'target_market',
        'competitiveness',
        'pdf_file_id',
        'pdf_view_url',
        'send_due_date',
        'sent_flag',
        'sent_at',
        'error'
      ]);

      // 헤더 스타일 설정
      const headerRange = sheet.getRange(1, 1, 1, 16);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#f3f3f3');
    }

    return sheet;

  } catch (error) {
    Logger.log('getOrCreateSheet error: ' + error);
    throw error;
  }
}

/**
 * 스프레드시트 가져오기
 */
function getSheet() {
  const ss = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
  return ss.getSheetByName(CONFIG.SHEET_NAME);
}

/**
 * 전체 레코드 조회
 */
function getAllRecords() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const records = [];

  // 헤더 제외 (i=1부터 시작)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    records.push({
      timestamp: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      companyName: row[4],
      businessNumber: row[5],
      desiredSupport: row[6],
      businessIdea: row[7],
      targetMarket: row[8],
      competitiveness: row[9],
      pdfFileId: row[10],
      pdfViewUrl: row[11],
      sendDueDate: row[12],
      sentFlag: row[13],
      sentAt: row[14],
      error: row[15]
    });
  }

  return records;
}

/**
 * 관리자 권한 체크
 */
function isAdmin(email) {
  return CONFIG.ADMIN_EMAILS.includes(email);
}

/**
 * JSON 응답 생성
 */
function createResponse(ok, data, error) {
  const response = {
    ok: ok,
    data: data || null,
    error: error || null
  };

  const output = ContentService.createTextOutput(JSON.stringify(response));
  output.setMimeType(ContentService.MimeType.JSON);

  // CORS 헤더 설정
  return output;
}

// ==================== 테스트 함수 ====================

/**
 * 테스트용 함수 - 시트 초기화
 */
function testInitSheet() {
  const sheet = getOrCreateSheet();
  Logger.log('Sheet initialized: ' + sheet.getName());
}

/**
 * 테스트용 함수 - PDF 생성
 */
function testCreatePdf() {
  const testData = {
    name: '홍길동',
    email: 'test@example.com',
    phone: '010-1234-5678',
    companyName: '테스트컴퍼니',
    businessNumber: '123-45-67890',
    desiredSupport: '예비창업패키지',
    businessIdea: '이것은 테스트 사업 아이디어입니다.',
    targetMarket: '테스트 시장',
    competitiveness: '테스트 경쟁력'
  };

  const result = createPdfFromTemplate(testData);
  Logger.log('PDF created: ' + JSON.stringify(result));
}

/**
 * 테스트용 함수 - 이메일 발송
 */
function testSendEmail() {
  sendDailyBatch();
}
