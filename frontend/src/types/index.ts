export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  type: 'teacher' | 'student';
  classroomId?: string;
}

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  code: string;
  students: string[];
}

// نظام التتبع
export interface ActivityProgress {
  activityType: 'letter-sounds' | 'draw-letters' | 'letter-position' | 'color-letters';
  letter?: string;
  score: number; // من 0 إلى 100
  completedAt: number; // timestamp
  timeSpent?: number; // بالثواني
}

export interface StudentProgress {
  studentId: string;
  activities: ActivityProgress[];
  totalScore: number;
  completedLessons: number;
  lastActivityDate?: number;
}

export interface StudentStats {
  studentId: string;
  studentName: string;
  totalActivities: number;
  averageScore: number;
  completedLetters: Set<string>;
  lastActive?: Date;
  activitiesByType: {
    'letter-sounds': number;
    'draw-letters': number;
    'letter-position': number;
    'color-letters': number;
  };
}