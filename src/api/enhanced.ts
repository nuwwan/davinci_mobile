/**
 * Hand-written customizations on top of the auto-generated `davinciApi`.
 * Anything here survives `npm run gen:api`.
 */
import { davinciApi as generated } from './generated'
import type { GetCurrentUserApiResponse, ListSubjectsApiResponse } from './generated'
import type { TUser } from '../types/user'
import {
  bootstrapFinished,
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
          // Immediately hydrate the user slice so every screen has authUser
          dispatch(davinciApi.endpoints.getCurrentUser.initiate() as any)
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
        } finally {
          dispatch(bootstrapFinished())
        }
      },
    },
    updateCurrentUser: {
      invalidatesTags: ['User'],
    },
    // After submitting an attempt invalidate the daily-question cache so
    // is_answered updates to true if re-fetched.
    createAttemptLearnerAttemptsPost: {
      invalidatesTags: ['Learner'],
    },
    readMyProfileLearnerMeGet: {
      providesTags: ['User'],
    },
    updateMyProfileLearnerMePatch: {
      invalidatesTags: ['User'],
    },
    createMyProfileLearnerMePut: {
      invalidatesTags: ['User'],
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
      providesTags: (result: ListSubjectsApiResponse | undefined) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
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
  // Learner
  useReadDailyQuestionLearnerDailyQuestionGetQuery as useGetDailyQuestionQuery,
  useLazyReadDailyQuestionLearnerDailyQuestionGetQuery as useLazyGetDailyQuestionQuery,
  useCreateAttemptLearnerAttemptsPostMutation as useSubmitAttemptMutation,
  // Learner profile
  useReadMyProfileLearnerMeGetQuery as useGetMyProfileQuery,
  useLazyReadMyProfileLearnerMeGetQuery as useLazyGetMyProfileQuery,
  useUpdateMyProfileLearnerMePatchMutation as usePatchMyProfileMutation,
  useCreateMyProfileLearnerMePutMutation as usePutMyProfileMutation,
  // Questions (admin / creator)
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
  // Learner
  ReadDailyQuestionLearnerDailyQuestionGetApiResponse as GetDailyQuestionApiResponse,
  CreateAttemptLearnerAttemptsPostApiResponse as SubmitAttemptApiResponse,
  CreateAttemptLearnerAttemptsPostApiArg as SubmitAttemptApiArg,
  DailyQuestionResponse,
  AttemptResult,
  AttemptSubmit,
  // Learner profile
  LearnerProfileResponse,
  LearnerProfilePatch,
  LearnerProfileUpdate,
  UserProfileDetail,
  LearnerProfileDetail,
  // Questions
  CreateQuestionApiArg,
  UpdateQuestionApiArg,
  DeleteQuestionApiArg,
  ListSubjectsApiArg,
  QuestionResponse,
  QuestionOption,
  QuestionExplanation,
  QuestionCreate,
  QuestionUpdate,
  QuestionStats,
  SubjectResponse,
  SubjectCreate,
  TokenResponse,
  UserCreate,
  UserLogin,
} from './generated'
