# Learner catalog API — Questions tab

Feeds the mobile **Questions** tab (Figma page *3 Questions & Subjects*, frames **Q1–Q11**):
Subjects → Topics (= sub-areas) → Questions by difficulty.
Client: `src/api/catalog.ts` → screens in `app/(tabs)/questions/`.

All endpoints: `Authorization: Bearer <access_token>`, learner role, JSON. Only **active** subjects/topics and
**active + verified** questions are returned. Pagination uses the existing shape `{ items, page, page_size, total }`
(`page` ≥ 1, `page_size` 1–100).

| # | Method & path | Screen |
|---|---|---|
| 1 | `GET /learner/catalog/subjects` | Q1 Subjects grid |
| 2 | `GET /learner/catalog/search?q=` | Q2 / Q3 search |
| 3 | `GET /learner/catalog/subjects/{subject_id}` | Q4 / Q5 subject card |
| 4 | `GET /learner/catalog/subjects/{subject_id}/topics?search=` | Q4 / Q5 / Q6 topic list + topic search |
| 5 | `GET /learner/catalog/topics/{sub_area_id}` | Q7 topic card + tab counts |
| 6 | `GET /learner/catalog/topics/{sub_area_id}/questions?difficulty_level=` | Q7 / Q8 / Q9 tab content |
| — | `POST` / `DELETE /learner/subscriptions/subjects/{subject_id}` | Subscribe / Unsubscribe subject (**exists**) |
| — | `POST` / `DELETE /learner/subscriptions/sub-areas/{sub_area_id}` | Subscribe / Unsubscribe topic (**exists**) |

---

## Shared objects

### `CatalogSubject`
```json
{
  "id": 1,
  "name": "Programming",
  "description": "Languages, logic and problem solving.",
  "topic_count": 12,
  "question_count": 230,
  "is_subscribed": true
}
```
| Field | Rule |
|---|---|
| `topic_count` | Active sub-areas of the subject |
| `question_count` | Active + verified questions in the subject |
| `is_subscribed` | Learner has an **active** subject subscription |

### `CatalogTopic`
```json
{
  "id": 11,
  "subject_id": 1,
  "subject_name": "Programming",
  "name": "Control Flow",
  "description": "Conditions, loops and branching",
  "question_count": 18,
  "answered_count": 6,
  "is_subscribed": false
}
```
| Field | Rule |
|---|---|
| `question_count` | Active + verified questions with `sub_area_id = id` |
| `answered_count` | Distinct questions of this topic the learner has attempted |
| `is_subscribed` | Learner has an **active** sub-area subscription. (Subscribing to a subject does **not** flip this — the two are independent, as in the existing subscription endpoints.) |

---

## 1. `GET /learner/catalog/subjects`

Query: `page` (default 1), `page_size` (default 50, max 100). Order: `name` asc.

```json
{
  "items": [ { "id": 1, "name": "Programming", "description": "Languages, logic and problem solving.", "topic_count": 12, "question_count": 230, "is_subscribed": true } ],
  "page": 1, "page_size": 50, "total": 6
}
```

## 2. `GET /learner/catalog/search`

Searches subject names **and** topic names (case-insensitive, `ILIKE '%q%'`; matching descriptions is optional).

| Param | Required | Rule |
|---|---|---|
| `q` | yes | Trimmed, 2–100 chars, else `422` |
| `limit` | no | Max items **per list**, default 20, max 50 |

Order: names that **start with** `q` first, then the rest, each alphabetical.

```json
{
  "query": "sql",
  "subjects": [ { "id": 3, "name": "Databases", "description": "SQL, modelling and indexing.", "topic_count": 8, "question_count": 96, "is_subscribed": false } ],
  "topics": [
    { "id": 31, "subject_id": 3, "subject_name": "Databases", "name": "SQL Basics", "description": "SELECT, WHERE, ORDER BY", "question_count": 22, "answered_count": 4, "is_subscribed": true },
    { "id": 44, "subject_id": 4, "subject_name": "Security",  "name": "SQL Injection", "description": null, "question_count": 9, "answered_count": 0, "is_subscribed": false }
  ]
}
```
No matches → `200` with empty `subjects` and `topics` (the app shows Q3).

## 3. `GET /learner/catalog/subjects/{subject_id}`

Returns one `CatalogSubject`. `404` if the subject doesn't exist or is inactive.

## 4. `GET /learner/catalog/subjects/{subject_id}/topics`

| Param | Rule |
|---|---|
| `search` | Optional, case-insensitive match on topic `name` |
| `page`, `page_size` | Default 1 / 50 (max 100) |

Order: `display_order` asc, then `name`. Response: paginated `CatalogTopic`. `404` if the subject doesn't exist.
`total` is the number of topics **matching the search** (the app shows "1 topic matches “loop”").

## 5. `GET /learner/catalog/topics/{sub_area_id}`

`CatalogTopic` plus per-difficulty counts used for the tab labels ("Easy 6 · Medium 8 · Hard 4"):

```json
{
  "id": 11, "subject_id": 1, "subject_name": "Programming",
  "name": "Control Flow", "description": "Conditions, loops and branching — decide what your program does next.",
  "question_count": 18, "answered_count": 6, "is_subscribed": true,
  "difficulty_counts": [
    { "difficulty_level": 1, "question_count": 6 },
    { "difficulty_level": 2, "question_count": 8 },
    { "difficulty_level": 3, "question_count": 4 },
    { "difficulty_level": 4, "question_count": 0 },
    { "difficulty_level": 5, "question_count": 0 }
  ]
}
```
Always return all five levels (zeros included). The app always shows Easy / Medium / Hard and adds Expert / Master tabs only when their count > 0.
`404` if the topic doesn't exist or is inactive.

