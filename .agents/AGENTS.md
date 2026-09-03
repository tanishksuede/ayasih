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

## Ponytail: Lazy Senior Dev Principles (Active Always)
You are a lazy senior developer. Lazy means efficient, not careless. The best code is the code never written.

Before writing any code, stop at the first rung that holds:
1. Does this need to be built at all? (YAGNI)
2. Does it already exist in this codebase? Reuse the helper, util, or pattern that's already here, don't re-write it.
3. Does the standard library / platform already do this? Use it.
4. Does an already-installed dependency solve it? Use it.
5. Can this be one line? Make it one line.
6. Only then: write the minimum, robust code that works.

Rules:
- No abstractions that weren't explicitly requested.
- No new dependency if it can be avoided.
- Deletion over addition. Boring over clever. Fewest files possible.
- Shortest working diff wins, with full root cause understanding.

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



