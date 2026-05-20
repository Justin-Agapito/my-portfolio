import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

/* =============================================================================
 * Portfolio - bold-numeral editorial layout (ref 2).
 *
 *  Swap zones (search for `SWAP:`):
 *    • PROFILE         - name, role, tagline, contact + socials
 *    • PHOTO_SRC       - path to your transparent cut-out photo
 *    • BIO             - About-section copy
 *    • PROJECTS        - project entries (each renders as a Number-slide panel)
 *    • SKILLS          - skill groups for section 03
 *    • RESUME_HREF     - Laravel route that streams public/resume.pdf
 *
 *  Design: huge outlined/filled numerals (01, 02, 03) with imagery clipped
 *  inside them; coral horizontal rules; asymmetric two-panel rows (text
 *  panel + numeral panel). Helvetica Neue display + Roboto body.
 *  BG #FAFAFA, ink #111111, accent #E63946, muted #999999.
 * ========================================================================== */

// Portrait - sourced from storage via `php artisan storage:link`.
// Files live at storage/app/public/images/* and serve from /storage/images/*.
// Note: the source JPG is rotated 90° CW (sideways), so we counter-rotate via
// CSS in the components below and clip to a tall portrait aspect.
const PHOTO_SRC = '/storage/images/Carl_Agapito.JPG';
const PHOTO_FALLBACK = '/me.svg';

// SWAP: Laravel route - streams public/resume.pdf.
const RESUME_HREF = '/resume/download';

const PROFILE = {
    name: 'Carl Justin Agapito',
    role: 'Full-Stack Developer',
    /* One-line web tagline, distilled from the CV's professional summary.
     * The CV version is functional ("Motivated web developer with hands-on
     * experience..."); web copy needs to sound like a person, not a CV. */
    tagline:
        'I build thoughtful web and mobile applications - focused on clean code, secure systems, and considered interface work.',
    location: 'Bacolod City, Philippines',
    phone: '+63 999 568 7920',
    email: 'carlj.agapito@gmail.com',
    socials: [
        { label: 'GitHub',   href: 'https://github.com/' },     // SWAP: real URL
        { label: 'LinkedIn', href: 'https://linkedin.com/' },   // SWAP: real URL
        { label: 'Email',    href: 'mailto:carlj.agapito@gmail.com' },
    ],
};

/* About-section bio - written from the CV's professional summary but
 * lifted into web voice (first-person, specific, no buzzwords). */
const BIO = [
    'I am a full-stack developer based in Bacolod City, recently graduated from the University of St. La Salle with a BS in Information Technology, specialised in Web and Mobile Application Development.',
    'I most often work with Laravel, Inertia, and React on the web side, and Flutter for mobile. I care about clean architecture, secure authentication, and interfaces that respect the people using them.',
];

type Project = {
    number: string;     // "01", "02", "03"
    word:   string;     // "One", "Two", "Three"
    title:  string;     // Project name
    role:   string;     // What the developer actually did
    period: string;     // Date range
    summary: string;    // One-paragraph editorial description
    highlights: string[]; // 3-5 concrete outcomes / scope notes
    stack:  string[];   // Tools
    href?:  string;
    image:  string;         // image clipped inside the giant numeral
    imageFallback: string;  // data: URL shown until the real file exists
};

/* Featured work. Quality over count - one real project (Stellar Path)
 * presented with full editorial context, plus a "next" slot so the rhythm
 * still reads as a series. Numeral clip imagery pulled from the cohesive
 * mood library so the section feels art-directed. */
const PROJECTS: Project[] = [
    {
        number: '01',
        word: 'One',
        title: 'Stellar Path',
        role: 'Full-stack developer - Capstone',
        period: 'Jan 2025 - May 2025',
        summary:
            'A web-based OJT (On-the-Job Training) management system that handles the complete internship lifecycle - from company registration and posting, through student application and placement, to attendance logs, evaluations, and CSV reporting.',
        highlights: [
            'Role-based access control with four roles (Admin, Coordinator, Company, Student) and 29 granular permissions across 13 permission groups.',
            'Secure multi-user authentication built on Laravel Fortify - 2FA, email verification, and password reset flows.',
            '33-table relational schema covering internship pipelines, MOA workflows, attendance, journals, and audit tracking.',
            '64 automated feature tests across all four role domains to keep the system trustworthy as it grew.',
        ],
        stack: ['Laravel 13', 'Inertia.js v3', 'React 19', 'Tailwind CSS v4', 'MySQL', 'Pest'],
        href: '#',
        image: '/storage/images/mood.jpg',
        imageFallback: gradientImage('#b8722c', '#f2ebdf'), // amber → linen
    },
    {
        number: '02',
        word: 'Two',
        title: 'Map of Memories',
        role: 'Solo developer - Personal project',
        period: 'Coming soon',
        summary:
            'Drop a pin anywhere on the globe and leave an anonymous note tied to that exact place. No names, no profile - just a location, a timestamp, and what you needed to say. Others who wander near the same coordinates will find it waiting.',
        highlights: [
            'Anonymous authorship - notes are signed only with a chosen handle and a date, e.g. "Yearner23: this was the place where everything started..."',
            'Google Maps API integration - interactive map with custom pin drop, reverse-geocoded place labels, and a proximity-based note feed.',
            'Read-only public view - anyone can read nearby notes but cannot trace authorship beyond the chosen handle.',
            'Real-time note delivery so new pins appear without a page reload.',
        ],
        stack: ['Google Maps API', 'React', 'Laravel', 'MySQL'],
        href: '#',
        image: '/storage/images/mood1.jpg',
        imageFallback: gradientImage('#9b8a74', '#e5dbc9'),
    },
];


type ExperienceEntry = {
    role: string;
    org: string;
    location: string;
    period: string;
    /* `kind` lets us style developer roles differently from non-dev roles
     * without inventing a tag system. Drives the small label colour. */
    kind: 'engineering' | 'service';
    summary: string;
    highlights: string[];
};

/* Experience, rewritten as web copy. The CV bullets get re-phrased as
 * single sentences with subject + verb + outcome - easier to scan. */
const EXPERIENCE: ExperienceEntry[] = [
    {
        role: 'Software Developer Intern',
        org: 'Crave Technology Enterprise Solutions',
        location: 'Bacolod City, PH',
        period: 'Jan 2025 - May 2025',
        kind: 'engineering',
        summary:
            'Built and maintained full-stack modules - front-end, back-end, and database - for a client-facing web platform.',
        highlights: [
            'Designed and implemented secure multi-user authentication for teacher and student roles in a web-based student portal.',
            'Maintained consistent system uptime and platform reliability across the internship.',
        ],
    },
    {
        role: 'Customer Service Representative',
        org: 'Concentrix',
        location: 'Bacolod City, PH',
        period: 'Jun 2025 - Nov 2025',
        kind: 'service',
        summary:
            'Handled guest booking reservations in a fast-paced BPO environment - communication and composure work that sits next to the code.',
        highlights: [
            'Bridged communication between guests and service partners to keep transactions accurate and on time.',
            'Set clear service expectations in every client conversation, maintaining high satisfaction throughout.',
        ],
    },
];

type CommunityEntry = {
    role: string;
    org: string;
    period: string;
    blurb: string;
};

/* Community & Leadership - collapsed from the CV's "Extracurriculars"
 * into one-sentence cards. Each one focuses on what was led or shipped,
 * not the duties list. */
const COMMUNITY: CommunityEntry[] = [
    {
        role: 'Budget & Finance Committee Member',
        org: 'College of Engineering and Technology - USLS',
        period: 'Aug 2023 - Jan 2024',
        blurb:
            'Helped plan budgets and ran marketing campaigns that raised supplemental funding for academic and extracurricular programs.',
    },
    {
        role: 'Production Team Manager',
        org: 'Google Developer Group - Bacolod',
        period: 'Jul 2023 - Aug 2023',
        blurb:
            'Ran end-to-end production for live and recorded tech events - schedules, creative direction, and broadcast-quality delivery.',
    },
    {
        role: 'Technical Team Manager',
        org: 'Google Developer Group - Bacolod',
        period: 'Dec 2021 - Jan 2022',
        blurb:
            'Led technical setup and on-site troubleshooting for events, keeping the show running without downtime.',
    },
    {
        role: 'Sports Head Committee',
        org: 'Information Technology Society - USLS',
        period: 'Aug 2021 - May 2022',
        blurb:
            'Planned sports events that grew student turnout and community engagement across the IT department.',
    },
];

const NAV_LINKS = [
    { href: '#about',      label: '01 About' },
    { href: '#projects',   label: '02 Work' },
    { href: '#experience', label: '03 Experience' },
    { href: '#community',  label: '04 Community' },
    { href: '#skills',     label: '05 Skills' },
    { href: '#contact',    label: '06 Contact' },
];

