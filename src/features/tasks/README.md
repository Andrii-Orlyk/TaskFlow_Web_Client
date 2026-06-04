# tasks

        Feature role in `TaskFlow Web Client`:
        part of `auth → projects → tasks → comments → dashboard`.

        Expected UI units:
        - TasksPage
- TaskDetailsPage
- TaskForm
- TaskFilters
- StatusBadge
- PriorityBadge

        Implementation rules:
        - keep API calls in `src/api` or feature hooks;
        - define loading, empty and error states;
        - add tests for success and failure paths;
        - keep components typed and reusable where possible.
