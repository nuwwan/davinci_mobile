# GET /learner/stats — Learner Stats API contract

Feeds the mobile **Stats** tab (Figma frames *H1 Stats – loading*, *H2 Stats*, *H2b Stats – scrolled*, *H3 Stats – no data*).
Client: `src/api/stats.ts` (types) → `src/features/stats/useLearnerStats.ts` (view model) → `app/(tabs)/stats.tsx`.

## Request

```
GET /learner/stats?tz=Asia/Singapore
Authorization: Bearer <access_token>
```

| Param | In | Required | Description |
|---|---|---|---|
| `tz` | query | no | IANA timezone of the device. Used to decide "today", the Mon–Sun streak week and "this month". Default `UTC`. Invalid value → `422`. |

Role: learner (any authenticated user with a learner profile).

## Response `200 OK`

```json
{
  "summary": {
    "questions_answered": 42,
    "correct_answers": 36,
    "accuracy": 0.8571,
    "total_score": 360
  },
  "streak": {
    "current": 4,
    "best": 12,
    "last_active_date": "2026-10-15",
    "week": [
      { "date": "2026-10-12", "status": "done" },
      { "date": "2026-10-13", "status": "done" },
      { "date": "2026-10-14", "status": "done" },
      { "date": "2026-10-15", "status": "done" },
      { "date": "2026-10-16", "status": "today" },
      { "date": "2026-10-17", "status": "upcoming" },
      { "date": "2026-10-18", "status": "upcoming" }
    ]
  },
  "learning_time": {
    "this_month_minutes": 128,
    "total_minutes": 940
  },
  "difficulty_preference": "medium",
  "by_subject": [
    { "subject_id": 1, "name": "Programming", "attempted": 25, "correct": 23, "accuracy": 0.92, "score": 230 },
    { "subject_id": 2, "name": "Networking",  "attempted": 9,  "correct": 7,  "accuracy": 0.7778, "score": 70 }
  ],
  "by_sub_area": [
    { "sub_area_id": 11, "subject_id": 1, "name": "Algorithms", "attempted": 12, "correct": 11, "accuracy": 0.9167, "score": 110 }
  ],
  "by_difficulty": [
    { "difficulty_level": 1, "attempted": 15, "correct": 15, "accuracy": 1.0,  "score": 150 },
    { "difficulty_level": 2, "attempted": 20, "correct": 16, "accuracy": 0.8,  "score": 160 },
    { "difficulty_level": 3, "attempted": 7,  "correct": 5,  "accuracy": 0.7143, "score": 50 }
  ],
  "generated_at": "2026-10-16T09:30:00Z"
}
```

### Fields

| Field | Type | UI (Figma) | Rule |
|---|---|---|---|
| `summary.questions_answered` | int ≥ 0 | "42 · Questions answered" tile | Distinct questions the learner has attempted. |
| `summary.correct_answers` | int ≥ 0 | "36 correct out of 42" | Of those, how many the **first** attempt got right. |
| `summary.accuracy` | float 0–1 | "86%" + progress bar | `correct_answers / questions_answered`, `0` when nothing answered. Round to 4 dp. |
| `summary.total_score` | int | "360 · Total score" tile | Sum of `score` on the counted attempts (can be negative with negative marking). |
| `streak.current` | int ≥ 0 | Streak card "4 days" | Consecutive local days ending today or yesterday with ≥ 1 daily-question attempt. Same value as `learner_profile.current_streak`. |
| `streak.best` | int ≥ 0 | "Best: 12 days" | Longest such run ever (`learner_profile.best_streak`). |
| `streak.last_active_date` | date \| null | — | Local date of the latest daily-question attempt. |
| `streak.week` | array, **exactly 7** | M T W T F S S circles | Monday → Sunday of the current local week. See statuses below. |
| `learning_time.this_month_minutes` | int ≥ 0 | "128 min · this month" | `floor(sum(time_taken_seconds) / 60)` over attempts in the current local calendar month. |
| `learning_time.total_minutes` | int ≥ 0 | — (fallback) | `learner_profile.total_learning_minutes`. |
| `difficulty_preference` | `"easy" \| "medium" \| "hard" \| "mixed"` | "Difficulty preference" pill | From `learner_profile`; default `"mixed"`. |
| `by_subject[]` | array | "By subject" rows (name · % · bar) | One item per subject with `attempted > 0`. Questions with no subject are excluded. |
| `by_sub_area[]` | array | "By sub-area" card | One item per sub-area with `attempted > 0`. |
| `by_difficulty[]` | array | "By difficulty" card (Easy/Medium/Hard/Expert/Master) | One item per `difficulty_level` (1–5) with `attempted > 0`. |
| `generated_at` | ISO-8601 UTC | — | When the aggregates were computed (useful if you cache). |

Every breakdown item shares `attempted`, `correct`, `accuracy` (0–1, 4 dp) and `score`, computed exactly like `summary` but restricted to the group.
Sort breakdown arrays by `attempted` desc, then `name` asc (`by_difficulty`: by `difficulty_level` asc). The app re-sorts anyway, so order is not critical.