/** Build a placeholder gradient image so the numeral-clip composition has
 *  something to show before you swap in real screenshots. */
function gradientImage(from: string, to: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="800" height="600" fill="url(%23g)"/></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/** Probe an image URL and return the original src if it loads, otherwise the
 *  fallback. Lets us point at real file paths now and have things light up
 *  the moment the user drops files into `public/`. */
/* Wraps the existing use-appearance hook so the toggle writes to the same
 * 'appearance' localStorage key that initializeTheme() reads on every mount.
 * This is what makes the preference survive page refreshes. */
function useDarkMode(): [boolean, () => void] {
    const { appearance, updateAppearance } = useAppearance();
    const isDark = appearance === 'dark' ||
        (appearance === 'system' && typeof window !== 'undefined' &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggle = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return [isDark, toggle];
}

/* Fires once when the element scrolls into the viewport (10% threshold).
 * Adds data-visible so the CSS keyframe starts. Disconnects after first
 * trigger so there's no jank on scroll-back. */
function useEnterObserver(ref: React.RefObject<Element | null>) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (typeof IntersectionObserver === 'undefined') {
            (el as HTMLElement).dataset.visible = 'true';
            return;
        }
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).dataset.visible = 'true';
                    obs.disconnect();
                }
            },
            { threshold: 0.1 },
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref]);
}

/* Wraps any block in a slow-pop entrance. `delay` staggers children within
 * a section (0, 80, 160 ms, etc.) for a sequential arrival feel. */
function Enter({
    children,
    delay = 0,
    className = '',
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement | null>(null);
    useEnterObserver(ref);
    return (
        <div
            ref={ref}
            data-enter
            className={className}
            style={{ '--enter-delay': `${delay}ms` } as React.CSSProperties}
        >
            {children}
        </div>
    );
}

function useImageWithFallback(src: string, fallback: string): string {
    const [resolved, setResolved] = useState<string>(fallback);
    useEffect(() => {
        let cancelled = false;
        const img = new Image();
        img.onload = () => {
            if (!cancelled) setResolved(src);
        };
        img.onerror = () => {
            if (!cancelled) setResolved(fallback);
        };
        img.src = src;
        return () => {
            cancelled = true;
        };
    }, [src, fallback]);
    return resolved;
}

export default function Welcome() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        // Scroll to top on every page load/refresh so the hero is always the entry point.
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    useEffect(() => {
        const close = () => setMenuOpen(false);
        window.addEventListener('hashchange', close);
        return () => window.removeEventListener('hashchange', close);
    }, []);

    return (
        <>
            <Head title={`${PROFILE.name} - ${PROFILE.role}`}>
                <meta
                    name="description"
                    content={`${PROFILE.name} - ${PROFILE.role}. ${PROFILE.tagline}`}
                />
            </Head>

            <div
                style={{
                    backgroundColor: 'var(--color-portfolio-bg)',
                    color: 'var(--color-portfolio-ink)',
                    fontFamily: 'var(--font-body)',
                }}
                className="min-h-screen antialiased"
            >
                <TopNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

                <main id="top">
                    <Hero />
                    <About />
                    <Projects />
                    <Experience />
                    <Community />
                    <Skills />
                    <Contact />
                </main>

                <Footer />
            </div>
        </>
    );
}

/* ---------- top nav ---------------------------------------------------- */

