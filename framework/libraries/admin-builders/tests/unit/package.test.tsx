import { describe, expect, it } from "bun:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  BuilderCanvas,
  BuilderHost,
  BuilderInspector,
  BuilderPalette,
  assertBuilderRevision,
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
