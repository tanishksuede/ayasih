# AYA Workspace Rules

## Version Control Workflow
1. Many people are committing changes to this repository.
2. Therefore, **always** run `git pull --rebase` before starting any coding task to fetch the latest changes.
3. Always push your changes (`git add . ; git commit -m '...' ; git push`) after completing any modifications.

## Solarch Workflow
- `solarch` is installed globally (`npm install -g solarch`).
- Core CLI commands:
  - `solarch init <project-name>`: initialize backend architecture project.
  - `solarch serve --dev`: start backend runtime development server.


## Production-Grade Agent Skills (Active - Addy Osmani Engineering Skills)
All 25 production-grade skills from `addyosmani/agent-skills` are installed in `.agents/skills/` and globally. Always invoke and consult the relevant skill based on the task at hand:

| Phase / Focus | Applicable Skills (`.agents/skills/<name>/SKILL.md`) |
| :--- | :--- |
| **Requirements & Ideation** | `interview-me`, `idea-refine`, `spec-driven-development` |
| **Architecture & Design** | `api-and-interface-design`, `documentation-and-adrs`, `constraint-driven-development` |
| **Planning & Execution** | `planning-and-task-breakdown`, `incremental-implementation`, `test-driven-development` |
| **Frontend & UI** | `frontend-ui-engineering`, `browser-testing-with-devtools`, `performance-optimization` |
| **Quality & Security** | `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `doubt-driven-development` |
| **Debugging & Errors** | `debugging-and-error-recovery`, `observability-and-instrumentation` |
| **Delivery & Release** | `git-workflow-and-versioning`, `ci-cd-and-automation`, `shipping-and-launch`, `deprecation-and-migration` |
| **Context & Discovery** | `context-engineering`, `source-driven-development`, `using-agent-skills` |

When handling tasks related to these areas, always view and adhere to the guidelines in the corresponding `SKILL.md` before executing.