function TopNav({
    menuOpen,
    setMenuOpen,
}: {
    menuOpen: boolean;
    setMenuOpen: (v: boolean) => void;
}) {
    const [isDark, toggleDark] = useDarkMode();

    return (
        <header
            className="portfolio-nav-enter sticky top-0 z-40 border-b portfolio-rule backdrop-blur"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-portfolio-bg) 88%, transparent)' }}
        >
            <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
                <a
                    href="#top"
                    className="text-sm font-semibold tracking-widest uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}
                >
                    {PROFILE.name}
                    <span style={{ color: 'var(--color-portfolio-accent)' }}>.</span>
                </a>

                <nav aria-label="Section navigation" className="hidden md:block">
                    <ul className="flex items-center gap-8 text-xs tracking-widest uppercase">
                        {NAV_LINKS.map((l) => (
                            <li key={l.href}>
                                <a href={l.href} className="inline-flex h-11 items-center transition-colors hover:opacity-60">
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    {/* Dark mode toggle — sun in dark mode, moon in light mode. */}
                    <button
                        type="button"
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                        onClick={toggleDark}
                        className="inline-flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-60"
                    >
                        {isDark ? (
                            /* Sun */
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <circle cx="12" cy="12" r="4"/>
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                            </svg>
                        ) : (
                            /* Moon */
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                    </button>

                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="inline-flex h-11 w-11 items-center justify-center md:hidden"
                    >
                        <span className="sr-only">Toggle menu</span>
                        <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
                            {menuOpen ? (
                                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.5" />
                            ) : (
                                <>
                                    <path d="M3 7h16" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M3 15h16" stroke="currentColor" strokeWidth="1.5" />
                                </>
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {menuOpen && (
                <nav
                    id="mobile-menu"
                    aria-label="Mobile section navigation"
                    className="border-t portfolio-rule md:hidden"
                    style={{ backgroundColor: 'var(--color-portfolio-bg)' }}
                >
                    <ul className="flex flex-col px-5 py-2 sm:px-8">
                        {NAV_LINKS.map((l) => (
                            <li key={l.href} className="border-b portfolio-rule last:border-b-0">
                                <a
                                    href={l.href}
                                    onClick={() => setMenuOpen(false)}
                                    className="flex h-12 items-center text-sm tracking-widest uppercase"
                                >
                                    {l.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}
        </header>
    );
}

/* ---------- shared pieces --------------------------------------------- */

/** Page-width container - generous gutters, max 1280px. */
function Container({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-12 ${className}`}>
            {children}
        </div>
    );
}

/** Two-panel row that mirrors ref 2's "About / Number slide" composition.
 *  Renders as a 2-column grid on desktop, stacks on mobile. Coral rules
 *  separate the panels in both directions. */
function PanelRow({
    left,
    right,
    id,
    ariaLabel,
}: {
    left: React.ReactNode;
    right: React.ReactNode;
    id?: string;
    ariaLabel?: string;
}) {
    return (
        <section
            id={id}
            aria-label={ariaLabel}
            className="scroll-mt-20 border-t portfolio-rule"
        >
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x portfolio-divide">
                    <div className="py-12 lg:py-16 lg:pr-12">{left}</div>
                    <div className="border-t portfolio-rule lg:border-t-0 py-12 lg:py-16 lg:pl-12">
                        {right}
                    </div>
                </div>
            </Container>
        </section>
    );
}

/** Coral horizontal accent rule - the diagonal red line motif from ref 2. */
function AccentRule({ className = '' }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={`block h-px w-16 ${className}`}
            style={{ backgroundColor: 'var(--color-portfolio-accent)' }}
        />
    );
}

/** Giant numeral with an image clipped inside its glyphs. Falls back to a
 *  flat coral numeral on browsers without `background-clip: text`. */
function ClippedNumeral({ value, image, ariaLabel }: { value: string; image: string; ariaLabel?: string }) {
    return (
        <span
            role="img"
            aria-label={ariaLabel ?? `Numeral ${value}`}
            className="block select-none leading-[0.78] tracking-[-0.06em]"
            style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: 'clamp(10rem, 38vw, 26rem)',
                color: 'var(--color-portfolio-accent)',
                backgroundImage: `url("${image}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
            }}
        >
            {value}
        </span>
    );
}

/* ---------- hero carousel --------------------------------------------- */

/* Swiss-grid hero, as a 3-slide carousel.
 *
 *  Editorial moves common to every slide:
 *    - Single typeface: Helvetica Light. Weight is *never* used for hierarchy;
 *      scale, tracking and color carry the structure (the Swiss rule).
 *    - 12-column grid. Content sits on rails, never centered for centering's
 *      sake.
 *    - Amber dot is the only saturated element on the page; it migrates
 *      between slides so the eye has a single recurring anchor.
 *
 *  Motion language (defined in app.css):
 *    - portfolio-mask  → masked vertical reveal (typography wipes up from
 *                        baseline) - used on display lines
 *    - portfolio-fade  → soft opacity fade - used on labels and rules
 *    - portfolio-drift → slight Y translate + fade - used on meta blocks
 *
 *  Pause behavior: pointer-over, focus-within, document-hidden all pause
 *  auto-advance; reduced-motion users get a static first slide and no
 *  animations. */

/* Adaptive per-slide durations, in milliseconds.
 *  - Slide 01 (Identity)     - text-heavy: bleeding wordmark + bio + meta.
 *                              5.5s lets the eye land on the typography.
 *  - Slide 02 (Practice)     - heaviest content (four display lines + meta).
 *                              6s gives reading room.
 *  - Slide 03 (Availability) - minimal: dot + two lines + CTA.
 *                              4.5s - short, calm, doesn't overstay. */
const HERO_SLIDE_DURATIONS = [5500, 6000, 4500] as const;
const HERO_SLIDE_COUNT = HERO_SLIDE_DURATIONS.length;

/** One pass of the wordmark phrase: NAME - NAME - (with amber dots).
 *  The marquee renders this twice back-to-back so the loop is seamless. */
function WordmarkPhrase() {
    const name = PROFILE.name.toUpperCase();
    return (
        <span className="inline-flex items-center" style={{ paddingRight: '0.18em' }}>
            <span style={{ paddingRight: '0.18em' }}>{name}</span>
            <span
                aria-hidden
                style={{ color: 'var(--color-portfolio-accent)', paddingRight: '0.18em' }}
            >
                -
            </span>
            <span style={{ paddingRight: '0.18em' }}>{name}</span>
            <span
                aria-hidden
                style={{ color: 'var(--color-portfolio-accent)', paddingRight: '0.18em' }}
            >
                -
            </span>
        </span>
    );
}

function Hero() {
    const [index, setIndex] = useState(0);
    /* The slide we just *left* - gets `data-leaving='true'` for the length
     * of the transition so the outgoing animation runs in parallel with
     * the incoming one. Cleared after the slide animation finishes. */
    const [leavingIndex, setLeavingIndex] = useState<number | null>(null);
    /* Direction drives the slide-shift keyframes (in/out from right vs left).
     * Defaults to forward; user prev clicks set 'reverse'. */
    const [direction, setDirection] = useState<'forward' | 'reverse'>('forward');
    const [paused, setPaused] = useState(false);
    const heroRef = useRef<HTMLElement | null>(null);

    /* Whenever the active slide changes, mark the previous slide as
     * `leaving` and clear it after the transition duration. This is what
     * lets the outgoing slide animate out at the same time as the incoming
     * slide animates in. */
    const prevIndexRef = useRef(0);
    useEffect(() => {
        if (prevIndexRef.current === index) return;
        const prev = prevIndexRef.current;
        prevIndexRef.current = index;
        setLeavingIndex(prev);
        const id = window.setTimeout(() => setLeavingIndex(null), 900);
        return () => window.clearTimeout(id);
    }, [index]);

    /* Auto-advance with per-slide duration. The timer is rebuilt every
     * time `index` changes so each slide gets its own budget. Pausing
     * (hover, focus, tab-hidden, reduced-motion) cancels the timer; on
     * resume we set a fresh timer for the *current* slide's full duration,
     * which is the calm, premium behavior - no abrupt catch-up. */
    useEffect(() => {
        if (paused) return;
        if (typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ms = HERO_SLIDE_DURATIONS[index];
        const id = window.setTimeout(() => {
            setDirection('forward');
            setIndex((i) => (i + 1) % HERO_SLIDE_COUNT);
        }, ms);
        return () => window.clearTimeout(id);
    }, [index, paused]);

    /* Pause when the tab is backgrounded. */
    useEffect(() => {
        const onVis = () => setPaused(document.hidden);
        document.addEventListener('visibilitychange', onVis);
        return () => document.removeEventListener('visibilitychange', onVis);
    }, []);

    /* Keyboard navigation when hero is focused. */
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                setDirection('forward');
                setIndex((i) => (i + 1) % HERO_SLIDE_COUNT);
            }
            if (e.key === 'ArrowLeft') {
                setDirection('reverse');
                setIndex((i) => (i - 1 + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT);
            }
        };
        el.addEventListener('keydown', onKey);
        return () => el.removeEventListener('keydown', onKey);
    }, []);

    const goto = (i: number) => {
        const next = ((i % HERO_SLIDE_COUNT) + HERO_SLIDE_COUNT) % HERO_SLIDE_COUNT;
        setDirection(next >= index ? 'forward' : 'reverse');
        setIndex(next);
    };

    const currentDurationMs = HERO_SLIDE_DURATIONS[index];

    /* Trigger the hero entrance after 500 ms — above the fold so
     * IntersectionObserver never fires; we use a plain timeout instead. */
    useEffect(() => {
        const id = window.setTimeout(() => {
            if (heroRef.current) heroRef.current.dataset.visible = 'true';
        }, 500);
        return () => window.clearTimeout(id);
    }, []);

    return (
        <section
            ref={heroRef}
            data-enter
            aria-labelledby="hero-heading"
            aria-roledescription="carousel"
            tabIndex={0}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="relative overflow-hidden outline-none"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 300 }}
        >
            {/* Accessible heading - decorative typography replaces it visually. */}
            <h1 id="hero-heading" className="sr-only">
                {PROFILE.name} - {PROFILE.role}
            </h1>

            {/* Slide stack - slides are absolutely stacked; the active one
                fades over the rest. Height locked to the viewport-minus-nav
                so the carousel feels immersive without the page jumping. */}
            <div
                className="relative"
                style={{ minHeight: 'min(880px, calc(100vh - 65px))' }}
            >
                <Slide active={index === 0} leaving={leavingIndex === 0} index={0} total={HERO_SLIDE_COUNT} direction={direction}>
                    <SlideIdentity />
                </Slide>
                <Slide active={index === 1} leaving={leavingIndex === 1} index={1} total={HERO_SLIDE_COUNT} direction={direction}>
                    <SlidePractice />
                </Slide>
                <Slide active={index === 2} leaving={leavingIndex === 2} index={2} total={HERO_SLIDE_COUNT} direction={direction}>
                    <SlideAvailability />
                </Slide>
            </div>

            {/* Controls - sit at the bottom of the hero block, on the grid. */}
            <CarouselControls
                index={index}
                total={HERO_SLIDE_COUNT}
                goto={goto}
                paused={paused}
                durationMs={currentDurationMs}
            />

            <hr className="border-t portfolio-rule" aria-hidden />
        </section>
    );
}

/** Slide wrapper. Three data-attrs drive the CSS animations:
 *    - `data-active`    - true on the currently visible slide (drives the
 *                          typographic mask/fade/drift keyframes).
 *    - `data-leaving`   - true on the just-previous slide for one transition
 *                          duration so the outgoing animation runs in
 *                          parallel with the incoming one.
 *    - `data-direction` - 'forward' or 'reverse' (drives in/out from left
 *                          vs right). */
function Slide({
    active,
    leaving,
    index,
    total,
    direction,
    children,
}: {
    active: boolean;
    leaving: boolean;
    index: number;
    total: number;
    direction: 'forward' | 'reverse';
    children: React.ReactNode;
}) {
    return (
        <div
            data-slide
            data-active={active ? 'true' : 'false'}
            data-leaving={leaving ? 'true' : 'false'}
            data-direction={direction}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${total}`}
            aria-hidden={!active}
            inert={!active ? '' as unknown as undefined : undefined}
            className="absolute inset-0 flex items-center"
            style={{
                /* When neither active nor leaving, the slide rests at 0
                 * opacity and never animates. Active/leaving slides take
                 * their opacity from the keyframes (in/out variants), so
                 * we leave inline opacity unset for those. */
                opacity: active || leaving ? undefined : 0,
                pointerEvents: active ? 'auto' : 'none',
            }}
        >
            {children}
        </div>
    );
}

/** Slide 01 - Identity. The bleeding wordmark. Loudest of the three. */
function SlideIdentity() {
    return (
        <div className="w-full">
            <Container className="pt-12 sm:pt-16 lg:pt-20">
                <div className="grid grid-cols-12 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
                    <MetaBlock
                        className="portfolio-drift col-span-7 sm:col-span-5 md:col-span-4"
                        style={{ animationDelay: '120ms' }}
                        label="Role"
                        lines={['UI / UX Designer', PROFILE.role]}
                    />
                    <MetaBlock
                        className="portfolio-drift col-span-5 sm:col-span-4 sm:col-start-9 md:col-span-3 md:col-start-10 text-right sm:text-left"
                        style={{ animationDelay: '200ms' }}
                        label="Discipline"
                        lines={['Web - Brand - Editorial']}
                    />
                </div>
            </Container>

            {/* Bleeding wordmark - Helvetica Light, scrolling left → right
                as a continuous marquee. The phrase is rendered twice; CSS
                animates the track from -50% to 0 so the second copy lands
                exactly where the first started for a seamless loop. */}
            <div
                aria-hidden
                className="my-10 sm:my-14 lg:my-16 select-none overflow-hidden"
                style={{
                    fontWeight: 300,
                    letterSpacing: '-0.04em',
                    lineHeight: 0.85,
                    color: 'var(--color-portfolio-ink)',
                    fontSize: 'clamp(5.5rem, 22vw, 18rem)',
                }}
            >
                <div className="portfolio-wordmark whitespace-nowrap">
                    <WordmarkPhrase />
                    <WordmarkPhrase />
                </div>
            </div>

            <Container className="pb-12 sm:pb-16">
                <div className="grid grid-cols-12 items-start gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
                    <div className="portfolio-drift col-span-12 sm:col-span-5 md:col-span-4" style={{ animationDelay: '280ms' }}>
                        <Label>Bio</Label>
                        <p className="max-w-[30ch] text-[15px] leading-snug sm:text-[17px]" style={{ fontWeight: 300 }}>
                            {PROFILE.tagline}
                        </p>
                    </div>

                    <StatusBlock
                        className="portfolio-drift col-span-6 sm:col-span-3 sm:col-start-7 md:col-span-3 md:col-start-7 sm:justify-self-center sm:pt-2"
                        style={{ animationDelay: '360ms' }}
                    />

                    <div
                        className="portfolio-drift col-span-6 sm:col-span-3 sm:col-start-10 md:col-span-2 md:col-start-11 flex sm:justify-end sm:pt-1"
                        style={{ animationDelay: '440ms' }}
                    >
                        <CvPill />
                    </div>
                </div>
            </Container>
        </div>
    );
}

/** Slide 02 - Practice. Quieter. A two-line statement, left aligned, with
 *  a vertical date stamp running up the right rail. */
function SlidePractice() {
    return (
        <div className="w-full">
            <Container className="py-16 sm:py-20 lg:py-24">
                <div className="grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8">
                    <div className="col-span-12 md:col-span-9">
                        <p className="portfolio-fade mb-8" style={{ animationDelay: '80ms' }}>
                            <Label>Practice - 2026</Label>
                        </p>

                        <div
                            className="select-none"
                            style={{
                                fontWeight: 300,
                                letterSpacing: '-0.025em',
                                lineHeight: 0.95,
                                color: 'var(--color-portfolio-ink)',
                                fontSize: 'clamp(2.5rem, 7vw, 6.5rem)',
                            }}
                        >
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '120ms' }}>Designing clean,</span>
                            </span>
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '240ms' }}>intentional experiences</span>
                            </span>
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '360ms' }}>
                                    grounded in
                                    <span style={{ color: 'var(--color-portfolio-accent)' }}> Swiss</span>{' '}
                                    principles
                                </span>
                            </span>
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '480ms' }}>and a love for detail.</span>
                            </span>
                        </div>

                        <div className="portfolio-drift mt-12 grid max-w-[640px] grid-cols-2 gap-8" style={{ animationDelay: '620ms' }}>
                            <MetaBlock label="Based in" lines={[PROFILE.location]} />
                            <MetaBlock label="Reachable" lines={[PROFILE.email]} />
                        </div>
                    </div>

                    {/* Vertical date stamp on the right rail - pure typography
                        as ornament, the Swiss editorial trick of using small
                        side-set text as a vertical anchor. */}
                    <div className="hidden md:flex md:col-span-3 md:col-start-10 justify-end items-end">
                        <div
                            className="portfolio-fade text-[11px] tracking-[0.32em] uppercase"
                            style={{
                                color: 'var(--color-portfolio-muted)',
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)',
                                animationDelay: '300ms',
                            }}
                        >
                            № 02 - Practice
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

/** Slide 03 - Availability. Centered status block, oversized amber dot,
 *  most negative space. The breath at the end of the carousel cycle. */
function SlideAvailability() {
    return (
        <div className="w-full">
            <Container className="py-16 sm:py-20 lg:py-24">
                <div className="grid grid-cols-12 gap-x-4 gap-y-10 sm:gap-x-6 lg:gap-x-8 items-center">
                    {/* Left rail - small label */}
                    <div className="col-span-12 sm:col-span-3">
                        <p className="portfolio-fade" style={{ animationDelay: '80ms' }}>
                            <Label>Status - Open</Label>
                        </p>
                    </div>

                    {/* Center - oversized amber circle + statement */}
                    <div className="col-span-12 sm:col-span-6 flex flex-col items-center text-center">
                        <span
                            aria-hidden
                            className="portfolio-fade mb-8 block rounded-full"
                            style={{
                                backgroundColor: 'var(--color-portfolio-accent)',
                                width: 'clamp(18px, 2.4vw, 28px)',
                                height: 'clamp(18px, 2.4vw, 28px)',
                                animationDelay: '200ms',
                            }}
                        />
                        <div
                            className="select-none"
                            style={{
                                fontWeight: 300,
                                letterSpacing: '-0.02em',
                                lineHeight: 0.95,
                                color: 'var(--color-portfolio-ink)',
                                fontSize: 'clamp(2.25rem, 6vw, 5.25rem)',
                            }}
                        >
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '260ms' }}>
                                    Available for select
                                </span>
                            </span>
                            <span className="portfolio-mask block">
                                <span style={{ animationDelay: '380ms', color: 'var(--color-portfolio-accent)' }}>
                                    work in {new Date().getFullYear()}.
                                </span>
                            </span>
                        </div>

                        <p
                            className="portfolio-drift mt-8 max-w-[44ch] text-[15px] leading-relaxed sm:text-[17px]"
                            style={{ fontWeight: 300, animationDelay: '520ms' }}
                        >
                            Commissions, collaborations, and quiet long-form projects.
                            Reach out by email - replies within a day or two.
                        </p>

                        <div className="portfolio-drift mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '640ms' }}>
                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[12px] tracking-[0.14em] uppercase text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: 'var(--color-portfolio-ink)', fontWeight: 400 }}
                            >
                                Start a conversation
                                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                            </a>
                            <CvPill />
                        </div>
                    </div>

                    {/* Right rail - vertical date stamp */}
                    <div className="hidden sm:flex sm:col-span-3 justify-end">
                        <div
                            className="portfolio-fade text-[11px] tracking-[0.32em] uppercase"
                            style={{
                                color: 'var(--color-portfolio-muted)',
                                writingMode: 'vertical-rl',
                                animationDelay: '300ms',
                            }}
                        >
                            № 03 - Availability
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}

/* ---------- carousel atomic pieces ----------------------------------- */

function Label({ children }: { children: React.ReactNode }) {
    return (
        <span
            className="text-[11px] tracking-[0.22em] uppercase"
            style={{ color: 'var(--color-portfolio-accent)', fontWeight: 400 }}
        >
            {children}
        </span>
    );
}

function StatusBlock({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div className={`flex items-center gap-3 ${className}`} style={style}>
            <span
                aria-hidden
                className="portfolio-status-dot block h-2 w-2 rounded-full"
                style={{ backgroundColor: 'var(--color-portfolio-accent)' }}
            />
            <span
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{
                    color: 'var(--color-portfolio-accent)',
                    fontWeight: 400,
                    textShadow: '0 0 12px color-mix(in srgb, var(--color-portfolio-accent) 50%, transparent)',
                }}
            >
                Available for work
            </span>
        </div>
    );
}

function CvPill() {
    return (
        <a
            href={RESUME_HREF}
            className="group inline-flex h-11 items-center gap-2 rounded-full border px-5 text-[12px] tracking-[0.14em] uppercase transition-colors hover:opacity-70"
            style={{
                borderColor: 'var(--color-portfolio-ink)',
                color: 'var(--color-portfolio-ink)',
                fontWeight: 400,
            }}
        >
            Download CV
            <span aria-hidden className="transition-transform group-hover:translate-y-0.5">↓</span>
        </a>
    );
}

/** Editorial meta block - label + content lines. The atomic Swiss unit. */
function MetaBlock({
    label,
    lines,
    className = '',
    style,
}: {
    label: string;
    lines: string[];
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={className} style={style}>
            <p className="mb-1">
                <Label>{label}</Label>
            </p>
            <div className="text-[15px] leading-snug sm:text-[17px]" style={{ fontWeight: 300, color: 'var(--color-portfolio-ink)' }}>
                {lines.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
        </div>
    );
}

/** Carousel controls - slim Swiss bar: index, progress rules, arrows.
 *  The active rule animates from 0 → 100% width over `durationMs`, mirroring
 *  the slide's autoplay budget so the viewer sees the timing. */
function CarouselControls({
    index,
    total,
    goto,
    paused,
    durationMs,
}: {
    index: number;
    total: number;
    goto: (i: number) => void;
    paused: boolean;
    durationMs: number;
}) {
    return (
        <Container className="pb-8 sm:pb-10">
            <div className="grid grid-cols-12 items-center gap-x-4 gap-y-4 sm:gap-x-6">
                {/* Current / total */}
                <div
                    className="col-span-3 sm:col-span-2 text-[11px] tracking-[0.18em] uppercase"
                    style={{ color: 'var(--color-portfolio-muted)' }}
                >
                    <span style={{ color: 'var(--color-portfolio-ink)' }}>
                        {String(index + 1).padStart(2, '0')}
                    </span>{' '}
                    / {String(total).padStart(2, '0')}
                </div>

                {/* Progress rules - one slim bar per slide */}
                <div className="col-span-6 sm:col-span-8 flex items-center gap-3" role="tablist" aria-label="Hero slides">
                    {Array.from({ length: total }).map((_, i) => {
                        const isActive = i === index;
                        return (
                            <button
                                key={i}
                                type="button"
                                role="tab"
                                aria-selected={isActive}
                                aria-label={`Show slide ${i + 1}`}
                                onClick={() => goto(i)}
                                className="group relative h-11 flex-1 outline-none"
                            >
                                {/* The hit area is full height for accessibility;
                                    the visible rule sits centered inside. */}
                                <span
                                    className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2"
                                    style={{ backgroundColor: 'var(--color-portfolio-rule)' }}
                                />
                                <span
                                    className="absolute left-0 top-1/2 h-px -translate-y-1/2 transition-[width]"
                                    style={{
                                        backgroundColor: 'var(--color-portfolio-ink)',
                                        width: isActive ? '100%' : '0%',
                                        /* Match the slide's autoplay budget so the bar
                                         * fills in lockstep with the timer. Use a long
                                         * tail ease for that premium, calm feel. */
                                        transitionDuration: isActive && !paused ? `${durationMs}ms` : '500ms',
                                        transitionTimingFunction: isActive && !paused
                                            ? 'linear'
                                            : 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                                    }}
                                />
                            </button>
                        );
                    })}
                </div>

                {/* Prev / next arrows */}
                <div className="col-span-3 sm:col-span-2 flex justify-end gap-1">
                    <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => goto(index - 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:opacity-60"
                        style={{ borderColor: 'var(--color-portfolio-rule)', color: 'var(--color-portfolio-ink)' }}
                    >
                        <span aria-hidden>←</span>
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => goto(index + 1)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:opacity-60"
                        style={{ borderColor: 'var(--color-portfolio-rule)', color: 'var(--color-portfolio-ink)' }}
                    >
                        <span aria-hidden>→</span>
                    </button>
                </div>
            </div>
        </Container>
    );
}

/** Framed portrait. The source JPG has its own warm peach background
 *  (which happens to match our amber accent), so instead of treating it
 *  as a floating cut-out we present it as an editorial photo frame -
 *  clipped to a tall portrait aspect with a sand-toned offset block
 *  behind it for depth, and a burnt-amber diagonal crossing it for the
 *  ref-2 line motif.
 *
 *  `large`: hero placement vs. About placement (sizing only). */
function FramedPortrait({ large = false, decorative = false }: { large?: boolean; decorative?: boolean }) {
    const src = useImageWithFallback(PHOTO_SRC, PHOTO_FALLBACK);
    const maxW = large ? 'max-w-[460px]' : 'max-w-[380px]';
    return (
        <div className={`relative mx-auto w-full ${maxW}`}>
            {/* Sand block offset behind the frame - gives weight and depth. */}
            <span
                aria-hidden
                className="absolute -inset-x-3 -bottom-3 top-6"
                style={{ backgroundColor: 'var(--color-portfolio-bg-soft)' }}
            />

            {/* The frame itself - tall portrait aspect, photo cropped inside. */}
            <div
                className="relative z-10 aspect-[3/4] w-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-portfolio-bg-soft)' }}
            >
                <img
                    src={src}
                    alt={decorative ? '' : `${PROFILE.name}, ${PROFILE.role}`}
                    aria-hidden={decorative || undefined}
                    loading={large ? 'eager' : 'lazy'}
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </div>
        </div>
    );
}

function AboutPortrait() { return <FramedPortrait decorative />; }

/* ---------- 01 about --------------------------------------------------- */

function About() {
    return (
        <PanelRow
            id="about"
            ariaLabel="About"
            left={
                <Enter>
                    <p
                        className="mb-4 text-xs tracking-[0.2em] uppercase"
                        style={{ color: 'var(--color-portfolio-accent)' }}
                    >
                        01 - About
                    </p>
                    <h2
                        className="text-4xl leading-[0.95] sm:text-5xl"
                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                    >
                        About
                        <br />
                        <span style={{ color: 'var(--color-portfolio-accent)' }}>Me.</span>
                    </h2>

                    <AccentRule className="mt-6 mb-6" />

                    <div className="space-y-4 text-base leading-relaxed">
                        {BIO.map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>

                    <dl className="mt-8 grid grid-cols-2 gap-y-4 text-sm">
                        <div>
                            <dt className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--color-portfolio-muted)' }}>
                                Location
                            </dt>
                            <dd className="mt-1">{PROFILE.location}</dd>
                        </div>
                        <div>
                            <dt className="text-xs tracking-[0.2em] uppercase" style={{ color: 'var(--color-portfolio-muted)' }}>
                                Email
                            </dt>
                            <dd className="mt-1 break-all">
                                <a href={`mailto:${PROFILE.email}`} className="underline-offset-4 hover:underline">
                                    {PROFILE.email}
                                </a>
                            </dd>
                        </div>
                    </dl>
                </Enter>
            }
            right={
                <Enter delay={120}>
                    <div className="flex h-full items-center justify-center">
                        <AboutPortrait />
                    </div>
                </Enter>
            }
        />
    );
}

/* ---------- 02 projects (number-slide panels) ------------------------- */

function Projects() {
    return (
        <section id="projects" aria-labelledby="projects-heading" className="scroll-mt-20">
            {/* Section heading band */}
            <div className="border-t portfolio-rule" style={{ backgroundColor: 'var(--color-portfolio-bg)' }}>
                <Container>
                    <div className="grid grid-cols-1 gap-6 py-12 sm:py-16 lg:grid-cols-12 lg:items-end">
                        <div className="lg:col-span-7">
                            <p
                                className="mb-3 text-xs tracking-[0.2em] uppercase"
                                style={{ color: 'var(--color-portfolio-accent)' }}
                            >
                                02 - Work
                            </p>
                            <h2
                                id="projects-heading"
                                className="text-4xl leading-[0.95] sm:text-5xl"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                            >
                                Featured
                                <br />
                                <span style={{ color: 'var(--color-portfolio-accent)' }}>case study.</span>
                            </h2>
                        </div>
                        <p
                            className="max-w-prose text-base leading-relaxed lg:col-span-5"
                            style={{ color: 'var(--color-portfolio-ink)' }}
                        >
                            One project, looked at properly - the system, the scope, the
                            decisions that mattered. More on the way.
                        </p>
                    </div>
                </Container>
            </div>

            {PROJECTS.map((p, i) => (
                <NumberSlide key={p.number} project={p} reverse={i % 2 === 1} />
            ))}
        </section>
    );
}

/** A "Number slide" panel - text on one side, huge numeral with imagery
 *  clipped inside on the other. Alternates orientation row-to-row to keep
 *  the rhythm asymmetric. Now richer per-project: role/period meta line,
 *  editorial summary, a small list of concrete highlights, and a tagged
 *  stack. Empty `highlights`/`stack` arrays gracefully collapse so the
 *  same component renders the "next project" placeholder cleanly. */
function NumberSlide({ project, reverse }: { project: Project; reverse: boolean }) {
    const hasHighlights = project.highlights.length > 0;
    const hasStack = project.stack.length > 0;

    const Text = (
        <div>
            {/* Numeral word + role/period meta on the same baseline. */}
            <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
                <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: 'var(--color-portfolio-accent)' }}
                >
                    {project.word}
                </span>
                <span
                    className="text-xs tracking-[0.2em] uppercase"
                    style={{ color: 'var(--color-portfolio-muted)' }}
                >
                    {project.period}
                </span>
            </div>

            <h3
                className="text-3xl leading-[0.95] sm:text-4xl lg:text-5xl"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
            >
                {project.title}
            </h3>

            <p
                className="mt-3 text-sm tracking-wide"
                style={{ color: 'var(--color-portfolio-muted)' }}
            >
                {project.role}
            </p>

            <AccentRule className="mt-6 mb-6" />

            <p className="max-w-prose text-base leading-relaxed">
                {project.summary}
            </p>

            {hasHighlights && (
                <ul className="mt-6 space-y-3">
                    {project.highlights.map((h, i) => (
                        <li key={i} className="flex gap-3 text-sm leading-relaxed">
                            <span
                                aria-hidden
                                style={{ color: 'var(--color-portfolio-accent)' }}
                            >
                                -
                            </span>
                            <span>{h}</span>
                        </li>
                    ))}
                </ul>
            )}

            {hasStack && (
                <div className="mt-7">
                    <p
                        className="mb-2 text-[11px] tracking-[0.22em] uppercase"
                        style={{ color: 'var(--color-portfolio-muted)' }}
                    >
                        Stack
                    </p>
                    <ul className="flex flex-wrap gap-x-6 gap-y-4">
                        {project.stack.map((t) => (
                            <li key={t}>
                                <TechLogo name={t} displayLabel={t} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );

    const numeralImage = useImageWithFallback(project.image, project.imageFallback);
    const Numeral = (
        <Enter delay={80}>
            <div className="flex items-center justify-center">
                <ClippedNumeral value={project.number} image={numeralImage} ariaLabel={`Project ${project.number}`} />
            </div>
        </Enter>
    );

    const TextEntered = <Enter>{Text}</Enter>;

    return (
        <PanelRow
            left={reverse ? Numeral : TextEntered}
            right={reverse ? TextEntered : Numeral}
        />
    );
}

/* ---------- 03 experience --------------------------------------------- */

function Experience() {
    return (
        <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-20 border-t portfolio-rule">
            <Container>
                <div className="py-16 sm:py-24">
                    <Enter>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                            <div className="lg:col-span-7">
                                <p
                                    className="mb-3 text-xs tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--color-portfolio-accent)' }}
                                >
                                    03 - Experience
                                </p>
                                <h2
                                    id="experience-heading"
                                    className="text-4xl leading-[0.95] sm:text-5xl"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                                >
                                    Where I've
                                    <br />
                                    <span style={{ color: 'var(--color-portfolio-accent)' }}>worked.</span>
                                </h2>
                            </div>
                            <p
                                className="max-w-prose text-base leading-relaxed lg:col-span-5"
                                style={{ color: 'var(--color-portfolio-ink)' }}
                            >
                                A short timeline - the engineering work that taught me how
                                production systems behave, and the service work that taught
                                me how to talk to the people using them.
                            </p>
                        </div>
                    </Enter>

                    {/* Timeline list: left rail = period stamp, right column = entry. */}
                    <ol className="mt-12 space-y-12">
                        {EXPERIENCE.map((e, i) => (
                            <Enter key={`${e.org}-${e.period}`} delay={i * 100}>
                                <li className="grid grid-cols-1 gap-6 border-t portfolio-rule pt-8 lg:grid-cols-12">
                                <div className="lg:col-span-4">
                                    <p
                                        className="mb-2 text-[11px] tracking-[0.22em] uppercase"
                                        style={{
                                            color: e.kind === 'engineering'
                                                ? 'var(--color-portfolio-accent)'
                                                : 'var(--color-portfolio-muted)',
                                        }}
                                    >
                                        {e.kind === 'engineering' ? 'Engineering' : 'Service'}
                                    </p>
                                    <p
                                        className="text-sm tracking-wide"
                                        style={{ color: 'var(--color-portfolio-muted)' }}
                                    >
                                        {e.period}
                                    </p>
                                </div>

                                <div className="lg:col-span-8">
                                    <h3
                                        className="text-2xl sm:text-3xl"
                                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.015em' }}
                                    >
                                        {e.role}
                                    </h3>
                                    <p className="mt-1 text-sm" style={{ color: 'var(--color-portfolio-muted)' }}>
                                        {e.org} - {e.location}
                                    </p>

                                    <p className="mt-4 max-w-prose text-base leading-relaxed">
                                        {e.summary}
                                    </p>

                                    {e.highlights.length > 0 && (
                                        <ul className="mt-4 space-y-2">
                                            {e.highlights.map((h, i) => (
                                                <li key={i} className="flex gap-3 text-sm leading-relaxed">
                                                    <span aria-hidden style={{ color: 'var(--color-portfolio-accent)' }}>-</span>
                                                    <span>{h}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                </li>
                            </Enter>
                        ))}
                    </ol>
                </div>
            </Container>
        </section>
    );
}

/* ---------- 04 community --------------------------------------------- */

function Community() {
    return (
        <section id="community" aria-labelledby="community-heading" className="scroll-mt-20 border-t portfolio-rule">
            <Container>
                <div className="py-16 sm:py-24">
                    <Enter>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                            <div className="lg:col-span-7">
                                <p
                                    className="mb-3 text-xs tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--color-portfolio-accent)' }}
                                >
                                    04 - Community
                                </p>
                                <h2
                                    id="community-heading"
                                    className="text-4xl leading-[0.95] sm:text-5xl"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                                >
                                    Outside
                                    <br />
                                    <span style={{ color: 'var(--color-portfolio-accent)' }}>the editor.</span>
                                </h2>
                            </div>
                            <p
                                className="max-w-prose text-base leading-relaxed lg:col-span-5"
                                style={{ color: 'var(--color-portfolio-ink)' }}
                            >
                                Volunteer roles in student organisations and Google Developer
                                Group Bacolod - running events, planning budgets, and helping
                                other people get their work out the door.
                            </p>
                        </div>
                    </Enter>

                    <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        {COMMUNITY.map((c, i) => (
                            <Enter key={`${c.org}-${c.period}`} delay={i * 80}>
                                <li className="flex flex-col border-t portfolio-rule pt-6">
                                    <AccentRule className="mb-4" />
                                    <p
                                        className="mb-2 text-[11px] tracking-[0.22em] uppercase"
                                        style={{ color: 'var(--color-portfolio-muted)' }}
                                    >
                                        {c.period}
                                    </p>
                                    <h3
                                        className="text-xl sm:text-2xl"
                                        style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.015em' }}
                                    >
                                        {c.role}
                                    </h3>
                                    <p className="mt-1 text-sm" style={{ color: 'var(--color-portfolio-muted)' }}>
                                        {c.org}
                                    </p>
                                    <p className="mt-4 text-base leading-relaxed">
                                        {c.blurb}
                                    </p>
                                </li>
                            </Enter>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}

/* ---------- 05 skills -------------------------------------------------- */

/* Tech logo registry - SVG paths sourced from Simple Icons (simpleicons.org).
 * Each entry is { label, color, path } where `path` is the SVG d= attribute
 * for a 24x24 viewBox. Brand colors are the official Simple Icons hex values.
 * Items without a logo entry fall back to a plain text badge. */
const TECH_LOGOS: Record<string, { color: string; path: string }> = {
    HTML: {
        color: '#E34F26',
        path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z',
    },
    CSS: {
        color: '#1572B6',
        path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.003-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414v-.001z',
    },
    JavaScript: {
        color: '#F7DF1E',
        path: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.23-.51.169-1.574zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z',
    },
    TypeScript: {
        color: '#3178C6',
        path: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
    },
    ReactJS: {
        color: '#61DAFB',
        path: 'M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.74-2.852-1.708-2.852-2.476 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.492zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z',
    },
    Flutter: {
        color: '#02569B',
        path: 'M14.314 0L2.3 12 6 15.7 21.684.013h-7.357zm.014 11.072L7.857 17.53l6.47 6.47H21.7l-6.46-6.468 6.46-6.46h-7.37z',
    },
    PHP: {
        color: '#777BB4',
        path: 'M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .96-.109 1.211-.327.25-.218.43-.559.54-1.022.106-.45.09-.786-.05-1.006-.136-.22-.427-.293-.18-.293zM0 0v24h24V0H0zm20.985 6.053a2.27 2.27 0 0 1-.542 1.017 2.9 2.9 0 0 1-.928.65 3.59 3.59 0 0 1-.528.175 5.15 5.15 0 0 1-.665.084H15.3l-.442 2.265H12.84l1.403-7.193h4.038c.473 0 .855.094 1.145.28.29.188.47.454.544.799.072.345.036.743-.11 1.19a3.62 3.62 0 0 1-.875 1.733zm-3.99-1.558l-.367 1.887h.831c.43 0 .753-.068.97-.204.217-.136.36-.347.431-.631.063-.258.048-.456-.043-.593-.09-.137-.285-.206-.583-.206h-.84l.001-.253zM5.654 11.17l.526-2.695H8.2l-.526 2.695h-2.02zm8.34-.04c-.09.46-.32.83-.688 1.106a2.23 2.23 0 0 1-1.392.415H9.882l-1.407 7.2h-2.02l2.82-14.46h2.025l-.394 2.025h2.063c.74 0 1.285.215 1.637.645.353.43.435 1.022.248 1.77l-.457 2.3-.003-.001z',
    },
    Laravel: {
        color: '#FF2D20',
        path: 'M23.642 5.43a.364.364 0 0 1 .014.1v5.149c0 .135-.073.26-.189.326l-4.323 2.49v4.934a.378.378 0 0 1-.188.326L9.93 23.949a.316.316 0 0 1-.066.027c-.008.002-.016.008-.024.01a.348.348 0 0 1-.192 0c-.011-.002-.02-.008-.03-.012-.02-.008-.042-.014-.062-.025L.533 18.755a.376.376 0 0 1-.189-.326V2.974c0-.033.005-.066.014-.098.003-.012.01-.02.014-.032a.369.369 0 0 1 .023-.058c.004-.013.015-.022.023-.033l.033-.045c.012-.01.025-.018.037-.027.014-.012.027-.024.041-.034h.001L4.956.168a.376.376 0 0 1 .378 0L9.57 2.852h.002c.015.01.027.022.04.033l.038.027c.013.014.023.03.033.045.008.011.019.02.025.033.01.02.017.038.023.058.004.012.01.021.013.033.01.033.014.066.014.099v9.652l3.76-2.168V5.527c0-.033.005-.066.014-.098.003-.012.009-.021.013-.033a.3.3 0 0 1 .024-.058c.007-.013.017-.022.025-.033.01-.015.021-.03.033-.045.012-.01.025-.018.037-.027.014-.012.028-.024.042-.034h.001l4.955-2.685a.378.378 0 0 1 .378 0l4.956 2.685c.015.01.027.022.04.034.014.01.027.018.038.028.013.014.022.03.033.044.008.012.019.021.024.033.011.02.018.04.024.06.003.012.01.021.013.032zm-.74 5.032V6.179l-1.578.908-2.182 1.256v4.283zm-4.949 8.488v-4.287l-2.147 1.23-6.09 3.495v4.325zM1.096 4.884v13.54l8.378 4.82v-4.325l-4.376-2.493-.002-.003-.002-.002c-.014-.01-.025-.02-.037-.03-.011-.012-.023-.022-.033-.033l-.001-.004c-.01-.01-.016-.022-.024-.033-.007-.014-.016-.027-.021-.041-.007-.015-.01-.03-.015-.044-.004-.014-.009-.027-.01-.042-.003-.015-.003-.03-.004-.045-.001-.015 0-.03 0-.044v-9.22L4.864 6.07 1.096 4.884zm4.191-3.588L1.096 3.8l3.955 2.278 3.886-2.3zm4.308 7.989l-1.758 1.012-2.001 1.152v2.278l2.001-1.149 1.758-1.012V9.285zm6.933-4.405l-3.952 2.28 3.952 2.279 3.953-2.28zm-.394 5.006l-2.182-1.256-1.579-.908v4.283l2.182 1.256 1.579.908V9.886zm-9.424 2.849l.002-.004.009-.012-.011.016z',
    },
    Python: {
        color: '#3776AB',
        path: 'M14.31.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.83l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.23l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05L0 11.97l.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.24l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05 1.07.13zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09-.33.22zM21.1 6.11l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.04zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08-.33.23z',
    },
    Java: {
        color: '#007396',
        path: 'M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.113.828-.092.828-.092-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.821M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.587c-4.429 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.892 3.776-.892M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.355.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0-.001.07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.888 4.832-.001 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.19-7.627M9.734 23.924c4.322.277 10.959-.153 11.116-2.198 0 0-.302.775-3.572 1.391-3.688.694-8.239.613-10.937.168 0-.001.553.457 3.393.639',
    },
    MySQL: {
        color: '#4479A1',
        path: 'M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.151zM5.77 18.695h-.927a50.854 50.854 0 0 0-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 0 0-.195 4.41H0c.055-1.966.192-3.95.41-5.914h1.18l1.37 4.156h.015l1.37-4.156h1.11c.234 1.964.38 3.948.314 5.914zm4.68 0H9.295v-2.404c0-.896-.334-1.346-1.005-1.346-.654 0-.98.45-.98 1.346v2.404H6.165V14.77h1.14v.51h.016c.355-.385.852-.592 1.386-.592.975 0 1.742.6 1.742 1.896v2.111zm4.188-3.923c0 .13-.014.26-.026.39h-3.258c.057 1.152.636 1.474 1.37 1.474.537 0 1.004-.136 1.427-.369l.185.77c-.49.254-1.086.39-1.678.39-1.553 0-2.466-.966-2.466-2.447 0-1.48.876-2.519 2.308-2.519 1.307 0 2.138.95 2.138 2.311zm-3.262-.36h2.194c-.013-.808-.373-1.327-.968-1.327-.609 0-1.098.52-1.226 1.327zm13.678 4.283h-1.306l-1.516-4.527h.028l-1.503 4.527h-1.295l-2.015-5.914h1.258l1.37 4.527h.016l1.37-4.527h1.18l1.37 4.527h.014l1.38-4.527h1.238l-2.09 5.914zm4.985.13c-1.546 0-2.468-.966-2.468-2.447 0-1.48.932-2.519 2.468-2.519 1.554 0 2.468.966 2.468 2.447 0 1.48-.94 2.519-2.468 2.519zm0-.844c.74 0 1.23-.643 1.23-1.588 0-.93-.477-1.589-1.23-1.589-.77 0-1.242.643-1.242 1.589 0 .958.473 1.588 1.242 1.588zm6.26-4.544c-.14-.027-.28-.04-.42-.04-.648 0-1.113.496-1.113 1.366v3.032h-1.14V14.77h1.14v.6h.014c.257-.45.752-.71 1.298-.71.14 0 .282.013.422.04l-.2.897z',
    },
    Git: {
        color: '#F05032',
        path: 'M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187',
    },
    Vercel: {
        color: '#000000',
        path: 'M24 22.525H0l12-21.05 12 21.05z',
    },
    'Google Maps API': {
        color: '#4285F4',
        path: 'M12 0C7.802 0 4 3.403 4 7.602 4 11.8 7.469 16.812 12 24c4.531-7.188 8-12.2 8-16.398C20 3.403 16.199 0 12 0zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z',
    },
    'Inertia.js v3': {
        color: '#9553E9',
        path: 'M6.902 0L0 12l6.902 12H24L17.098 12 24 0z',
    },
    'Tailwind CSS v4': {
        color: '#06B6D4',
        path: 'M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z',
    },
    Pest: {
        color: '#B0272D',
        path: 'M23.542 11.626a11.627 11.627 0 0 1-4.743 9.397.604.604 0 0 1-.734-.956 10.397 10.397 0 0 0 4.243-8.441c0-5.74-4.678-10.397-10.448-10.397-.857 0-1.553.691-1.553 1.542s.696 1.542 1.553 1.542c3.995 0 7.24 3.228 7.24 7.198 0 1.963-.789 3.84-2.178 5.178a.606.606 0 0 1-.85-.023.595.595 0 0 1 .023-.845 5.97 5.97 0 0 0 1.81-4.31c0-3.314-2.712-6.01-6.045-6.01a6.027 6.027 0 0 0-6.045 6.01c0 2.04.996 3.887 2.654 4.992a5.024 5.024 0 0 1-.3-1.731 5.034 5.034 0 0 1 5.037-5.012 5.034 5.034 0 0 1 5.037 5.012 5.034 5.034 0 0 1-5.037 5.012 5.001 5.001 0 0 1-3.18-1.133c-.197.177-.4.347-.61.506a7.153 7.153 0 0 1-4.327 1.452C2.82 20.61 0 17.813 0 14.376c0-1.963.906-3.732 2.362-4.925a9.164 9.164 0 0 1-.147-1.626C2.215 3.517 6.748 0 12.286 0c6.213 0 11.256 5.01 11.256 11.626zM9.84 15.886a3.84 3.84 0 0 0 2.02.571 3.846 3.846 0 0 0 3.844-3.828 3.846 3.846 0 0 0-3.844-3.828 3.846 3.846 0 0 0-3.844 3.828c0 .754.22 1.472.611 2.08l.052-.049a2.413 2.413 0 0 1 1.65-.658c.655 0 1.265.25 1.726.704a2.39 2.39 0 0 1 .71 1.697c0 .07-.005.138-.013.205a2.42 2.42 0 0 1-.912-.722zm-.578.858a1.208 1.208 0 0 0 .848 2.065 1.208 1.208 0 0 0 .848-2.065 1.208 1.208 0 0 0-1.696 0z',
    },
};

/* Spoken languages have no logo - rendered as plain tagged text. */
const SPOKEN_LANGUAGES = [
    { lang: 'English', level: 'Professional' },
    { lang: 'Filipino / Tagalog', level: 'Native' },
    { lang: 'Hiligaynon', level: 'Native' },
];

/* Tech groups for the logo grid - items must exist in TECH_LOGOS. */
const SKILL_GROUPS: { group: string; items: string[] }[] = [
    { group: 'Frontend',         items: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'ReactJS', 'Flutter'] },
    { group: 'Backend',          items: ['PHP', 'Laravel', 'Python', 'Java'] },
    { group: 'Database & Tools', items: ['MySQL', 'Git', 'Vercel'] },
];

/* Aliases so versioned stack strings ("Laravel 13", "React 19", etc.)
 * resolve to the right TECH_LOGOS key. */
const LOGO_ALIASES: Record<string, string> = {
    'Laravel 13':       'Laravel',
    'React 19':         'ReactJS',
    'React':            'ReactJS',
    'Inertia.js v3':    'Inertia.js v3',
    'Tailwind CSS v4':  'Tailwind CSS v4',
    'TypeScript':       'TypeScript',
};

function resolveLogoKey(name: string): string {
    return LOGO_ALIASES[name] ?? name;
}

/* `displayLabel` — what to show below the icon (defaults to `name`).
 * Lets callers pass versioned strings like "Laravel 13" while the logo
 * lookup normalises to "Laravel". */
function TechLogo({ name, displayLabel }: { name: string; displayLabel?: string }) {
    const key  = resolveLogoKey(name);
    const logo = TECH_LOGOS[key];
    const label = displayLabel ?? name;
    if (!logo) {
        return (
            <div className="flex flex-col items-center gap-2">
                <div
                    className="flex h-12 w-12 items-center justify-center rounded border portfolio-rule text-[10px] font-medium tracking-wide uppercase"
                    style={{ color: 'var(--color-portfolio-muted)' }}
                >
                    {label.slice(0, 3)}
                </div>
                <span className="text-center text-[11px] leading-tight tracking-wide" style={{ color: 'var(--color-portfolio-muted)' }}>{label}</span>
            </div>
        );
    }
    return (
        <div className="group flex flex-col items-center gap-2">
            <div
                className="flex h-12 w-12 items-center justify-center rounded transition-all duration-300"
                style={{ color: 'var(--color-portfolio-muted)' }}
                title={label}
            >
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    aria-label={label}
                    className="h-8 w-8 transition-all duration-300 group-hover:scale-110"
                    style={{ fill: 'var(--color-portfolio-muted)', transitionProperty: 'fill, transform' }}
                    onMouseEnter={e => (e.currentTarget.style.fill = logo.color)}
                    onMouseLeave={e => (e.currentTarget.style.fill = 'var(--color-portfolio-muted)')}
                >
                    <path d={logo.path} />
                </svg>
            </div>
            <span
                className="text-center text-[11px] leading-tight tracking-wide"
                style={{ color: 'var(--color-portfolio-muted)' }}
            >
                {label}
            </span>
        </div>
    );
}

function Skills() {
    return (
        <section id="skills" aria-labelledby="skills-heading" className="scroll-mt-20 border-t portfolio-rule">
            <Container>
                <div className="py-16 sm:py-24">
                    <Enter>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                            <div className="lg:col-span-7">
                                <p
                                    className="mb-3 text-xs tracking-[0.2em] uppercase"
                                    style={{ color: 'var(--color-portfolio-accent)' }}
                                >
                                    05 - Skills
                                </p>
                                <h2
                                    id="skills-heading"
                                    className="text-4xl leading-[0.95] sm:text-5xl"
                                    style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                                >
                                    Tools of the
                                    <br />
                                    <span style={{ color: 'var(--color-portfolio-accent)' }}>Trade.</span>
                                </h2>
                            </div>
                            <p
                                className="max-w-prose text-base leading-relaxed lg:col-span-5"
                                style={{ color: 'var(--color-portfolio-ink)' }}
                            >
                                The stack I reach for most. Hover each logo to see its brand color.
                                Comfortable across the full boundary between server and client.
                            </p>
                        </div>
                    </Enter>

                    {/* Tech logo grid - one group per row, icons colored on hover. */}
                    <div className="mt-12 space-y-12">
                        {SKILL_GROUPS.map((group, i) => (
                            <Enter key={group.group} delay={i * 80}>
                                <div className="border-t portfolio-rule pt-8">
                                    <AccentRule className="mb-4" />
                                    <p
                                        className="mb-6 text-[11px] tracking-[0.22em] uppercase"
                                        style={{ color: 'var(--color-portfolio-muted)' }}
                                    >
                                        {group.group}
                                    </p>
                                    <ul className="flex flex-wrap gap-8">
                                        {group.items.map((name) => (
                                            <li key={name}>
                                                <TechLogo name={name} />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Enter>
                        ))}
                    </div>

                    {/* Spoken languages - no logos, plain text treatment. */}
                    <Enter delay={SKILL_GROUPS.length * 80}>
                        <div className="mt-12 border-t portfolio-rule pt-8">
                            <AccentRule className="mb-4" />
                            <p
                                className="mb-6 text-[11px] tracking-[0.22em] uppercase"
                                style={{ color: 'var(--color-portfolio-muted)' }}
                            >
                                Spoken Languages
                            </p>
                            <ul className="flex flex-wrap gap-6">
                                {SPOKEN_LANGUAGES.map((l) => (
                                    <li key={l.lang} className="flex flex-col">
                                        <span className="text-base">{l.lang}</span>
                                        <span
                                            className="text-[11px] tracking-[0.16em] uppercase"
                                            style={{ color: 'var(--color-portfolio-accent)' }}
                                        >
                                            {l.level}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Enter>
                </div>
            </Container>
        </section>
    );
}

/* ---------- 06 contact ------------------------------------------------- */

function Contact() {
    return (
        <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-20 border-t portfolio-rule">
            <Container>
                <div className="grid grid-cols-1 gap-10 py-16 sm:py-24 md:grid-cols-12 md:gap-8">
                    <Enter className="md:col-span-7">
                        <div>
                            <p
                                className="mb-3 text-xs tracking-[0.2em] uppercase"
                                style={{ color: 'var(--color-portfolio-accent)' }}
                            >
                                06 - Contact
                            </p>
                            <h2
                                id="contact-heading"
                                className="text-4xl leading-[0.95] sm:text-5xl"
                                style={{ fontFamily: 'var(--font-display)', fontWeight: 300, letterSpacing: '-0.02em' }}
                            >
                                Let's build
                                <br />
                                <span style={{ color: 'var(--color-portfolio-accent)' }}>something.</span>
                            </h2>

                            <AccentRule className="mt-6 mb-6" />

                            <p className="max-w-prose text-base leading-relaxed sm:text-lg">
                                The best way to reach me is by email. I read every message and
                                usually reply within a day or two.
                            </p>

                            <a
                                href={`mailto:${PROFILE.email}`}
                                className="mt-8 inline-block text-2xl sm:text-3xl lg:text-4xl underline-offset-[6px] hover:underline"
                                style={{
                                    fontFamily: 'var(--font-display)',
                                    color: 'var(--color-portfolio-accent)',
                                    letterSpacing: '-0.01em',
                                }}
                            >
                                {PROFILE.email} →
                            </a>

                            <div className="mt-10">
                                <a
                                    href={RESUME_HREF}
                                    className="inline-flex h-12 min-w-[44px] items-center gap-2 px-6 text-sm font-semibold tracking-widest uppercase text-white"
                                    style={{ backgroundColor: 'var(--color-portfolio-accent)' }}
                                >
                                    Download Resume ↓
                                </a>
                            </div>
                        </div>
                    </Enter>

                    <Enter delay={120} className="md:col-span-5">
                        <aside>
                            <h3
                                className="mb-4 text-xs tracking-[0.2em] uppercase"
                                style={{ color: 'var(--color-portfolio-muted)' }}
                            >
                                Elsewhere
                            </h3>
                            <ul className="space-y-3 text-base">
                                {PROFILE.socials.map((s) => (
                                    <li key={s.label} className="border-b portfolio-rule pb-3">
                                        <a
                                            href={s.href}
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="group flex items-center justify-between"
                                        >
                                            <span>{s.label}</span>
                                            <span
                                                aria-hidden
                                                className="transition-transform group-hover:translate-x-1"
                                                style={{ color: 'var(--color-portfolio-accent)' }}
                                            >
                                                ↗
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </aside>
                    </Enter>
                </div>
            </Container>
        </section>
    );
}

/* ---------- footer ----------------------------------------------------- */

function Footer() {
    return (
        <footer className="border-t portfolio-rule">
            <Container>
                <div
                    className="flex flex-col items-start justify-between gap-3 py-8 text-xs tracking-widest uppercase sm:flex-row sm:items-center"
                    style={{ color: 'var(--color-portfolio-muted)' }}
                >
                    <span>
                        © {new Date().getFullYear()} {PROFILE.name}
                    </span>
                    <span>Designed &amp; built with care.</span>
                </div>
            </Container>
        </footer>
    );
}
