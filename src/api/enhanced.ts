/**
 * Hand-written customizations on top of the auto-generated `davinciApi`.
 * Mirror of davinci_web/src/api/enhanced.ts. Anything here survives
 * `npm run gen:api`.
 */
import { davinciApi as generated } from './generated'
import type { GetCurrentUserApiResponse } from './generated'
import type { TUser } from '../types/user'
import {
  loggedOut,
  tokensReceived,
  userReceived,
} from '../features/auth/authSlice'

export const davinciApi = generated.enhanceEndpoints({
  endpoints: {
    login: {
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(tokensReceived(data))
        } catch {
          /* noop — error surfaces via mutation result */
        }
      },
    },
    refresh: {
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled
          dispatch(tokensReceived(data))
        } catch {
          dispatch(loggedOut())
        }
      },
    },
    getCurrentUser: {
      providesTags: ['User'],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = (await queryFulfilled) as {
            data: GetCurrentUserApiResponse & { user?: TUser }
          }
          if (data?.user) dispatch(userReceived(data.user))
        } catch {
          dispatch(loggedOut())
        }
      },
    },
    updateCurrentUser: {
      invalidatesTags: ['User'],
    },

    searchQuestions: {
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Question' as const,
                id,
              })),
              { type: 'Question' as const, id: 'LIST' },
            ]
          : [{ type: 'Question' as const, id: 'LIST' }],
    },
    getQuestion: {
      providesTags: (_r, _e, arg) => [
        { type: 'Question', id: arg.questionId },
      ],
    },
    createQuestion: {
      invalidatesTags: [{ type: 'Question', id: 'LIST' }],
    },
    updateQuestion: {
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Question', id: arg.questionId },
        { type: 'Question', id: 'LIST' },
      ],
    },
    deleteQuestion: {
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Question', id: arg.questionId },
        { type: 'Question', id: 'LIST' },
      ],
    },

    listSubjects: {
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: 'Subject' as const,
                id: String(id),
              })),
              { type: 'Subject' as const, id: 'LIST' },
            ]
          : [{ type: 'Subject' as const, id: 'LIST' }],
    },
    getSubject: {
      providesTags: (_r, _e, arg) => [
        { type: 'Subject', id: String(arg.subjectId) },
      ],
    },
    createSubject: {
      invalidatesTags: [{ type: 'Subject', id: 'LIST' }],
    },
    deleteSubject: {
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Subject', id: String(arg.subjectId) },
        { type: 'Subject', id: 'LIST' },
      ],
    },
  },
})

export {
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useSearchQuestionsQuery,
  useLazySearchQuestionsQuery,
  useGetQuestionQuery,
  useLazyGetQuestionQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionStatsQuery,
  useLazyGetQuestionStatsQuery,
  useListSubjectsQuery,
  useLazyListSubjectsQuery,
  useGetSubjectQuery,
  useLazyGetSubjectQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
} from './generated'

export type {
  LoginApiArg,
  LoginApiResponse,
  RegisterApiArg,
  RegisterApiResponse,
  RefreshApiArg,
  RefreshApiResponse,
  GetCurrentUserApiResponse,
  UpdateCurrentUserApiArg,
  CreateQuestionApiArg,
  UpdateQuestionApiArg,
  DeleteQuestionApiArg,
  SearchQuestionsApiArg,
  QuestionResponse,
  QuestionCreate,
  QuestionUpdate,
  QuestionStats,
  SubjectResponse,
  SubjectCreate,
  TokenResponse,
} from './generated'