## 6. `GET /learner/catalog/topics/{sub_area_id}/questions`

| Param | Required | Rule |
|---|---|---|
| `difficulty_level` | yes | 1–5, else `422` |
| `page`, `page_size` | no | Default 1 / 20 (max 100) |

Order: `created_at` desc. The app loads more with `page + 1` while `page * page_size < total`.

```json
{
  "items": [
    {
      "id": "8c1e…",
      "title": "Which keyword exits a loop immediately?",
      "difficulty_level": 1,
      "tags": ["Loops"],
      "is_verified": true,
      "total_attempts": 1240,
      "correct_rate": 0.82,
      "my_attempt": { "attempt_id": "a91f…", "is_correct": true, "attempted_at": "2026-10-14T08:12:00Z" }
    },
    {
      "id": "77d0…",
      "title": "Which loop always runs at least once?",
      "difficulty_level": 1,
      "tags": ["Loops", "do-while"],
      "is_verified": true,
      "total_attempts": 0,
      "correct_rate": null,
      "my_attempt": null
    }
  ],
  "page": 1, "page_size": 20, "total": 6
}
```
| Field | Rule | UI |
|---|---|---|
| `total_attempts` | All attempts by all learners | "1.2k attempts" |
| `correct_rate` | `correct_attempts / total_attempts`, 0–1, `null` when 0 attempts | "82% got it right" (null → "No attempts yet — be the first") |
| `my_attempt` | Learner's **first** attempt at the question, or `null` | ✓ Correct / ✗ Wrong / Not attempted |

Do **not** include `options`, `correct_answer_index` or `explanation` here — the list must not leak answers.
(`total_attempts` / `correct_rate` can come from the same aggregation as the existing `GET /questions/{id}/stats`.)

---

## Errors (all endpoints)

| Status | When | App |
|---|---|---|
| `401` | Missing / expired token | Silent refresh + retry |
| `404` | Unknown / inactive subject or topic | "Couldn't load this subject/topic" + Try again |
| `422` | Bad params (`q` too short, bad `difficulty_level`) | Error state |

## FastAPI / Pydantic schema

```python
from datetime import datetime
from typing import Generic, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")

class Paginated(BaseModel, Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total: int

class CatalogSubject(BaseModel):
    id: int
    name: str
    description: str | None = None
    topic_count: int = Field(ge=0)
    question_count: int = Field(ge=0)
    is_subscribed: bool

class CatalogTopic(BaseModel):
    id: int                      # sub_area_id
    subject_id: int
    subject_name: str
    name: str
    description: str | None = None
    question_count: int = Field(ge=0)
    answered_count: int = Field(ge=0)
    is_subscribed: bool

class DifficultyCount(BaseModel):
    difficulty_level: int = Field(ge=1, le=5)
    question_count: int = Field(ge=0)

class CatalogTopicDetail(CatalogTopic):
    difficulty_counts: list[DifficultyCount]   # always levels 1..5

class CatalogSearchResponse(BaseModel):
    query: str
    subjects: list[CatalogSubject]
    topics: list[CatalogTopic]

class MyAttemptSummary(BaseModel):
    attempt_id: str
    is_correct: bool
    attempted_at: datetime

class TopicQuestion(BaseModel):
    id: str
    title: str
    difficulty_level: int = Field(ge=1, le=5)
    tags: list[str] = []
    is_verified: bool
    total_attempts: int = Field(ge=0)
    correct_rate: float | None = Field(default=None, ge=0, le=1)
    my_attempt: MyAttemptSummary | None = None

# router = APIRouter(prefix="/learner/catalog", tags=["Learner"])
# GET /subjects                          -> Paginated[CatalogSubject]
# GET /search?q=&limit=                  -> CatalogSearchResponse
# GET /subjects/{subject_id}             -> CatalogSubject
# GET /subjects/{subject_id}/topics      -> Paginated[CatalogTopic]
# GET /topics/{sub_area_id}              -> CatalogTopicDetail
# GET /topics/{sub_area_id}/questions    -> Paginated[TopicQuestion]
```

## Implementation notes

- Compute counts with grouped subqueries (`COUNT(*) FILTER (WHERE …)`) rather than per-row queries — subjects and topics lists are small, but avoid N+1.
- `is_subscribed`: `EXISTS (SELECT 1 FROM subject_subscriptions WHERE user_id = :me AND subject_id = s.id AND is_active)` (same for sub-areas).
- `answered_count` / `my_attempt`: from the learner's attempts, first attempt per question (`DISTINCT ON (question_id) … ORDER BY question_id, created_at`).
- The existing subscribe/unsubscribe endpoints should be idempotent (subscribing twice → 200, not 409), since the app may retry.
- After you ship: add the endpoints to `src/api/openapi.yaml`, run `npm run gen:api`, then optionally switch the hooks in `src/api/catalog.ts` to the generated ones (same field names).


---

## Implementation status

Implemented in `davinci_backend`:

- Router: `app/routers/learner/catalog_router.py` (`/learner/catalog/*`, learner auth only)
- Controller: `app/controllers/learner/catalog_controller.py`
- Schemas: `app/schema/catalog_schema.py`
- Tests: `tests/test_learner_catalog.py`
- Pagination reuses `app.core.pagination.PaginatedResponse` (`items, total, page, page_size`).
- `Subject` has no `is_active` column, so all subjects are listed; topics must be active, questions active + verified.
- `POST`/`DELETE /learner/subscriptions/{subjects|sub-areas}/{id}` are now idempotent (no 409 / 404 on repeat).
- The mobile client uses the generated hooks from `src/api/generated.ts` (`npm run gen:api`); only the infinite topic-question list is hand-written in `src/api/catalog.ts`.
