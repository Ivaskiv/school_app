export const initialSchoolData = {
  schoolData: {
    schoolName: 'Test School',
    schoolAddress: '123 Test Street',
    schoolEmail: 'testschool@example.com',
    schoolId: 'school1234567890', // school + new Date().getTime()
    mainAdmin: {
      adminName: 'John Doe',
      adminEmail: 'john@example.com',
      adminPassword: 'password123',
    },
  },
  admins: {
    admin: {
      adminName: 'Test Admin',
      adminEmail: 'testadmin@example.com',
      adminPassword: 'testpassword123',
    },
  },
  classes: {
    class1: {
      className: 'Class 1',
      teacherId: 'teacher1',
      students: ['student1', 'student2'],
    },
    class2: {
      className: 'Class 2',
      teacherId: 'teacher2',
      students: ['student3', 'student4'],
    },
  },
  students: {
    student1: {
      studentName: 'John Doe',
      classId: 'class1',
    },
    student2: {
      studentName: 'Jane Doe',
      classId: 'class1',
    },
    student3: {
      studentName: 'Alice Smith',
      classId: 'class2',
    },
    student4: {
      studentName: 'Bob Johnson',
      classId: 'class2',
    },
  },
  subjects: {
    math: {
      subjectName: 'Mathematics',
      teacherId: 'teacher1',
      classes: ['class1'],
    },
    science: {
      subjectName: 'Science',
      teacherId: 'teacher2',
      classes: ['class2'],
    },
  },
  teachers: {
    teacher1: {
      teacherName: 'Mr. John Smith',
      subject: 'math',
    },
    teacher2: {
      teacherName: 'Mrs. Mary Johnson',
      subject: 'science',
    },
  },
  principal: {
    principalName: 'Dr. Albert Brown',
    email: 'principal@example.com',
  },
};
