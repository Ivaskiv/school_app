export const selectClassesByTeacher = (state, teacherId) =>
  state.teachersClasses.teachersClasses.find(relation => relation.teacherId === teacherId)
    ?.classIds || [];
