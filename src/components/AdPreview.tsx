import Image from "next/image";
import { getAccessibleTitle } from "@/lib/creative-display";
import type { Creative } from "@/types/creative";

type AdPreviewProps = {
  creative: Creative;
  large?: boolean;
};

export function AdPreview({ creative, large = false }: AdPreviewProps) {
  if (creative.image) {
    return (
      <div className={`ad-preview ad-preview-image ${large ? "ad-preview-large" : ""}`}>
        <Image src={creative.image} alt={getAccessibleTitle(creative)} fill sizes={large ? "1080px" : "33vw"} />
      </div>
    );
  }

  return (
    <div
      className={`ad-preview ${large ? "ad-preview-large" : ""}`}
      style={
        {
          "--preview-bg": creative.visual.background,
          "--preview-accent": creative.visual.accent,
        } as React.CSSProperties
      }
    >
      <div className="ad-preview-top">
        <span>{creative.brandInspiration} study</span>
        <span>{creative.format}</span>
      </div>
      <div className="ad-preview-body">
        <div>
          <h3>{creative.visual.headline}</h3>
          <p>{creative.visual.subline}</p>
        </div>
        <Motif motif={creative.visual.motif} />
      </div>
      <div className="ad-preview-footer">
        <span>{creative.industry}</span>
        <span>{creative.aspectRatio}</span>
      </div>
    </div>
  );
}

function Motif({ motif }: { motif: Creative["visual"]["motif"] }) {
  if (motif === "code" || motif === "terminal") {
    return (
      <div className="motif motif-code" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (motif === "chat") {
    return (
      <div className="motif motif-chat" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (motif === "timeline") {
    return (
      <div className="motif motif-timeline" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  if (motif === "shield") {
    return <div className="motif motif-shield" aria-hidden="true" />;
  }

  if (motif === "canvas") {
    return (
      <div className="motif motif-canvas" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    );
  }

  return (
    <div className="motif motif-document" aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </div>
  );
}
