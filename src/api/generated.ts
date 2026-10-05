import { baseApi as api } from "./baseApi";
export const addTagTypes = [
  "Admin",
  "Authentication",
  "Creator",
  "Learner",
  "Questions",
  "Catalog",
] as const;
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
      setDailyQuestionAdminDailyQuestionPost: build.mutation<
        SetDailyQuestionAdminDailyQuestionPostApiResponse,
        SetDailyQuestionAdminDailyQuestionPostApiArg
      >({
        query: () => ({ url: `/admin/daily-question`, method: "POST" }),
        invalidatesTags: ["Admin"],
      }),
      getAdminSummary: build.query<
        GetAdminSummaryApiResponse,
        GetAdminSummaryApiArg
      >({
        query: () => ({ url: `/admin/dashboard/summary` }),
        providesTags: ["Admin"],
      }),
      listCreatorQuestions: build.query<
        ListCreatorQuestionsApiResponse,
        ListCreatorQuestionsApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/questions/`,
          params: {
            search: queryArg.search,
            subject_id: queryArg.subjectId,
            sub_area_id: queryArg.subAreaId,
            difficulty_level: queryArg.difficultyLevel,
            tags: queryArg.tags,
            is_verified: queryArg.isVerified,
            is_active: queryArg.isActive,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Admin"],
      }),
      createQuestion: build.mutation<
        CreateQuestionApiResponse,
        CreateQuestionApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/questions/`,
          method: "POST",
          body: queryArg.questionCreate,
        }),
        invalidatesTags: ["Admin"],
      }),
      listAdminRewards: build.query<
        ListAdminRewardsApiResponse,
        ListAdminRewardsApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/rewards/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Admin"],
      }),
      createReward: build.mutation<CreateRewardApiResponse, CreateRewardApiArg>(
        {
          query: (queryArg) => ({
            url: `/admin/rewards/`,
            method: "POST",
            body: queryArg.rewardCreate,
          }),
          invalidatesTags: ["Admin"],
        },
      ),
      listAdminSubAreas: build.query<
        ListAdminSubAreasApiResponse,
        ListAdminSubAreasApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/sub-areas/`,
          params: {
            search: queryArg.search,
            is_active: queryArg.isActive,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Admin"],
      }),
      createSubArea: build.mutation<
        CreateSubAreaApiResponse,
        CreateSubAreaApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/sub-areas/`,
          method: "POST",
          body: queryArg.subAreaCreate,
        }),
        invalidatesTags: ["Admin"],
      }),
      getSubAreasBySubjectId: build.query<
        GetSubAreasBySubjectIdApiResponse,
        GetSubAreasBySubjectIdApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/sub-areas/by-subject/${queryArg.subjectId}`,
        }),
        providesTags: ["Admin"],
      }),
      listAdminSubjects: build.query<
        ListAdminSubjectsApiResponse,
        ListAdminSubjectsApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/subjects/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Admin"],
      }),
      createSubject: build.mutation<
        CreateSubjectApiResponse,
        CreateSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/subjects/`,
          method: "POST",
          body: queryArg.subjectCreate,
        }),
        invalidatesTags: ["Admin"],
      }),
      deleteSubject: build.mutation<
        DeleteSubjectApiResponse,
        DeleteSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/admin/subjects/${queryArg.subjectId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Admin"],
      }),
      getSubject: build.query<GetSubjectApiResponse, GetSubjectApiArg>({
        query: (queryArg) => ({ url: `/admin/subjects/${queryArg.subjectId}` }),
        providesTags: ["Admin"],
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
      listCreatorSubAreas: build.query<
        ListCreatorSubAreasApiResponse,
        ListCreatorSubAreasApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/sub-areas/`,
          params: {
            search: queryArg.search,
            subject_id: queryArg.subjectId,
          },
        }),
        providesTags: ["Creator"],
      }),
      creatorSubscribeToSubArea: build.mutation<
        CreatorSubscribeToSubAreaApiResponse,
        CreatorSubscribeToSubAreaApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/sub-areas/${queryArg.subAreaId}/subscribe`,
          method: "POST",
        }),
        invalidatesTags: ["Creator"],
      }),
      creatorUnsubscribeFromSubArea: build.mutation<
        CreatorUnsubscribeFromSubAreaApiResponse,
        CreatorUnsubscribeFromSubAreaApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/sub-areas/${queryArg.subAreaId}/unsubscribe`,
          method: "POST",
        }),
        invalidatesTags: ["Creator"],
      }),
      listCreatorSubjects: build.query<
        ListCreatorSubjectsApiResponse,
        ListCreatorSubjectsApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/subjects/`,
          params: {
            search: queryArg.search,
          },
        }),
        providesTags: ["Creator"],
      }),
      creatorSubscribeToSubject: build.mutation<
        CreatorSubscribeToSubjectApiResponse,
        CreatorSubscribeToSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/subjects/${queryArg.subjectId}/subscribe`,
          method: "POST",
        }),
        invalidatesTags: ["Creator"],
      }),
      creatorUnsubscribeFromSubject: build.mutation<
        CreatorUnsubscribeFromSubjectApiResponse,
        CreatorUnsubscribeFromSubjectApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/subjects/${queryArg.subjectId}/unsubscribe`,
          method: "POST",
        }),
        invalidatesTags: ["Creator"],
      }),
      listCreatorTags: build.query<
        ListCreatorTagsApiResponse,
        ListCreatorTagsApiArg
      >({
        query: (queryArg) => ({
          url: `/creator/tags/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Creator"],
      }),
      createTag: build.mutation<CreateTagApiResponse, CreateTagApiArg>({
        query: (queryArg) => ({
          url: `/creator/tags/`,
          method: "POST",
          body: queryArg.tagCreate,
        }),
        invalidatesTags: ["Creator"],
      }),
      listAllTags: build.query<ListAllTagsApiResponse, ListAllTagsApiArg>({
        query: (queryArg) => ({
          url: `/creator/tags/all/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Creator"],
      }),
      createAttemptLearnerAttemptsPost: build.mutation<
        CreateAttemptLearnerAttemptsPostApiResponse,
        CreateAttemptLearnerAttemptsPostApiArg
      >({
        query: (queryArg) => ({
          url: `/learner/attempts`,
          method: "POST",
          body: queryArg.attemptSubmit,
        }),
        invalidatesTags: ["Learner"],
      }),
      getAttemptHistoryLearnerAttemptsHistoryGet: build.query<
        GetAttemptHistoryLearnerAttemptsHistoryGetApiResponse,
        GetAttemptHistoryLearnerAttemptsHistoryGetApiArg
      >({
        query: (queryArg) => ({
          url: `/learner/attempts/history`,
          params: {
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Learner"],
      }),
      readDailyQuestionLearnerDailyQuestionGet: build.query<
        ReadDailyQuestionLearnerDailyQuestionGetApiResponse,
        ReadDailyQuestionLearnerDailyQuestionGetApiArg
      >({
        query: () => ({ url: `/learner/daily-question` }),
        providesTags: ["Learner"],
      }),
      readMyProfileLearnerMeGet: build.query<
        ReadMyProfileLearnerMeGetApiResponse,
        ReadMyProfileLearnerMeGetApiArg
      >({
        query: () => ({ url: `/learner/me` }),
        providesTags: ["Learner"],
      }),
      updateMyProfileLearnerMePatch: build.mutation<
        UpdateMyProfileLearnerMePatchApiResponse,
        UpdateMyProfileLearnerMePatchApiArg
      >({
        query: (queryArg) => ({
          url: `/learner/me`,
          method: "PATCH",
          body: queryArg.learnerProfilePatch,
        }),
        invalidatesTags: ["Learner"],
      }),
      createMyProfileLearnerMePut: build.mutation<
        CreateMyProfileLearnerMePutApiResponse,
        CreateMyProfileLearnerMePutApiArg
      >({
        query: (queryArg) => ({
          url: `/learner/me`,
          method: "PUT",
          body: queryArg.learnerProfileUpdate,
        }),
        invalidatesTags: ["Learner"],
      }),
      listMySubAreasLearnerSubscriptionsSubAreasGet: build.query<
        ListMySubAreasLearnerSubscriptionsSubAreasGetApiResponse,
        ListMySubAreasLearnerSubscriptionsSubAreasGetApiArg
      >({
        query: () => ({ url: `/learner/subscriptions/sub-areas` }),
        providesTags: ["Learner"],
      }),
      unsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDelete:
        build.mutation<
          UnsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDeleteApiResponse,
          UnsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDeleteApiArg
        >({
          query: (queryArg) => ({
            url: `/learner/subscriptions/sub-areas/${queryArg.subAreaId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Learner"],
        }),
      subscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPost:
        build.mutation<
          SubscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPostApiResponse,
          SubscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPostApiArg
        >({
          query: (queryArg) => ({
            url: `/learner/subscriptions/sub-areas/${queryArg.subAreaId}`,
            method: "POST",
          }),
          invalidatesTags: ["Learner"],
        }),
      listMySubjectsLearnerSubscriptionsSubjectsGet: build.query<
        ListMySubjectsLearnerSubscriptionsSubjectsGetApiResponse,
        ListMySubjectsLearnerSubscriptionsSubjectsGetApiArg
      >({
        query: () => ({ url: `/learner/subscriptions/subjects` }),
        providesTags: ["Learner"],
      }),
      unsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDelete:
        build.mutation<
          UnsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDeleteApiResponse,
          UnsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDeleteApiArg
        >({
          query: (queryArg) => ({
            url: `/learner/subscriptions/subjects/${queryArg.subjectId}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Learner"],
        }),
      subscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPost:
        build.mutation<
          SubscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPostApiResponse,
          SubscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPostApiArg
        >({
          query: (queryArg) => ({
            url: `/learner/subscriptions/subjects/${queryArg.subjectId}`,
            method: "POST",
          }),
          invalidatesTags: ["Learner"],
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
      listRewards: build.query<ListRewardsApiResponse, ListRewardsApiArg>({
        query: (queryArg) => ({
          url: `/v0/rewards/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalog"],
      }),
      listSubjects: build.query<ListSubjectsApiResponse, ListSubjectsApiArg>({
        query: (queryArg) => ({
          url: `/v0/subjects/`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalog"],
      }),
      listSubjectSubAreas: build.query<
        ListSubjectSubAreasApiResponse,
        ListSubjectSubAreasApiArg
      >({
        query: (queryArg) => ({
          url: `/v0/subjects/${queryArg.subjectId}/sub-areas`,
          params: {
            search: queryArg.search,
            page: queryArg.page,
            page_size: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalog"],
      }),
    }),
    overrideExisting: true,
  });
export { injectedRtkApi as davinciApi };
export type ReadRootGetApiResponse = /** status 200 Successful Response */ any;
export type ReadRootGetApiArg = void;
export type SetDailyQuestionAdminDailyQuestionPostApiResponse =
  /** status 201 Successful Response */ AdminDailyQuestionResponse;
export type SetDailyQuestionAdminDailyQuestionPostApiArg = void;
export type GetAdminSummaryApiResponse =
  /** status 200 Successful Response */ CreatorSummaryResponse;
export type GetAdminSummaryApiArg = void;
export type ListCreatorQuestionsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseQuestionResponse;
export type ListCreatorQuestionsApiArg = {
  /** Case-insensitive title search */
  search?: string | null;
  subjectId?: number | null;
  subAreaId?: number | null;
  difficultyLevel?: number | null;
  tags?: string[] | null;
  isVerified?: boolean | null;
  isActive?: boolean | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type CreateQuestionApiResponse =
  /** status 201 Successful Response */ QuestionResponse;
export type CreateQuestionApiArg = {
  questionCreate: QuestionCreate;
};
export type ListAdminRewardsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseRewardResponse;
export type ListAdminRewardsApiArg = {
  /** Case-insensitive title search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type CreateRewardApiResponse =
  /** status 201 Successful Response */ RewardResponse;
export type CreateRewardApiArg = {
  rewardCreate: RewardCreate;
};
export type ListAdminSubAreasApiResponse =
  /** status 200 Successful Response */ PaginatedResponseAdminSubAreaResponse;
export type ListAdminSubAreasApiArg = {
  /** Case-insensitive search on title or subject name */
  search?: string | null;
  /** Filter by active status */
  isActive?: boolean | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type CreateSubAreaApiResponse =
  /** status 201 Successful Response */ SubAreaResponse;
export type CreateSubAreaApiArg = {
  subAreaCreate: SubAreaCreate;
};
export type GetSubAreasBySubjectIdApiResponse =
  /** status 200 Successful Response */ SubAreaResponse[];
export type GetSubAreasBySubjectIdApiArg = {
  subjectId: number;
};
export type ListAdminSubjectsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseSubjectResponse;
export type ListAdminSubjectsApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
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
export type ListCreatorSubAreasApiResponse =
  /** status 200 Successful Response */ SubAreaResponse[];
export type ListCreatorSubAreasApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
  /** Filter by parent subject */
  subjectId?: number | null;
};
export type CreatorSubscribeToSubAreaApiResponse =
  /** status 201 Successful Response */ CreatorSubAreaSubscriptionResponse;
export type CreatorSubscribeToSubAreaApiArg = {
  subAreaId: number;
};
export type CreatorUnsubscribeFromSubAreaApiResponse =
  /** status 200 Successful Response */ CreatorSubAreaSubscriptionResponse;
export type CreatorUnsubscribeFromSubAreaApiArg = {
  subAreaId: number;
};
export type ListCreatorSubjectsApiResponse =
  /** status 200 Successful Response */ SubjectResponse[];
export type ListCreatorSubjectsApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
};
export type CreatorSubscribeToSubjectApiResponse =
  /** status 201 Successful Response */ CreatorSubjectSubscriptionResponse;
export type CreatorSubscribeToSubjectApiArg = {
  subjectId: number;
};
export type CreatorUnsubscribeFromSubjectApiResponse =
  /** status 200 Successful Response */ CreatorSubjectSubscriptionResponse;
export type CreatorUnsubscribeFromSubjectApiArg = {
  subjectId: number;
};
export type ListCreatorTagsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseTagResponse;
export type ListCreatorTagsApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type CreateTagApiResponse =
  /** status 201 Successful Response */ TagResponse;
export type CreateTagApiArg = {
  tagCreate: TagCreate;
};
export type ListAllTagsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseTagResponse;
export type ListAllTagsApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type CreateAttemptLearnerAttemptsPostApiResponse =
  /** status 201 Successful Response */ AttemptResult;
export type CreateAttemptLearnerAttemptsPostApiArg = {
  attemptSubmit: AttemptSubmit;
};
export type GetAttemptHistoryLearnerAttemptsHistoryGetApiResponse =
  /** status 200 Successful Response */ PaginatedResponseAttemptHistoryItem;
export type GetAttemptHistoryLearnerAttemptsHistoryGetApiArg = {
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type ReadDailyQuestionLearnerDailyQuestionGetApiResponse =
  /** status 200 Successful Response */ DailyQuestionResponse;
export type ReadDailyQuestionLearnerDailyQuestionGetApiArg = void;
export type ReadMyProfileLearnerMeGetApiResponse =
  /** status 200 Successful Response */ LearnerProfileResponse;
export type ReadMyProfileLearnerMeGetApiArg = void;
export type UpdateMyProfileLearnerMePatchApiResponse =
  /** status 200 Successful Response */ LearnerProfileResponse;
export type UpdateMyProfileLearnerMePatchApiArg = {
  learnerProfilePatch: LearnerProfilePatch;
};
export type CreateMyProfileLearnerMePutApiResponse =
  /** status 200 Successful Response */ LearnerProfileResponse;
export type CreateMyProfileLearnerMePutApiArg = {
  learnerProfileUpdate: LearnerProfileUpdate;
};
export type ListMySubAreasLearnerSubscriptionsSubAreasGetApiResponse =
  /** status 200 Successful Response */ SubAreaSubscriptionResponse[];
export type ListMySubAreasLearnerSubscriptionsSubAreasGetApiArg = void;
export type UnsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type UnsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDeleteApiArg =
  {
    subAreaId: number;
  };
export type SubscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPostApiResponse =
  /** status 201 Successful Response */ SubAreaSubscriptionResponse;
export type SubscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPostApiArg =
  {
    subAreaId: number;
  };
export type ListMySubjectsLearnerSubscriptionsSubjectsGetApiResponse =
  /** status 200 Successful Response */ SubjectSubscriptionResponse[];
export type ListMySubjectsLearnerSubscriptionsSubjectsGetApiArg = void;
export type UnsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDeleteApiResponse =
  /** status 200 Successful Response */ any;
export type UnsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDeleteApiArg =
  {
    subjectId: number;
  };
export type SubscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPostApiResponse =
  /** status 201 Successful Response */ SubjectSubscriptionResponse;
export type SubscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPostApiArg =
  {
    subjectId: number;
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
export type ListRewardsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseRewardResponse;
export type ListRewardsApiArg = {
  /** Case-insensitive title search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type ListSubjectsApiResponse =
  /** status 200 Successful Response */ PaginatedResponseSubjectResponse;
export type ListSubjectsApiArg = {
  /** Case-insensitive name search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type ListSubjectSubAreasApiResponse =
  /** status 200 Successful Response */ PaginatedResponseSubAreaResponse;
export type ListSubjectSubAreasApiArg = {
  subjectId: number;
  /** Case-insensitive name search */
  search?: string | null;
  /** Page number */
  page?: number;
  /** Number of items per page */
  pageSize?: number;
};
export type AdminDailyQuestionResponse = {
  daily_question_id: string;
  delivered_date: string;
  message: string;
  question_id: string;
};
export type CreatorSummaryResponse = {
  question_attempts: number;
  question_likes: number;
  questions_count: number;
  tags_count: number;
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
export type QuestionResponse = {
  content?: QuestionContent | null;
  correct_answer_index: number;
  created_at: string;
  creator_id?: string | null;
  difficulty_level: number;
  explanation?: QuestionExplanation | null;
  id: string;
  is_active: boolean;
  is_verified: boolean;
  options: QuestionOption[];
  reward_id?: string | null;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[];
  title: string;
  updated_at: string;
};
export type PaginatedResponseQuestionResponse = {
  items: QuestionResponse[];
  page: number;
  page_size: number;
  total: number;
};
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
};
export type HttpValidationError = {
  detail?: ValidationError[];
};
export type QuestionCreate = {
  content?: QuestionContent | null;
  correct_answer_index: number;
  difficulty_level: number;
  explanation?: QuestionExplanation | null;
  options: QuestionOption[];
  reward_id?: string | null;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[];
  title: string;
};
export type RewardResponse = {
  created_at: string;
  creator_id?: string | null;
  description?: string | null;
  id: string;
  negative_marks: number;
  reward_amount: number;
  title: string;
};
export type PaginatedResponseRewardResponse = {
  items: RewardResponse[];
  page: number;
  page_size: number;
  total: number;
};
export type RewardCreate = {
  description?: string | null;
  negative_marks?: number;
  reward_amount: number;
  title: string;
};
export type AdminSubAreaResponse = {
  created_at: string;
  description?: string | null;
  id: number;
  is_active: boolean;
  subject_id: number;
  subject_name: string;
  title: string;
};
export type PaginatedResponseAdminSubAreaResponse = {
  items: AdminSubAreaResponse[];
  page: number;
  page_size: number;
  total: number;
};
export type SubAreaResponse = {
  created_at: string;
  creator_id?: string | null;
  description?: string | null;
  display_order: number;
  id: number;
  is_active: boolean;
  name: string;
  subject_id: number;
};
export type SubAreaCreate = {
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
  name: string;
  subject_id: number;
};
export type SubjectResponse = {
  created_at: string;
  creator_id?: string | null;
  description?: string | null;
  id: number;
  name: string;
};
export type PaginatedResponseSubjectResponse = {
  items: SubjectResponse[];
  page: number;
  page_size: number;
  total: number;
};
export type SubjectCreate = {
  description?: string | null;
  name: string;
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
export type CreatorSubAreaSubscriptionResponse = {
  is_active: boolean;
  sub_area: SubAreaResponse;
  subscribed_at: string;
  subscription_id: string;
};
export type CreatorSubjectSubscriptionResponse = {
  is_active: boolean;
  subject: SubjectResponse;
  subscribed_at: string;
  subscription_id: string;
};
export type TagResponse = {
  created_at: string;
  creator_id?: string | null;
  description?: string | null;
  id: number;
  name: string;
  usage_count: number;
};
export type PaginatedResponseTagResponse = {
  items: TagResponse[];
  page: number;
  page_size: number;
  total: number;
};
export type TagCreate = {
  description?: string | null;
  name: string;
};
export type AttemptResult = {
  attempt_id: string;
  correct_answer_index: number;
  explanation?: any | null;
  is_correct: boolean;
  question_id: string;
  /** Points awarded (positive) or deducted (negative/zero) */
  score: number;
  selected_option_index: number;
};
export type AttemptSubmit = {
  question_id: string;
  /** 0-based index of the chosen option */
  selected_option_index: number;
};
export type AttemptHistoryItem = {
  attempt_id: string;
  attempted_at: any;
  correct_answer_index: number;
  is_correct: boolean;
  question_id: string;
  question_title: string;
  score?: number | null;
  selected_option_index: number;
  time_taken_seconds?: number | null;
};
export type PaginatedResponseAttemptHistoryItem = {
  items: AttemptHistoryItem[];
  page: number;
  page_size: number;
  total: number;
};
export type DailyQuestionResponse = {
  daily_question_id: string;
  delivered_date: string;
  is_answered: boolean;
  question: QuestionResponse;
};
export type LearnerProfileDetail = {
  best_streak?: number;
  current_streak?: number;
  difficulty_preference?: string;
  notification_frequency?: string;
  preferred_language?: string;
  total_learning_minutes?: number;
};
export type UserProfileDetail = {
  avatar_url?: string | null;
  bio?: string | null;
  first_name?: string | null;
  institution?: string | null;
  is_public_profile?: boolean;
  last_name?: string | null;
  location?: string | null;
  phone?: string | null;
  social_links?: string | null;
};
export type LearnerProfileResponse = {
  created_at: string;
  email: string;
  id: string;
  is_active: boolean;
  learner_profile?: LearnerProfileDetail | null;
  profile?: UserProfileDetail | null;
  role: string;
};
export type LearnerProfilePatch = {
  difficulty_preference?: ("easy" | "medium" | "hard" | "mixed") | null;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
};
export type LearnerProfileUpdate = {
  difficulty_preference?: "easy" | "medium" | "hard" | "mixed";
  email: string;
  first_name: string;
  last_name: string;
};
export type SubAreaSubscriptionResponse = {
  created_at: string;
  end_date?: string | null;
  id: string;
  is_active: boolean;
  start_date: string;
  sub_area_id: number;
  user_id: string;
};
export type SubjectSubscriptionResponse = {
  created_at: string;
  end_date?: string | null;
  id: string;
  is_active: boolean;
  start_date: string;
  subject_id: number;
  user_id: string;
};
export type QuestionUpdate = {
  content?: QuestionContent | null;
  correct_answer_index?: number | null;
  difficulty_level?: number | null;
  explanation?: QuestionExplanation | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  options?: QuestionOption[] | null;
  reward_id?: string | null;
  sub_area_id?: number | null;
  subject_id?: number | null;
  tags?: string[] | null;
  title?: string | null;
};
export type QuestionStats = {
  accuracy?: number | null;
  average_rating?: number | null;
  average_time_seconds?: number | null;
  correct_attempts?: number;
  total_attempts?: number;
};
export type PaginatedResponseSubAreaResponse = {
  items: SubAreaResponse[];
  page: number;
  page_size: number;
  total: number;
};
export const {
  useReadRootGetQuery,
  useLazyReadRootGetQuery,
  useSetDailyQuestionAdminDailyQuestionPostMutation,
  useGetAdminSummaryQuery,
  useLazyGetAdminSummaryQuery,
  useListCreatorQuestionsQuery,
  useLazyListCreatorQuestionsQuery,
  useCreateQuestionMutation,
  useListAdminRewardsQuery,
  useLazyListAdminRewardsQuery,
  useCreateRewardMutation,
  useListAdminSubAreasQuery,
  useLazyListAdminSubAreasQuery,
  useCreateSubAreaMutation,
  useGetSubAreasBySubjectIdQuery,
  useLazyGetSubAreasBySubjectIdQuery,
  useListAdminSubjectsQuery,
  useLazyListAdminSubjectsQuery,
  useCreateSubjectMutation,
  useDeleteSubjectMutation,
  useGetSubjectQuery,
  useLazyGetSubjectQuery,
  useRequestActivationMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useLoginMutation,
  useRefreshMutation,
  useRegisterMutation,
  useUpdateCurrentUserMutation,
  useVerifyEmailQuery,
  useLazyVerifyEmailQuery,
  useListCreatorSubAreasQuery,
  useLazyListCreatorSubAreasQuery,
  useCreatorSubscribeToSubAreaMutation,
  useCreatorUnsubscribeFromSubAreaMutation,
  useListCreatorSubjectsQuery,
  useLazyListCreatorSubjectsQuery,
  useCreatorSubscribeToSubjectMutation,
  useCreatorUnsubscribeFromSubjectMutation,
  useListCreatorTagsQuery,
  useLazyListCreatorTagsQuery,
  useCreateTagMutation,
  useListAllTagsQuery,
  useLazyListAllTagsQuery,
  useCreateAttemptLearnerAttemptsPostMutation,
  useGetAttemptHistoryLearnerAttemptsHistoryGetQuery,
  useLazyGetAttemptHistoryLearnerAttemptsHistoryGetQuery,
  useReadDailyQuestionLearnerDailyQuestionGetQuery,
  useLazyReadDailyQuestionLearnerDailyQuestionGetQuery,
  useReadMyProfileLearnerMeGetQuery,
  useLazyReadMyProfileLearnerMeGetQuery,
  useUpdateMyProfileLearnerMePatchMutation,
  useCreateMyProfileLearnerMePutMutation,
  useListMySubAreasLearnerSubscriptionsSubAreasGetQuery,
  useLazyListMySubAreasLearnerSubscriptionsSubAreasGetQuery,
  useUnsubscribeFromSubAreaLearnerSubscriptionsSubAreasSubAreaIdDeleteMutation,
  useSubscribeToSubAreaLearnerSubscriptionsSubAreasSubAreaIdPostMutation,
  useListMySubjectsLearnerSubscriptionsSubjectsGetQuery,
  useLazyListMySubjectsLearnerSubscriptionsSubjectsGetQuery,
  useUnsubscribeFromSubjectLearnerSubscriptionsSubjectsSubjectIdDeleteMutation,
  useSubscribeToSubjectLearnerSubscriptionsSubjectsSubjectIdPostMutation,
  useDeleteQuestionMutation,
  useGetQuestionQuery,
  useLazyGetQuestionQuery,
  useUpdateQuestionMutation,
  useGetQuestionStatsQuery,
  useLazyGetQuestionStatsQuery,
  useListRewardsQuery,
  useLazyListRewardsQuery,
  useListSubjectsQuery,
  useLazyListSubjectsQuery,
  useListSubjectSubAreasQuery,
  useLazyListSubjectSubAreasQuery,
} = injectedRtkApi;
