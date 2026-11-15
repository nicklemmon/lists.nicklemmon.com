import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // This page has no imported modules to preload.
    modulePreload: false,
  },
  plugins: [{
    name: "single-page-output",
    enforce: "post",
    generateBundle: {
      order: "post",
      handler(_, bundle) {
        const page = bundle["index.html"];
        if (!page || page.type !== "asset") this.error("Missing index.html");
        let html = String(page.source);
        let script = "";

        // The entire stylesheet is small: inline it to avoid a blocking request.
        html = html.replace(/<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"]+)"[^>]*>/g, (_, file) => {
          const asset = bundle[file];
          if (!asset || asset.type !== "asset") this.error(`Missing stylesheet: ${file}`);
          delete bundle[file];
          return `<style>${String(asset.source)}</style>`;
        });

        // Keep the tiny theme script after the markup it operates on.
        html = html.replace(/<script\b[^>]*src="\/([^"]+)"[^>]*><\/script>/g, (_, file) => {
          const chunk = bundle[file];
          if (!chunk || chunk.type !== "chunk" || chunk.imports.length || chunk.dynamicImports.length) {
            this.error("Single-page output requires a self-contained script");
          }
          script += chunk.code.replace(/<\/script/gi, "<\\/script");
          delete bundle[file];
          return "";
        });
        html = html.replace("</body>", `<script type="module">${script}</script></body>`);
        // Remove formatting between tags, preserving text and script contents.
        page.source = html.replace(/>\s+</g, "><").trim();
      },
    },
  }],
});
