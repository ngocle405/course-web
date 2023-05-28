export interface CourseModel {
  courseId?: string|null;
  code?: string;
  courseName?: string;
  title?: string;
  englishName?: string;
  teacherId?: string;
  courseCategoryId?: string;
  image?: string;
  description?: string;
  note?: string;
  countLesson?: string;
  price?: string | number;
  startDate?: string | Date;
  endDate?: string | Date;
  teacherName?: string;
  courseCategoryName?: string;
}
