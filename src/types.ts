export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type AngleMode = 'DEG' | 'RAD';

export type ActiveTab = 'calculator' | 'math' | 'physics' | 'converter' | 'history' | 'result-card' | 'branding';

export interface ConverterOption {
  id: string;
  name: string;
  category: string;
  fromUnit: string;
  toUnit: string;
  convert: (val: number) => number;
  formulaDescription: string;
}

export interface SubjectScore {
  id: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
}

export interface UnitTestResultData {
  studentName: string;
  className: string;
  academicYear: string;
  testTitle: string;
  subjects: SubjectScore[];
  statusLabel: string;
  note: string;
}
