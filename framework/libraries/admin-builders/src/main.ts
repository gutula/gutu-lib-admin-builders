import React from "react";

import { defineBuilder } from "@platform/admin-contracts";
import { SplitPanelLayout } from "@platform/layout";
import { cn } from "@platform/ui";

export const packageId = "admin-builders" as const;
export const packageDisplayName = "Admin Builders" as const;
export const packageDescription = "Builder host contracts, publish helpers, and multi-panel editor primitives." as const;

export type BuilderPanelLayout = {
  left: "palette" | "data";
  center: "canvas" | "preview";
  right: "inspector" | "settings";
};

export type BuilderPublishContract = {
  id: string;
  revision: number;
  publishedRevision?: number | undefined;
};

export function createBuilderPanelLayout(layout: BuilderPanelLayout): BuilderPanelLayout {
  return Object.freeze(layout);
}

export function createBuilderPublishContract(input: BuilderPublishContract): BuilderPublishContract {
  return Object.freeze(input);
}

export function assertBuilderRevision(
  contract: BuilderPublishContract,
  nextRevision: number
): BuilderPublishContract {
  if (nextRevision <= contract.revision) {
    throw new Error(`builder publish conflict: revision ${nextRevision} is not newer than ${contract.revision}`);
  }
  return createBuilderPublishContract({
    ...contract,
    revision: nextRevision,
    publishedRevision: nextRevision
  });
}

export function BuilderPalette(props: {
  items: Array<{ id: string; label: string }>;
}) {
  return React.createElement(
    "aside",
    { className: "awb-builder-panel awb-builder-palette" },
    React.createElement("h2", { className: "awb-panel-kicker" }, "Palette"),
    props.items.map((item) =>
      React.createElement(
        "div",
        { key: item.id, className: "awb-builder-chip" },
        item.label
      )
    )
  );
}

export function BuilderCanvas(props: {
  title: string;
  children?: React.ReactNode;
}) {
  return React.createElement(
    "section",
    { className: cn("awb-builder-panel awb-builder-canvas") },
    React.createElement("h2", { className: "awb-panel-title" }, props.title),
    props.children
  );
}

export function BuilderInspector(props: {
  title: string;
  children?: React.ReactNode;
}) {
  return React.createElement(
    "aside",
    { className: "awb-builder-panel awb-builder-inspector" },
    React.createElement("h2", { className: "awb-panel-kicker" }, props.title),
    props.children
  );
}

export function BuilderHost(props: {
  layout: BuilderPanelLayout;
  palette: React.ReactNode;
  canvas: React.ReactNode;
  inspector: React.ReactNode;
}) {
  return React.createElement(
    "div",
    {
      className: "awb-builder-host",
      "data-testid": "builder-host"
    },
    React.createElement(SplitPanelLayout, {
      left: props.palette,
      center: props.canvas,
      right: props.inspector
    })
  );
}

export { defineBuilder };
