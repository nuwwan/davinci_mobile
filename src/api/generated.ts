import { baseApi as api } from "./baseApi";
export const addTagTypes = ["Authentication", "Questions", "Subjects"] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      readRootGet: build.query<ReadRootGetApiResponse, ReadRootGetApiArg>({
        query: () => ({ url: `/` }),
        providesTags: [],
      }),
      requestActivation: build.mutation<
        RequestActivationApiResponse,
        RequestActivationApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/activate`,
          method: "POST",
          params: {
            email: queryArg.email,
          },
        }),
        invalidatesTags: ["Authentication"],
      }),
      getCurrentUser: build.query<
        GetCurrentUserApiResponse,
        GetCurrentUserApiArg
      >({
        query: () => ({ url: `/auth/get_user` }),
        providesTags: ["Authentication"],
      }),
      login: build.mutation<LoginApiResponse, LoginApiArg>({
        query: (queryArg) => ({
          url: `/auth/login`,
          method: "POST",
          body: queryArg.userLogin,
        }),
        invalidatesTags: ["Authentication"],
      }),
      refresh: build.mutation<RefreshApiResponse, RefreshApiArg>({
        query: (queryArg) => ({
          url: `/auth/refresh`,
          method: "POST",
          body: queryArg.refreshRequest,
        }),
        invalidatesTags: ["Authentication"],
      }),
      register: build.mutation<RegisterApiResponse, RegisterApiArg>({
        query: (queryArg) => ({
          url: `/auth/register`,
          method: "POST",
          body: queryArg.userCreate,
        }),
        invalidatesTags: ["Authentication"],
      }),
      updateCurrentUser: build.mutation<
        UpdateCurrentUserApiResponse,
        UpdateCurrentUserApiArg
      >({
        query: (queryArg) => ({
          url: `/auth/update_user`,
          method: "POST",
          body: queryArg.userUpdate,
        }),
        invalidatesTags: ["Authentication"],
      }),
      verifyEmail: build.query<VerifyEmailApiResponse, VerifyEmailApiArg>({
        query: (queryArg) => ({
          url: `/auth/verify-email`,
          params: {
            token: queryArg.token,
          },
        }),
        providesTags: ["Authentication"],
      }),
      searchQuestions: build.query<
        SearchQuestionsApiResponse,
        SearchQuestionsApiArg
      >({
        query: (queryArg) => ({
          url: `/questions/`,
          params: {
            subject_id: queryArg.subjectId,
            sub_area_id: queryArg.subAreaId,
            creator_id: queryArg.creatorId,
            difficulty_level: queryArg.difficultyLevel,
            tags: queryArg.tags,
            is_verified: queryArg.isVerified,
            is_active: queryArg.isActive,
            skip: queryArg.skip,
            limit: queryArg.limit,
          },
        }),
        providesTags: ["Questions"],
      }),
      createQuestion: build.mutation<
        CreateQuestionApiResponse,
        CreateQuestionApiArg
      >({
        query: (queryArg) => ({
          url: `/questions/`,
          method: "POST",
          body: queryArg.questionCreate,
        }),
        invalidatesTags: ["Questions"],
      }),
      deleteQuestion: build.mutation<
        DeleteQuestionApiResponse,
        DeleteQuestionApiArg
      >({
        query: (queryArg) => ({
          url: `/questions/${queryArg.questionId}`,
          method: "DELETE",
          params: {
            hard: queryArg.hard,
          },
        }),
        invalidatesTags: ["Questions"],
      }),
      getQuestion: build.query<GetQuestionApiResponse, GetQuestionApiArg>({
        query: (queryArg) => ({ url: `/questions/${queryArg.questionId}` }),
        providesTags: ["Questions"],
      }),
      updateQuestion: build.mutation<
        UpdateQuestionApiResponse,
        UpdateQuestionApiArg
      >({
        query: (queryArg) => ({
          url: `/questions/${queryArg.questionId}`,
          method: "PUT",
          body: queryArg.questionUpdate,
        }),
        invalidatesTags: ["Questions"],
      }),
      getQuestionStats: build.query<
        GetQuestionStatsApiResponse,
        GetQuestionStatsApiArg
      >({
        query: (queryArg) => ({
          url: `/questions/${queryArg.questionId}/stats`,
        }),
        providesTags: ["Questions"],
      }),
      listSubjects: build.query<ListSubjectsApiResponse, ListSubjectsApiArg>({
        query: () => ({ url: `/subjects/` }),
        providesTags: ["Subjects"],
      }),
      createSubject: build.mutation<
        CreateSubjectApiResponse,
        CreateSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/subjects/`,
          method: "POST",
          body: queryArg.subjectCreate,
        }),
        invalidatesTags: ["Subjects"],
      }),
      deleteSubject: build.mutation<
        DeleteSubjectApiResponse,
        DeleteSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/subjects/${queryArg.subjectId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Subjects"],
      }),
      getSubject: build.query<GetSubjectApiResponse, GetSubjectApiArg>({
        query: (queryArg) => ({ url: `/subjects/${queryArg.subjectId}` }),
        providesTags: ["Subjects"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as davinciApi };
export type ReadRootGetApiResponse = /** status 200 Successful Response */ any;
export type ReadRootGetApiArg = void;
export type RequestActivationApiResponse =
  /** status 200 Successful Response */ any;
export type RequestActivationApiArg = {
  email: string;
};
export type GetCurrentUserApiResponse =
  /** status 200 Successful Response */ any;
export type GetCurrentUserApiArg = void;
export type LoginApiResponse =
  /** status 200 Successful Response */ TokenResponse;
export type LoginApiArg = {
  userLogin: UserLogin;
};
export type RefreshApiResponse =
  /** status 200 Successful Response */ TokenResponse;
export type RefreshApiArg = {
  refreshRequest: RefreshRequest;
};
export type RegisterApiResponse = /** status 201 Successful Response */ any;
export type RegisterApiArg = {
  userCreate: UserCreate;
};
export type UpdateCurrentUserApiResponse =
  /** status 200 Successful Response */ any;
export type UpdateCurrentUserApiArg = {
  userUpdate: UserUpdate;
};
export type VerifyEmailApiResponse = /** status 200 Successful Response */ any;
export type VerifyEmailApiArg = {
  token: string;
};
export type SearchQuestionsApiResponse =
  /** status 200 Successful Response */ QuestionResponse[];
export type SearchQuestionsApiArg = {
  subjectId?: number | null;
  subAreaId?: number | null;
  creatorId?: string | null;
  difficultyLevel?: number | null;
  tags?: string[] | null;
  isVerified?: boolean | null;
  isActive?: boolean | null;
  skip?: number;
  limit?: number;
};
export type CreateQuestionApiResponse =
  /** status 201 Successful Response */ QuestionResponse;
export type CreateQuestionApiArg = {
  questionCreate: QuestionCreate;
};
export type DeleteQuestionApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteQuestionApiArg = {
  questionId: string;
  /** Permanently delete instead of soft-deactivate (admin only) */
  hard?: boolean;
};
export type GetQuestionApiResponse =
  /** status 200 Successful Response */ QuestionResponse;
export type GetQuestionApiArg = {
  questionId: string;
};
export type UpdateQuestionApiResponse =
  /** status 200 Successful Response */ QuestionResponse;
export type UpdateQuestionApiArg = {
  questionId: string;
  questionUpdate: QuestionUpdate;
};
export type GetQuestionStatsApiResponse =
  /** status 200 Successful Response */ QuestionStats;
export type GetQuestionStatsApiArg = {
  questionId: string;
};
export type ListSubjectsApiResponse =
  /** status 200 Successful Response */ SubjectResponse[];
export type ListSubjectsApiArg = void;
export type CreateSubjectApiResponse =
  /** status 201 Successful Response */ SubjectResponse;
export type CreateSubjectApiArg = {
  subjectCreate: SubjectCreate;
};
export type DeleteSubjectApiResponse =
  /** status 200 Successful Response */ any;
export type DeleteSubjectApiArg = {
  subjectId: number;
};
export type GetSubjectApiResponse =
  /** status 200 Successful Response */ SubjectResponse;
export type GetSubjectApiArg = {
  subjectId: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token?: string | null;
  token_type?: string;
};
export type UserLogin = {
  email: string;
  password: string;
};
export type RefreshRequest = {
  refresh_token: string;
};
export type UserCreate = {
  email: string;
  first_name: string;
  last_name: string | null;
  password: string;
};
export type UserUpdate = {
  first_name: string | null;
  last_name: string | null;
};
export type QuestionContent = {
  alt_text?: string | null;
  image_url?: string | null;
  media_type?: string;
  text?: string | null;
};
export type QuestionExplanation = {
  alt_text?: string | null;
  image_url?: string | null;
  text?: string | null;
};
export type QuestionOption = {
  alt_text?: string | null;
  image_url?: string | null;
  index: number;
  text?: string | null;
};
export type QuestionScoring = {
  marks?: number;
  negative_marks?: number;
};
export type QuestionResponse = {
  content: QuestionContent;
  correct_answer_index: number;
  created_at: string;
  creator_id?: string | null;
  difficulty_level: number;
  explanation?: QuestionExplanation | null;
  id: string;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
  scoring: QuestionScoring;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[];
  updated_at: string;
};
export type QuestionCreate = {
  content: QuestionContent;
  correct_answer_index: number;
  difficulty_level: number;
  explanation?: QuestionExplanation | null;
  options: QuestionOption[];
  scoring?: QuestionScoring;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[];
};
export type QuestionUpdate = {
  content?: QuestionContent | null;
  correct_answer_index?: number | null;
  difficulty_level?: number | null;
  explanation?: QuestionExplanation | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  options?: QuestionOption[] | null;
  scoring?: QuestionScoring | null;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[] | null;
};
export type QuestionStats = {
  accuracy?: number | null;
  average_rating?: number | null;
  average_time_seconds?: number | null;
  correct_attempts?: number;
  total_attempts?: number;
};
export type SubjectResponse = {
  description?: string | null;
  id: number;
  name: string;
};
export type SubjectCreate = {
  description?: string | null;
  name: string;
};
export const {
  useReadRootGetQuery,
  useLazyReadRootGetQuery,
  useRequestActivationMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useUpdateCurrentUserMutation,
  useVerifyEmailQuery,
  useLazyVerifyEmailQuery,
  useSearchQuestionsQuery,
  useLazySearchQuestionsQuery,
  useCreateQuestionMutation,
  useDeleteQuestionMutation,
  useGetQuestionQuery,
  useLazyGetQuestionQuery,
  useUpdateQuestionMutation,
  useGetQuestionStatsQuery,
  useLazyGetQuestionStatsQuery,
  useListSubjectsQuery,
  useLazyListSubjectsQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSubjectQuery,
  useLazyGetSubjectQuery,
} = injectedRtkApi;
