const initialState = {
  relations: {
    classesPupils: [
      { classId: 1, pupilIds: [1, 2] },
      { classId: 2, pupilIds: [3] },
    ],
    classesSubjects: [
      { classId: 1, subjectIds: [1, 2] },
      { classId: 2, subjectIds: [3] },
    ],
    classesTeachers: [
      { classId: 1, teacherIds: [1, 2] },
      { classId: 2, teacherIds: [3] },
    ],
    classTeacher: [
      { classId: 1, teacherId: 1 },
      { classId: 2, teacherId: 3 },
    ],
    pupilClass: [
      { pupilId: 1, classId: 3 },
      { pupilId: 2, classId: 3 },
    ],
    pupilsSubjects: [
      { pupilId: 1, subjectIds: [1, 2] },
      { pupilId: 2, subjectIds: [3, 4] },
    ],
    pupilsTeachers: [
      { pupilId: 1, teacherIds: [1, 2] },
      { pupilId: 2, teacherIds: [3, 4] },
    ],
    subjectsClasses: [
      { subjectId: 1, classIds: [1, 2] },
      { subjectId: 2, classIds: [3] },
    ],
    subjectsPupils: [
      { subjectId: 1, pupilIds: [1, 2] },
      { subjectId: 2, pupilIds: [3] },
    ],
    subjectsTeachers: [
      { subjectId: 1, teacherIds: [1, 2] },
      { subjectId: 2, teacherIds: [3] },
    ],
    teachersClasses: [
      { teacherId: 1, classIds: [1, 2] },
      { teacherId: 2, classIds: [3] },
    ],
    teachersPupils: [
      { teacherId: 1, pupilIds: [1, 2] },
      { teacherId: 2, pupilIds: [3] },
    ],
    teachersSubjects: [
      { teacherId: 1, subjectIds: [1, 2] },
      { teacherId: 2, subjectIds: [3] },
    ],
  },
};