### `streak.week[].status`

| Status | When | UI |
|---|---|---|
| `done` | Day ≤ today and the learner answered a daily question that day | filled teal circle with ✓ |
| `today` | Day = today and **not yet** answered | teal ring on light teal |
| `missed` | Day < today and not answered | empty grey ring |
| `upcoming` | Day > today | empty grey ring |

(If today is answered, today is `done`, not `today`.)

### Empty state (H3)

Return `200` with zeros and empty arrays — **not** 404. The app shows "No stats yet" when `summary.questions_answered == 0`.

```json
{
  "summary": { "questions_answered": 0, "correct_answers": 0, "accuracy": 0, "total_score": 0 },
  "streak": { "current": 0, "best": 0, "last_active_date": null, "week": [ "...7 items, past days 'missed', today 'today', future 'upcoming'" ] },
  "learning_time": { "this_month_minutes": 0, "total_minutes": 0 },
  "difficulty_preference": "mixed",
  "by_subject": [], "by_sub_area": [], "by_difficulty": [],
  "generated_at": "2026-10-16T09:30:00Z"
}
```

## Errors

| Status | When | App behaviour |
|---|---|---|
| `401` | Missing / expired token | Silent refresh, then retry (existing reauth flow) |
| `404` / other non-network error | Endpoint missing or failing | App derives the numbers from `/learner/attempts/history` (last 100) + `/learner/me`; dev builds show the failure reason at the bottom of the Stats tab |
| `422` | Invalid `tz` | Error state with "Try again" |
| `5xx` | Server error | Error state with "Try again" |

Never return 404 for "learner has no data" — that would trigger the fallback.

## FastAPI / Pydantic schema

```python
from datetime import date, datetime
from typing import Literal
from pydantic import BaseModel, Field

StreakDayStatus = Literal["done", "missed", "today", "upcoming"]
DifficultyPreference = Literal["easy", "medium", "hard", "mixed"]


class StatsBreakdownBase(BaseModel):
    attempted: int = Field(ge=0)
    correct: int = Field(ge=0)
    accuracy: float = Field(ge=0, le=1, description="correct / attempted, 0 when attempted = 0")
    score: int


class SubjectStat(StatsBreakdownBase):
    subject_id: int
    name: str


class SubAreaStat(StatsBreakdownBase):
    sub_area_id: int
    subject_id: int
    name: str


class DifficultyStat(StatsBreakdownBase):
    difficulty_level: int = Field(ge=1, le=5)


class StatsSummary(BaseModel):
    questions_answered: int = Field(ge=0)
    correct_answers: int = Field(ge=0)
    accuracy: float = Field(ge=0, le=1)
    total_score: int


class StreakDay(BaseModel):
    date: date
    status: StreakDayStatus


class StreakStats(BaseModel):
    current: int = Field(ge=0)
    best: int = Field(ge=0)
    last_active_date: date | None = None
    week: list[StreakDay] = Field(min_length=7, max_length=7, description="Monday → Sunday, current local week")


class LearningTimeStats(BaseModel):
    this_month_minutes: int = Field(ge=0)
    total_minutes: int = Field(ge=0)


class LearnerStatsResponse(BaseModel):
    summary: StatsSummary
    streak: StreakStats
    learning_time: LearningTimeStats
    difficulty_preference: DifficultyPreference = "mixed"
    by_subject: list[SubjectStat] = []
    by_sub_area: list[SubAreaStat] = []
    by_difficulty: list[DifficultyStat] = []
    generated_at: datetime


# router = APIRouter(prefix="/learner", tags=["Learner"])
# @router.get("/stats", response_model=LearnerStatsResponse,
#             operation_id="read_my_stats_learner_stats_get")
# async def read_my_stats(tz: str = Query("UTC"), user = Depends(get_current_learner)): ...
```

## Computation notes

- **Counted attempts** = the learner's *first* attempt per question (`DISTINCT ON (question_id) … ORDER BY question_id, created_at`). All aggregates use this set, so re-attempts can't inflate accuracy.
- Group with joins on `questions.subject_id`, `questions.sub_area_id`, `questions.difficulty_level`; names come from `subjects` / `sub_areas`.
- Convert attempt timestamps to `tz` before deriving local dates (`AT TIME ZONE :tz` in Postgres).
- Week = `monday = today - weekday(today)` … `monday + 6`, statuses per the table above.
- A single grouped query per breakdown (or one `GROUPING SETS` query) keeps this cheap; cache per learner for a few minutes if needed, and drop the cache when a new attempt is created.
- After a `POST /learner/attempts`, the app refetches this endpoint automatically (RTK tag `Stats`).

## After you ship it

1. Add the endpoint to `src/api/openapi.yaml` and run `npm run gen:api`.
2. Optionally switch `src/features/stats/useLearnerStats.ts` to the generated hook and delete `src/api/stats.ts` (field names are identical).
3. The 404 fallback can be removed once every environment has the endpoint.
