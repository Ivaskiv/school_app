//apiSlice.jsx
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser } from '../../../features/auth/redux/authSlice';
import { store } from '../../../store/store';

export const apiSlice = createApi({
  reducerPath: 'api/',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: headers => {
      const token = store.getState().auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    // auth
    signUp: builder.mutation({
      query: userData => ({
        url: '/users/signup',
        method: 'POST',
        body: userData,
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            // dispatch(setAuthenticated(true));
            //зберегти користувача в redux
            dispatch(setUser(data.user));
          }
        } catch (error) {
          console.error('Signup failed:', error);
        }
      },
    }),
    signIn: builder.mutation({
      query: userData => ({
        url: '/users/signin',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            // dispatch(setAuthenticated(true));
            //зберегти користувача в redux
            dispatch(setUser(data.user));
          }
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    }),
    getCurrentUser: builder.query({
      query: () => '/users/current',
    }),
    signOut: builder.mutation({
      query: () => ({
        url: '/users/signout',
        method: 'POST',
      }),
    }),
    // words
    getWordsCategories: builder.query({
      query: () => ({
        url: '/words/categories',
        method: 'GET',
      }),
    }),
    getVerbTypes: builder.query({
      query: () => '/verbs/types',
    }),

    createWord: builder.mutation({
      query: wordData => ({
        url: '/words/create',
        method: 'POST',
        body: wordData,
      }),
    }),
    addWord: builder.mutation({
      query: id => ({
        url: `/words/add/${id}`,
        method: 'POST',
      }),
    }),
    editWord: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/words/edit/${id}`,
        method: 'PATCH',
        body: updateData,
      }),
    }),
    getWordsAll: builder.query({
      query: () => ({
        url: '/words/all',
        method: 'GET',
      }),
    }),
    getUserWords: builder.query({
      query: () => ({
        url: '/words/own',
        method: 'GET',
      }),
    }),
    deleteWord: builder.mutation({
      query: id => ({
        url: `/words/delete/${id}`,
        method: 'DELETE',
      }),
    }),
    // statistics
    getUserStatistics: builder.query({
      query: () => ({
        url: '/words/statistics',
        method: 'GET',
      }),
    }),
    getUserTasks: builder.query({
      query: () => ({
        url: '/words/tasks',
        method: 'GET',
      }),
    }),
    postAnswers: builder.mutation({
      query: answers => ({
        url: '/words/answers',
        method: 'POST',
        body: answers,
      }),
    }),
    //pagination
    // getWordPaginated: builder.query({
    //   query: params => {
    //     console.log('Fetching paginated words with params:', params);
    //     return {
    //       url: `/words/all`,
    //       method: 'GET',
    //       params,
    //     };
    //   },
    // }),
    getWordAllPaginated: builder.query({
      query: ({ page, limit, keyword, category, isIrregular }) => {
        console.log('Fetching all paginated words with params:', {
          page,
          limit,
          keyword,
          category,
          isIrregular,
        });
        return {
          url: '/words/all',
          method: 'GET',
          params: { page, limit, keyword, category, isIrregular },
        };
      },
    }),

    //training
    fetchTasks: builder.query({
      query: () => '/words/tasks',
    }),
    saveUserAnswers: builder.mutation({
      query: answers => ({
        url: '/words/answers',
        method: 'POST',
        body: answers,
      }),
    }),

    //! School Management endpoints

    //teachers
    getTeachers: builder.query({
      query: () => '/school/teachers',
    }),
    getTeacherById: builder.query({
      query: id => `/teachers/${id}`,
    }),
    createTeacher: builder.mutation({
      query: newTeacher => ({
        url: '/school/teachers',
        method: 'POST',
        body: newTeacher,
      }),
    }),
    updateTeacher: builder.mutation({
      query: ({ id, updatedTeacher }) => ({
        url: `/school/teachers/${id}`,
        method: 'PATCH',
        body: updatedTeacher,
      }),
    }),
    deleteTeacher: builder.mutation({
      query: id => ({
        url: `/school/teachers/${id}`,
        method: 'DELETE',
      }),
    }),

    // classes
    getClasses: builder.query({
      query: () => '/school/classes',
    }),
    getClassById: builder.query({
      query: id => `/school/classes/${id}`,
    }),
    createClass: builder.mutation({
      query: newClass => ({
        url: '/school/classes',
        method: 'POST',
        body: newClass,
      }),
    }),
    updateClass: builder.mutation({
      query: ({ id, updatedClass }) => ({
        url: `/school/classes/${id}`,
        method: 'PATCH',
        body: updatedClass,
      }),
    }),
    deleteClass: builder.mutation({
      query: id => ({
        url: `/school/classes/${id}`,
        method: 'DELETE',
      }),
    }),

    // pupils
    getPupils: builder.query({
      query: () => '/school/pupils',
    }),
    getPupilById: builder.query({
      query: id => `/school/pupils/${id}`,
    }),
    createPupil: builder.mutation({
      query: newPupil => ({
        url: '/school/pupils',
        method: 'POST',
        body: newPupil,
      }),
    }),
    updatePupil: builder.mutation({
      query: ({ id, updatedPupil }) => ({
        url: `/school/pupils/${id}`,
        method: 'PATCH',
        body: updatedPupil,
      }),
    }),
    deletePupil: builder.mutation({
      query: id => ({
        url: `/school/pupils/${id}`,
        method: 'DELETE',
      }),
    }),

    // subjects
    getSubjects: builder.query({
      query: () => '/school/subjects',
    }),
    getSubjectById: builder.query({
      query: id => `/school/subjects/${id}`,
    }),
    createSubject: builder.mutation({
      query: newSubject => ({
        url: '/school/subjects',
        method: 'POST',
        body: newSubject,
      }),
    }),
    updateSubject: builder.mutation({
      query: ({ id, updatedSubject }) => ({
        url: `/school/subjects/${id}`,
        method: 'PATCH',
        body: updatedSubject,
      }),
    }),
    deleteSubject: builder.mutation({
      query: id => ({
        url: `/school/subjects/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetClassesQuery,
  useGetClassByIdQuery,
  useCreateClassMutation,
  useUpdateClassMutation,
  useDeleteClassMutation,
  useGetPupilsQuery,
  useGetPupilByIdQuery,
  useCreatePupilMutation,
  useUpdatePupilMutation,
  useDeletePupilMutation,
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
  useDeleteSubjectMutation,
} = apiSlice;

export const {
  useSignUpMutation,
  usePostAnswersMutation,
  useFetchTasksQuery,
  useSignInMutation,
  useGetCurrentUserQuery,
} = apiSlice;
