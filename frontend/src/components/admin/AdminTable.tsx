import { SubmissionRecord } from '../../utils/api';

interface AdminTableProps {
  records: SubmissionRecord[];
  onViewPdf: (record: SubmissionRecord, index: number) => void;
}

export default function AdminTable({ records, onViewPdf }: AdminTableProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // const formatDateOnly = (dateStr: string) => {
  //   if (!dateStr) return '-';
  //   try {
  //     const date = new Date(dateStr);
  //     return date.toLocaleDateString('ko-KR');
  //   } catch {
  //     return dateStr;
  //   }
  // };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white shadow-sm">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-300">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">제출시간</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">회사명</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이름</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">이메일</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">연락처</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">희망과제</th>
            {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">발송예정</th> */}
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">발송여부</th>
            {/* <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">발송시간</th> */}
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">PDF</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                제출된 데이터가 없습니다.
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {formatDate(record.timestamp)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  {record.companyName || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">{record.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{record.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{record.phone}</td>
                {/* <td className="px-4 py-3 text-sm text-gray-600">{record.desiredSupport || '-'}</td> */}
                {/* <td className="px-4 py-3 text-sm text-gray-600 text-center whitespace-nowrap">
                  {formatDateOnly(record.sendDueDate)}
                </td> */}
                <td className="px-4 py-3 text-center">
                  {record.sentFlag ? (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded">
                      ✓ 발송완료
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded">
                      대기중
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center whitespace-nowrap">
                  {record.sentAt ? formatDate(record.sentAt) : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  {record.pdfViewUrl ? (
                    <button
                      onClick={() => onViewPdf(record, index)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      보기
                    </button>
                  ) : (
                    <span className="text-xs text-gray-400">없음</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
