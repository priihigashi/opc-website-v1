import { useLayoutEffect, useRef } from "react";

const TITLE_CASE_REPLACEMENTS = new Map([
  ["One team.", "One Team."],
  ["Every detail.", "Every Detail."],
  ["The bones", "The Bones"],
  ["come first.", "Come First."],
  ["reimagined.", "Reimagined."],
  ["Grow without", "Grow Without"],
  ["moving.", "Moving."],
  ["The backyard,", "The Backyard,"],
  ["built in.", "Built in."],
  ["that lasts.", "That Lasts."],
  ["Structure to finish.", "Structure to Finish."],
  ["Under one team.", "Under One Team."],
  ["One team sees the whole home.", "One Team Sees the Whole Home."],
  ["Every detail works together.", "Every Detail Works Together."],
  ["not promises.", "Not Promises."],
  ["Crafted for daily living", "Crafted for Daily Living"],
  ["Quiet materials, precise finish", "Quiet Materials, Precise Finish"],
  ["Built for the evening", "Built for the Evening"],
  ["The work speaks", "The Work Speaks"],
  ["through the people who live with it.", "Through the People Who Live with It."],
  ["Your house is", "Your House Is"],
  ["the next one on screen.", "the Next One on Screen."],
  ["One house. Choose its next chapter.", "One House. Choose Its Next Chapter."],
  ["Real work.", "Real Work."],
  ["Clearly organized.", "Clearly Organized."],
  ["Your project can be the next documented transformation.", "Your Project Can Be the Next Documented Transformation."],
]);

const TITLE_SELECTORS = "h1, h2, h3, figcaption .font-editorial";

function applyTitleCase(root) {
  root.querySelectorAll(TITLE_SELECTORS).forEach((title) => {
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const original = node.nodeValue || "";
      const trimmed = original.trim();
      const replacement = TITLE_CASE_REPLACEMENTS.get(trimmed);
      if (!replacement) return;
      node.nodeValue = original.replace(trimmed, replacement);
    });
  });
}

export default function TitleCaseAuditV1({ children }) {
  const scopeRef = useRef(null);

  useLayoutEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return undefined;

    applyTitleCase(scope);
    const observer = new MutationObserver(() => applyTitleCase(scope));
    observer.observe(scope, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={scopeRef} className="contents">{children}</div>;
}
