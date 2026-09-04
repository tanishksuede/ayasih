import { useMemo, useRef, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAREER_FIELDS,
  DISCOVERY_FACETS,
  FLOW_NODES,
  GAME_ROUTE,
  IDOLS,
  INCUBATION_LINE,
  JOURNEY_STEPS,
  OUTCOMES,
  REFRAMES,
} from "@/lib/aya";
import { Reveal, Tilt, usePointerParallax } from "./motion";
import { Mascot, MascotAura } from "./Mascot";
import lockup from "@/assets/aya-lockup.png";
import { bgmManager } from "@/utils/bgmManager";
import { audioManager as audioSynth } from "@/utils/audioManager";

/* ------------------------------------------------------------------ shared */

function StartButton({
  children = "START YOUR JOURNEY",
  size = "md",
  className,
}: {
  children?: React.ReactNode;
  size?: "md" | "lg";
  className?: string;
}) {
  const navigate = useNavigate();

  const handleLaunch = (e: React.MouseEvent) => {
    e.preventDefault();
    bgmManager.unlock();
    audioSynth.playClick();
    navigate(GAME_ROUTE);
  };

  return (
    <button
      onClick={handleLaunch}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-display font-extrabold tracking-tight text-primary-foreground cursor-pointer select-none",
        "shadow-[var(--shadow-glow)] transition-transform duration-300 ease-[var(--ease-soft)] hover:-translate-y-0.5 active:translate-y-0",
        size === "lg" ? "px-8 py-4 text-base sm:px-10 sm:py-5 sm:text-lg" : "px-7 py-3.5 text-sm sm:text-base",
        className,
      )}
      style={{ backgroundImage: "var(--gradient-brand)" }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-white/25 animate-sweep"
      />
      <span className="relative">{children}</span>
      <ArrowRight className="relative size-5 transition-transform duration-300 group-hover:translate-x-1" />
    </button>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-display text-sm font-bold tracking-tight text-foreground/90 transition-colors duration-300 hover:bg-white/10 sm:text-base"
    >
      {children}
    </a>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
      <span className="h-px w-6 bg-gradient-to-r from-pink to-transparent" />
      {children}
    </span>
  );
}

function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-display text-[2.1rem] font-extrabold leading-[0.98] sm:text-5xl lg:text-[3.6rem]",
        className,
      )}
    >
      {children}
    </h2>
  );
}

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 sm:py-28 lg:py-36", className)}
    >
      {children}
    </section>
  );
}

/* --------------------------------------------------------------------- nav */

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-3 flex w-[min(100%-1.25rem,72rem)] items-center justify-between rounded-full glass px-3 py-2 sm:px-4">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src={lockup}
            alt="AYA"
            className="h-11 w-auto animate-logo-enter sm:h-12"
            decoding="async"
          />
          <span className="sr-only">AYA — AtYourAge</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="#how-it-works"
            className="hidden rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            How it works
          </a>
          <StartButton className="px-5 py-2.5 text-xs sm:text-sm">START</StartButton>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------- hero */

