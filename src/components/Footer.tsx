// Shared footer for the popup and the Options page, modeled on SnowRaven's
// centered contentinfo footer: a link to the repo and a link to the docs.

const REPO = 'https://github.com/dtgibson/snowraven-mini';
const HELP = 'https://github.com/dtgibson/snowraven-mini/blob/main/docs/HELP.md';

export function Footer() {
  return (
    <footer className="sr-footer" role="contentinfo">
      <a href={REPO} target="_blank" rel="noreferrer">
        SnowRaven Mini
      </a>
      <span aria-hidden="true"> · </span>
      <a href={HELP} target="_blank" rel="noreferrer">
        Help
      </a>
    </footer>
  );
}
