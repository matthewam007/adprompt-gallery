import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-nav shell">
        <Link href="/" className="wordmark" aria-label="PromptSwipe home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 56 44" role="img">
              <rect x="32" y="3" width="8" height="5" rx="1.7" />
              <rect x="25" y="10" width="14" height="5" rx="1.7" />
              <rect x="16" y="17" width="25" height="5" rx="1.7" />
              <rect x="1" y="24" width="32" height="5" rx="1.7" />
              <rect x="13" y="31" width="25" height="5" rx="1.7" />
              <rect x="41" y="14" width="8" height="5" rx="1.7" />
              <rect x="36" y="21" width="18" height="5" rx="1.7" />
              <rect x="34" y="28" width="15" height="5" rx="1.7" />
              <rect x="49" y="28" width="6" height="5" rx="1.7" />
              <rect x="8" y="36" width="10" height="5" rx="1.7" />
              <rect x="22" y="38" width="7" height="5" rx="1.7" />
              <rect x="34" y="36" width="11" height="5" rx="1.7" />
              <rect x="28" y="0" width="6" height="4" rx="1.5" />
              <rect x="20" y="38" width="5" height="5" rx="1.7" />
            </svg>
          </span>
          PromptSwipe
        </Link>
        <Link href="/">Back to gallery</Link>
      </header>

      <article className="about-essay shell">
        <h1>
          If you are reading&nbsp;this,
          <br />
          you probably love ads&nbsp;too.
        </h1>

        <p>The good ones.</p>

        <p>
          The ones where a strange little character, a sharp crop, or one perfect pop of color makes you
          stop and think, &quot;Wait, that looks amazing.&quot;
        </p>

        <p>So you read the headline.</p>

        <p>Then the headline gives the image a reason.</p>

        <p>Then the copy names something you have felt but maybe never said out loud.</p>

        <p>Then the offer makes your life seem a little easier.</p>

        <p>
          Then the button feels less like a button and more like the next sentence in the conversation.
        </p>

        <p>That is what a good ad does.</p>

        <p>It moves you, one small yes at a time.</p>

        <p>And when it works, it feels simple.</p>

        <p>But simple is not the same as easy.</p>

        <p>Someone had to care.</p>

        <p>
          Someone had to step inside the customer&apos;s head for a while. What are they tired of? What do
          they secretly want? What would make them feel smarter, faster, calmer, more in control? What
          would make them say, &quot;Oh, that&apos;s exactly it&quot;?
        </p>

        <p>That is the part worth studying.</p>

        <p>Especially now.</p>

        <p>AI can make endless ads.</p>

        <p>
          Endless hooks.
          <br />
          Endless versions.
          <br />
          Endless almost-good ideas.
        </p>

        <p>But more is not better.</p>

        <p>A good ad still needs taste. A point of view. A real thought behind it.</p>

        <p>PromptSwipe is a place to study that.</p>

        <p>Ads worth looking at twice, and the prompts behind them.</p>

        <p>Not so you can copy the surface.</p>

        <p>So you can understand the bones.</p>

        <p>
          The visual hook.
          <br />
          The headline turn.
          <br />
          The offer.
          <br />
          The rhythm.
          <br />
          The reason it made you care.
        </p>

        <p>Because the best ads are not accidents.</p>

        <p>They are made by people who think deeply about what others feel quickly.</p>

        <p>People who understand that a square can hold a whole little world.</p>

        <p>If you breathe that air, you are in the right place.</p>

        <p className="about-signoff">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 56 44" role="img">
              <rect x="32" y="3" width="8" height="5" rx="1.7" />
              <rect x="25" y="10" width="14" height="5" rx="1.7" />
              <rect x="16" y="17" width="25" height="5" rx="1.7" />
              <rect x="1" y="24" width="32" height="5" rx="1.7" />
              <rect x="13" y="31" width="25" height="5" rx="1.7" />
              <rect x="41" y="14" width="8" height="5" rx="1.7" />
              <rect x="36" y="21" width="18" height="5" rx="1.7" />
              <rect x="34" y="28" width="15" height="5" rx="1.7" />
              <rect x="49" y="28" width="6" height="5" rx="1.7" />
              <rect x="8" y="36" width="10" height="5" rx="1.7" />
              <rect x="22" y="38" width="7" height="5" rx="1.7" />
              <rect x="34" y="36" width="11" height="5" rx="1.7" />
              <rect x="28" y="0" width="6" height="4" rx="1.5" />
              <rect x="20" y="38" width="5" height="5" rx="1.7" />
            </svg>
          </span>
          Welcome to PromptSwipe.
        </p>
      </article>
    </main>
  );
}