function Hero() {
  const p = usePointerParallax();
  const layer = (depth: number): CSSProperties => ({
    transform: `translate3d(${p.x * depth}px, ${p.y * depth}px, 0)`,
    transition: "transform 500ms var(--ease-soft)",
  });

  return (
    <div id="top" className="relative grain overflow-hidden pt-28 sm:pt-32">
      {/* environment */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,oklch(0.32_0.16_310)_0%,transparent_60%)]" />
        <div className="aura left-[-10%] top-[6%] size-[38rem] rounded-full opacity-60" style={layer(-18)} />
        <div
          className="aura right-[-14%] top-[24%] size-[30rem] rounded-full opacity-40"
          style={{ ...layer(14), backgroundImage: "radial-gradient(closest-side, oklch(0.64 0.29 355 / 38%), transparent)" }}
        />
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute size-[3px] rounded-full bg-white/70 animate-spark"
            style={{
              left: `${(i * 137) % 96 + 2}%`,
              top: `${(i * 61) % 78 + 8}%`,
              animationDelay: `${(i % 7) * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-28">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <Reveal>
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/80">
              <span className="size-1.5 rounded-full bg-peel" />
              {INCUBATION_LINE}
            </span>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[2.7rem] font-extrabold leading-[0.92] sm:text-6xl lg:text-[4.4rem]">
              WHAT WERE THEY DOING
              <br />
              <span className="relative inline-block">
                <span className="text-heat">AT YOUR AGE?</span>
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full opacity-80"
                  style={{ backgroundImage: "var(--gradient-heat)" }}
                />
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0">
              Discover what remarkable people were facing, learning and building at the
              age you are today — and what their journeys can teach you about yours.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <StartButton size="lg" className="justify-center" />
              <GhostButton href="#how-it-works">HOW IT WORKS</GhostButton>
            </div>
          </Reveal>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-[min(78vw,26rem)] scene" style={layer(-26)}>
            <MascotAura />
            <Mascot priority className="relative z-10" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- problem */

function Problem() {
  const lines = [
    "Someone is ahead.",
    "Someone is already building.",
    "Someone already knows what they want.",
  ];
  return (
    <Section className="max-w-4xl text-center">
      <Reveal>
        <SectionHeading>EVERYONE SEEMS TO HAVE A TIMELINE.</SectionHeading>
      </Reveal>
      <ul className="mt-12 space-y-4">
        {lines.map((l, i) => (
          <Reveal as="li" key={l} delay={i * 110}>
            <p className="text-lg text-muted-foreground sm:text-2xl">{l}</p>
          </Reveal>
        ))}
      </ul>
      <Reveal delay={380}>
        <p className="mt-12 font-display text-2xl font-bold sm:text-3xl">
          And you're wondering if you're falling behind.
        </p>
      </Reveal>
      <Reveal delay={460}>
        <div className="mx-auto mt-14 h-16 w-px bg-gradient-to-b from-transparent via-mulberry to-transparent" />
        <p className="text-base text-muted-foreground sm:text-lg">
          But what if you stopped comparing your journey to theirs…
        </p>
        <p className="mt-3 font-display text-2xl font-extrabold sm:text-4xl">
          …and started understanding where <span className="text-heat">YOU</span> are?
        </p>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------- concept */

const AGES = [14, 16, 18, 20, 22, 24];

function Concept() {
  const [age, setAge] = useState(18);
  const probes = [
    "What were they trying to do?",
    "What were they struggling with?",
    "What failed?",
    "What changed?",
    "What did they learn?",
    "How did they move forward?",
  ];
  const them = useMemo(
    () => IDOLS[AGES.indexOf(age) % IDOLS.length] ?? IDOLS[0]!,
    [age],
  );

  return (
    <Section id="how-it-works">
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>The idea</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <SectionHeading className="mt-5">
            YOUR AGE.
            <br />
            THEIR JOURNEY.
            <br />
            <span className="text-heat">A DIFFERENT PERSPECTIVE.</span>
          </SectionHeading>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            AYA shows you what remarkable people were doing at the same age you are
            now — not the highlight, the actual middle of it.
          </p>
        </Reveal>
      </div>

      {/* age markers */}
      <Reveal delay={180}>
        <div className="mt-12 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Pick an age
          </span>
          {AGES.map((a) => (
            <button
              key={a}
              onClick={() => setAge(a)}
              aria-pressed={age === a}
              className={cn(
                "relative h-11 w-11 rounded-full font-display text-sm font-bold transition-all duration-300 ease-[var(--ease-soft)] cursor-pointer",
                age === a
                  ? "scale-110 text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "glass text-muted-foreground hover:text-foreground",
              )}
              style={age === a ? { backgroundImage: "var(--gradient-brand)" } : undefined}
            >
              {a}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Reveal>
          <Tilt className="panel h-full rounded-3xl p-7 sm:p-9">
            <Eyebrow>You — today</Eyebrow>
            <p className="mt-6 font-display text-6xl font-extrabold leading-none">
              {age}
            </p>
            <p className="mt-4 text-muted-foreground">
              Right now you're in the part of the story nobody posts about. Questions,
              half-answers, and a lot of "am I doing this right?"
            </p>
            <div className="mt-7 space-y-2.5">
              {probes.slice(0, 3).map((q) => (
                <p key={q} className="text-sm text-foreground/70">
                  {q}
                </p>
              ))}
            </div>
          </Tilt>
        </Reveal>

        <Reveal delay={110}>
          <Tilt className="h-full rounded-3xl p-7 sm:p-9" strength={5}>
            <div
              className="absolute inset-0 -z-10 rounded-3xl opacity-90"
              style={{ backgroundImage: "var(--gradient-glass)" }}
            />
            <div className="glass h-full rounded-3xl p-7 sm:p-9">
              <Eyebrow>Them — at your age</Eyebrow>
              <p
                className="mt-6 font-display text-6xl font-extrabold leading-none text-heat"
                key={age}
              >
                {age}
              </p>
              <p className="mt-4 text-foreground/90">{them.doing}</p>
              <dl className="mt-7 space-y-4 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Struggle
                  </dt>
                  <dd className="mt-1">{them.challenge}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    What they took from it
                  </dt>
                  <dd className="mt-1">{them.lesson}</dd>
                </div>
              </dl>
            </div>
          </Tilt>
        </Reveal>
      </div>

      <Reveal delay={140}>
        <p className="mt-10 font-display text-2xl font-extrabold sm:text-3xl">
          And what can <span className="text-heat">YOU</span> learn from it?
        </p>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------ relatability */

function Relatability() {
  return (
    <Section>
      <div className="relative">
        <Mascot
          float={false}
          blink={false}
          className="pointer-events-none absolute -top-16 right-0 hidden w-24 opacity-90 lg:block"
        />
        <Reveal>
          <Eyebrow>Relatability</Eyebrow>
        </Reveal>
        <Reveal delay={60}>
          <SectionHeading className="mt-5 max-w-2xl">THEY FACED PROBLEMS TOO.</SectionHeading>
        </Reveal>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {REFRAMES.map((r, i) => (
          <Reveal key={r.you} delay={(i % 2) * 90}>
            <Tilt className="glass h-full rounded-2xl p-6" strength={4} lift={10}>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                You
              </p>
              <p className="mt-2 font-display text-xl font-bold leading-snug">"{r.you}"</p>
              <div className="my-5 h-px w-full bg-border" />
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-peel">
                AYA
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground/85">{r.aya}</p>
            </Tilt>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-14 flex items-center gap-5 rounded-3xl panel p-7 sm:p-9">
          <Mascot className="w-20 shrink-0 sm:w-24" blink />
          <p className="font-display text-xl font-extrabold leading-snug sm:text-3xl">
            Sometimes the best advice isn't advice.
            <br />
            <span className="text-heat">It's relatability.</span>
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* --------------------------------------------------------- not just stories */

function NotJustStories() {
  return (
    <Section>
      <Reveal>
        <SectionHeading className="max-w-3xl">
          AYA DOESN'T JUST TELL YOU STORIES.
        </SectionHeading>
      </Reveal>
      <Reveal delay={90}>
        <SectionHeading className="mt-3 text-heat">IT CONNECTS THEM TO YOU.</SectionHeading>
      </Reveal>
      <Reveal delay={150}>
        <p className="mt-6 max-w-xl text-muted-foreground">
          The experience moves with you. What you answer, what you choose and how you
          play quietly shapes what comes next.
        </p>
      </Reveal>

      <ol className="mt-14 grid gap-4 md:grid-cols-5">
        {FLOW_NODES.map((n, i) => (
          <Reveal as="li" key={n.label} delay={i * 110}>
            <Tilt className="glass relative h-full rounded-2xl p-5" strength={5}>
              <span className="font-display text-xs font-bold text-peel">
                0{i + 1}
              </span>
              <p className="mt-3 font-display text-base font-extrabold leading-tight">
                {n.label}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{n.note}</p>
              {i < FLOW_NODES.length - 1 && (
                <span
                  aria-hidden
                  className="absolute -right-3 top-1/2 hidden h-px w-6 bg-gradient-to-r from-mulberry to-pink md:block"
                />
              )}
            </Tilt>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ----------------------------------------------------------- self discovery */

function SelfDiscovery() {
  return (
    <Section className="max-w-5xl">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            <Eyebrow>Self-discovery</Eyebrow>
          </Reveal>
          <Reveal delay={60}>
            <SectionHeading className="mt-5">
              THE MORE YOU PLAY,
              <br />
              THE MORE YOU DISCOVER <span className="text-heat">ABOUT YOU.</span>
            </SectionHeading>
          </Reveal>
          <Reveal delay={130}>
            <p className="mt-6 max-w-lg text-muted-foreground">
              You don't always discover yourself by thinking about yourself. Sometimes
              you discover yourself by seeing how you choose.
            </p>
          </Reveal>
          <Reveal delay={190}>
            <div className="mt-8 flex flex-wrap gap-2">
              {DISCOVERY_FACETS.map((f) => (
                <span
                  key={f}
                  className="glass rounded-full px-4 py-2 text-sm text-foreground/85"
                >
                  {f}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="relative mx-auto w-[min(60vw,18rem)]">
            <MascotAura className="opacity-70" />
            <Mascot className="relative z-10" />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------- idols */

function Idols() {
  const rail = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  return (
    <Section className="max-w-none px-0 sm:px-0">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading className="max-w-2xl">
              MEET THE PEOPLE WHO ONCE STOOD <span className="text-heat">WHERE YOU STAND.</span>
            </SectionHeading>
          </Reveal>
          <div className="hidden gap-2 lg:flex">
            <button
              onClick={() => scrollBy(-1)}
              aria-label="Previous"
              className="glass grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              aria-label="Next"
              className="glass grid size-11 place-items-center rounded-full transition-colors hover:bg-white/10 cursor-pointer"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={rail}
        className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {IDOLS.map((idol, i) => (
          <article
            key={i}
            className="panel group relative w-[78vw] shrink-0 snap-center overflow-hidden rounded-3xl p-6 sm:w-[22rem] sm:p-7"
          >
            <div
              aria-hidden
              className="absolute -right-16 -top-16 size-40 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ backgroundImage: "var(--gradient-aura)" }}
            />
            {/* portrait slot — accepts real personality imagery later */}
            <div className="relative flex aspect-[4/3] items-end justify-between overflow-hidden rounded-2xl bg-surface-2 p-4">
              <span className="font-display text-[3.4rem] font-extrabold leading-none text-heat">
                {idol.age}
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-muted-foreground">
                at your age
              </span>
            </div>
            <h3 className="mt-5 font-display text-lg font-extrabold">{idol.name}</h3>
            <p className="mt-2 text-sm text-foreground/85">{idol.doing}</p>
            <div className="mt-5 space-y-3 text-sm">
              <p className="text-muted-foreground">
                <span className="mr-2 text-[0.6rem] uppercase tracking-[0.2em] text-pink">
                  Challenge
                </span>
                {idol.challenge}
              </p>
              <p className="text-muted-foreground">
                <span className="mr-2 text-[0.6rem] uppercase tracking-[0.2em] text-peel">
                  Lesson
                </span>
                {idol.lesson}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ career */

function Career() {
  return (
    <Section className="max-w-5xl">
      <Reveal>
        <Eyebrow>Career discovery</Eyebrow>
      </Reveal>
      <Reveal delay={60}>
        <SectionHeading className="mt-5 max-w-2xl">
          AND THEN, LOOK CLOSER <span className="text-heat">AT YOURSELF.</span>
        </SectionHeading>
      </Reveal>
      <Reveal delay={130}>
        <div className="mt-8 max-w-xl space-y-3 text-muted-foreground">
          <p>As you explore, your choices and performance reveal patterns.</p>
          <p className="text-foreground/90">
            Patterns become strengths. Strengths reveal possibilities.
          </p>
        </div>
      </Reveal>

      <Reveal delay={180}>
        <div className="panel mt-12 overflow-hidden rounded-3xl p-7 sm:p-10">
          <p className="font-display text-sm font-bold uppercase tracking-[0.24em] text-peel">
            Your career map
          </p>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            AYA helps you discover where your strengths, interests and natural
            tendencies may lead — directions to explore, not verdicts.
          </p>

          <div className="relative mt-10">
            <div className="mx-auto mb-8 w-fit rounded-full px-5 py-2 font-display text-sm font-bold text-primary-foreground" style={{ backgroundImage: "var(--gradient-brand)" }}>
              YOU
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CAREER_FIELDS.map((f, i) => (
                <Reveal key={f} delay={i * 70}>
                  <div className="scene">
                    <div
                      className="glass rounded-2xl p-4 text-center transition-transform duration-500 ease-[var(--ease-soft)] hover:-translate-y-1"
                      style={{ transform: `translateZ(${(i % 3) * 6}px)` }}
                    >
                      <span className="text-sm font-semibold">{f}</span>
                      <span className="mt-2 block text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
                        possible direction
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Discover where your natural strengths could take you.
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/* ----------------------------------------------------------------- journey */

function Journey() {
  return (
    <Section>
      <Reveal>
        <SectionHeading className="max-w-2xl">THE JOURNEY.</SectionHeading>
      </Reveal>
      <ol className="mt-12 space-y-3">
        {JOURNEY_STEPS.map((s, i) => (
          <Reveal as="li" key={s.n} delay={i * 90}>
            <div className="glass flex flex-col gap-2 rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-8">
              <span className="font-display text-3xl font-extrabold text-heat sm:w-20">
                {s.n}
              </span>
              <span className="font-display text-lg font-extrabold sm:flex-1 sm:text-2xl">
                {s.title}
              </span>
              <span className="text-sm text-muted-foreground sm:max-w-xs sm:text-right">
                {s.copy}
              </span>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ---------------------------------------------------------------- outcomes */

function Outcomes() {
  return (
    <Section>
      <Reveal>
        <SectionHeading>SO, WHAT DO YOU GET?</SectionHeading>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OUTCOMES.map((o, i) => (
          <Reveal key={o.n} delay={i * 90}>
            <Tilt className="panel h-full rounded-2xl p-6" strength={6} lift={16}>
              <span className="font-display text-xs font-bold tracking-[0.2em] text-peel">
                {o.n}
              </span>
              <h3 className="mt-4 font-display text-xl font-extrabold">{o.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{o.copy}</p>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------------------------------------- emotional */

function Emotional() {
  return (
    <Section className="max-w-4xl text-center">
      <Reveal>
        <div className="relative mx-auto w-[min(46vw,13rem)]">
          <MascotAura className="opacity-60" />
          <Mascot className="relative z-10" />
        </div>
      </Reveal>
      <Reveal delay={100}>
        <SectionHeading className="mt-10">
          YOU DON'T HAVE TO HAVE IT ALL FIGURED OUT.
        </SectionHeading>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-8 text-lg text-muted-foreground sm:text-2xl">
          You just need a place to start.
        </p>
      </Reveal>
      <Reveal delay={280}>
        <p className="mt-2 text-lg text-muted-foreground sm:text-2xl">
          Start with your age.
        </p>
      </Reveal>
      <Reveal delay={360}>
        <p className="mt-2 font-display text-2xl font-extrabold sm:text-4xl">
          Start with <span className="text-heat">AYA.</span>
        </p>
      </Reveal>
    </Section>
  );
}

/* --------------------------------------------------------------- final CTA */

function FinalCta() {
  return (
    <section className="relative grain flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-5 py-24 text-center">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(100%_70%_at_50%_110%,oklch(0.34_0.17_312)_0%,transparent_62%)]" />
        <div className="aura bottom-[-20%] left-1/2 size-[42rem] -translate-x-1/2 rounded-full opacity-60" />
      </div>

      <Reveal>
        <img
          src={lockup}
          alt="AYA"
          loading="lazy"
          decoding="async"
          className="mx-auto w-[min(60vw,15rem)] animate-float"
        />
      </Reveal>
      <Reveal delay={100}>
        <h2 className="mt-10 font-display text-[2.3rem] font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
          DISCOVER THE POWER
          <br />
          <span className="text-heat">OF YOUR AGE.</span>
        </h2>
      </Reveal>
      <Reveal delay={180}>
        <p className="mx-auto mt-7 max-w-md text-muted-foreground sm:text-lg">
          Your age is happening right now. Make it part of your story.
        </p>
      </Reveal>
      <Reveal delay={260}>
        <div className="mt-10">
          <StartButton size="lg" />
        </div>
      </Reveal>
      <Reveal delay={320}>
        <p className="mt-8 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          {INCUBATION_LINE}
        </p>
      </Reveal>
    </section>
  );
}

function Footer() {
  const navigate = useNavigate();

  const handleLaunch = (e: React.MouseEvent) => {
    e.preventDefault();
    bgmManager.unlock();
    audioSynth.playClick();
    navigate(GAME_ROUTE);
  };

  return (
    <footer className="border-t border-border px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <span>ATYOURAGE (AYA)</span>
        <button
          onClick={handleLaunch}
          className="inline-flex items-center gap-1.5 font-semibold text-foreground/90 transition-colors hover:text-peel cursor-pointer"
        >
          Start your journey <ArrowUpRight className="size-4" />
        </button>
      </div>
    </footer>
  );
}

/* --------------------------------------------------------------------- page */

export function AyaLanding() {
  return (
    <main className="relative overflow-x-hidden bg-background text-foreground">
      <Nav />
      <Hero />
      <Problem />
      <Concept />
      <Relatability />
      <NotJustStories />
      <SelfDiscovery />
      <Idols />
      <Career />
      <Journey />
      <Outcomes />
      <Emotional />
      <FinalCta />
      <Footer />
    </main>
  );
}

export default AyaLanding;
