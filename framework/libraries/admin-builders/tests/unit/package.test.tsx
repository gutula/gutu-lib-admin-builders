import { describe, expect, it } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  BuilderCanvas,
  BuilderHost,
  BuilderInspector,
  BuilderPalette,
  assertBuilderRevision,
  diffBuilderPayload,
  publishBuilderRevision,
  rollbackBuilderRevision,
  simulateBuilderPublish,
  stageBuilderRevision,
  createBuilderPanelLayout,
  createBuilderPublishContract,
  defineBuilder,
  packageId
} from "../../src";

describe("admin-builders", () => {
  it("exposes a stable package id", () => {
    expect(packageId).toBe("admin-builders");
  });

  it("defines builders and prevents stale publish revisions", () => {
    const builder = defineBuilder({
      id: "workflow-builder",
      label: "Workflow Builder",
      host: "admin",
      route: "/admin/tools/workflow-builder",
      permission: "workflow.builder.use",
      mode: "embedded-or-zone"
    });
    const contract = createBuilderPublishContract({
      id: "layout-1",
      revision: 2
    });

    expect(builder.route).toBe("/admin/tools/workflow-builder");
    expect(assertBuilderRevision(contract, 3).publishedRevision).toBe(3);
    expect(() => assertBuilderRevision(contract, 2)).toThrow("builder publish conflict");
  });

  it("supports staged publish simulation, diffing, publish, and rollback flows", () => {
    const staged = stageBuilderRevision(
      createBuilderPublishContract({
        id: "layout-2",
        revision: 4,
        publishedRevision: 3,
        stage: "draft"
      }),
      5,
      {
        owner: "actor-admin",
        policyProfile: "policy.strict",
        previewUrl: "/preview/layout-2",
        testEvidence: [
          {
            id: "test:1",
            label: "Builder smoke",
            passed: true
          }
        ],
        diff: diffBuilderPayload({ title: "Old" }, { title: "New", status: "staged" })
      }
    );

    expect(staged.stage).toBe("staged");
    expect(simulateBuilderPublish(staged).canPublish).toBe(true);
    expect(staged.diff?.some((entry) => entry.includes("title"))).toBe(true);

    const published = publishBuilderRevision(staged, {
      approverId: "approver-1"
    });
    const rolledBack = rollbackBuilderRevision(published, 3);

    expect(published.stage).toBe("published");
    expect(published.publishedRevision).toBe(5);
    expect(rolledBack.stage).toBe("rolled-back");
    expect(rolledBack.publishedRevision).toBe(3);
  });

  it("renders multi-panel builder host panels", () => {
    const markup = renderToStaticMarkup(
      React.createElement(BuilderHost, {
        layout: createBuilderPanelLayout({ left: "palette", center: "canvas", right: "inspector" }),
        palette: React.createElement(BuilderPalette, {
          items: [{ id: "text", label: "Text" }]
        }),
        canvas: React.createElement(BuilderCanvas, { title: "Canvas" }, "Preview"),
        inspector: React.createElement(BuilderInspector, { title: "Inspector" }, "Properties")
      })
    );

    expect(markup).toContain("Palette");
    expect(markup).toContain("Canvas");
    expect(markup).toContain("Inspector");
  });
});
