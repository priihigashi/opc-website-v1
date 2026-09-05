import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectGalleryV4 from "@/pages/ProjectGalleryV4";

// V5 preserves the V4 gallery exactly and fixes only route-entry position.
// Project pages must open at their own header instead of inheriting the
// Portfolio listing's scroll position.
export default function ProjectGalleryV5({ children }) {
  const { projectId } = useParams();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [projectId]);

  return children || <ProjectGalleryV4 />;
}
