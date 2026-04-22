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
  stage?: "draft" | "staged" | "published" | "rolled-back" | undefined;
  stagedRevision?: number | undefined;
  rollbackTarget?: number | undefined;
  owner?: string | undefined;
  policyProfile?: string | undefined;
  previewUrl?: string | undefined;
  testEvidence?: Array<{
    id: string;
    label: string;
    passed: boolean;
    href?: string | undefined;
  }> | undefined;
  diff?: string[] | undefined;
  publishApproval?:
    | {
        required: boolean;
        state: "pending" | "approved" | "rejected";
        approverId?: string | undefined;
      }
    | undefined;
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
    publishedRevision: nextRevision,
    stage: "published",
    stagedRevision: undefined,
    rollbackTarget: contract.publishedRevision,
    publishApproval: contract.publishApproval
      ? {
          ...contract.publishApproval,
          state: "approved"
        }
      : contract.publishApproval
  });
}

export function stageBuilderRevision(
  contract: BuilderPublishContract,
  nextRevision: number,
  input: {
    owner: string;
    policyProfile: string;
    previewUrl?: string | undefined;
    testEvidence?: BuilderPublishContract["testEvidence"] | undefined;
    diff?: string[] | undefined;
    publishApprovalRequired?: boolean | undefined;
  }
): BuilderPublishContract {
  if (nextRevision <= contract.revision) {
    throw new Error(`builder stage conflict: revision ${nextRevision} is not newer than ${contract.revision}`);
  }

  return createBuilderPublishContract({
    ...contract,
    revision: nextRevision,
    stage: "staged",
    stagedRevision: nextRevision,
    owner: input.owner,
    policyProfile: input.policyProfile,
    ...(input.previewUrl ? { previewUrl: input.previewUrl } : {}),
    ...(input.testEvidence ? { testEvidence: [...input.testEvidence] } : {}),
    ...(input.diff ? { diff: [...input.diff] } : {}),
    publishApproval: {
      required: input.publishApprovalRequired ?? true,
      state: input.publishApprovalRequired === false ? "approved" : "pending"
    }
  });
}

export function publishBuilderRevision(
  contract: BuilderPublishContract,
  input: {
    approverId?: string | undefined;
  } = {}
): BuilderPublishContract {
  if (contract.stage !== "staged" || contract.stagedRevision === undefined) {
    throw new Error("builder publish requires a staged revision");
  }
  if (contract.publishApproval?.required && contract.publishApproval.state === "rejected") {
    throw new Error("builder publish blocked by rejected approval");
  }

  return createBuilderPublishContract({
    ...contract,
    publishedRevision: contract.stagedRevision,
    stage: "published",
    stagedRevision: undefined,
    rollbackTarget: contract.publishedRevision,
    publishApproval: contract.publishApproval
      ? {
          ...contract.publishApproval,
          state: "approved",
          ...(input.approverId ? { approverId: input.approverId } : {})
        }
      : contract.publishApproval
  });
}

export function rollbackBuilderRevision(contract: BuilderPublishContract, targetRevision: number): BuilderPublishContract {
  if (contract.publishedRevision === undefined) {
    throw new Error("builder rollback requires a published revision");
  }
  if (targetRevision > contract.publishedRevision) {
    throw new Error(`builder rollback target ${targetRevision} cannot exceed published revision ${contract.publishedRevision}`);
  }

  return createBuilderPublishContract({
    ...contract,
    publishedRevision: targetRevision,
    stage: "rolled-back",
    rollbackTarget: targetRevision
  });
}

export function diffBuilderPayload(previous: Record<string, unknown>, next: Record<string, unknown>): string[] {
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)]);
  return [...keys]
    .sort((left, right) => left.localeCompare(right))
    .flatMap((key) => {
      const before = JSON.stringify(previous[key] ?? null);
      const after = JSON.stringify(next[key] ?? null);
      if (before === after) {
        return [];
      }
      return [`${key}: ${before} -> ${after}`];
    });
}

export function simulateBuilderPublish(contract: BuilderPublishContract): {
  canPublish: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];
  if (contract.stage !== "staged") {
    blockers.push("builder revision is not staged");
  }
  if ((contract.testEvidence ?? []).some((entry) => !entry.passed)) {
    blockers.push("builder test evidence contains failures");
  }
  if (contract.publishApproval?.required && contract.publishApproval.state !== "approved" && contract.publishApproval.state !== "pending") {
    blockers.push("builder approval has been rejected");
  }

  return {
    canPublish: blockers.length === 0,
    blockers
  };
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
