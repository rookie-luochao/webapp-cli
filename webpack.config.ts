// import { generateClientFromConfig } from "@querycap-dev/generate-client";
import { withPresets } from "@querycap-dev/webpack-preset";
import { withAssetsPreset } from "@querycap-dev/webpack-preset-assets";
import { withHTMLPreset } from "@querycap-dev/webpack-preset-html";
import { withTsPreset } from "@querycap-dev/webpack-preset-ts";
import { set } from "lodash";
import { ContextReplacementPlugin, DefinePlugin, ProvidePlugin } from "webpack";

export = withPresets(
  (c, state) => {
    console.log(state);

    set(c, "devServer", {
      browserSync: { https: true },
    });

    // generate client from swagger
    // if (!state.flags.production && !process.env.SKIP_CLIENT) {
    //   generateClientFromConfig(state.meta.config, {
    //     cwd: __dirname,
    //     clientCreator: "@querycap/request.createRequestActor",
    //   });
    // }

  },
  withTsPreset({
    polyfill: /babel|core-js/,
    d3: /d3-shape|d3-path/,
    styling: /polished|emotion|react-spring/,
    core: /react|reactorx|scheduler|history|axios/,
    utils: /buffer|date-fns|moment|lodash|rxjs/,
    markdown: /unified|remark|remark-react|quill|react-quill/,
  }),
  (c, state) => {
    c.plugins?.push(
      new DefinePlugin({
        "process.env.APP": JSON.stringify(state.name),
        "process.state": JSON.stringify(state),
      }),
    );

    c.plugins?.push(new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/));

    c.plugins?.push(
      new ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
        process: "process",
      }),
    );

    c.resolve!.alias = {
      // "@turf/turf$": "@turf/turf/index.js",
      // "turf-jsts$": "turf-jsts/jsts.mjs",
      path: "path-browserify", // yarn add -D path-browserify
      stream: "stream-browserify", // yarn add -D stream-browserify
      lodash$: "lodash-es",
      "@core": "src-core/core",
    };
  },
  withAssetsPreset(),
  withHTMLPreset(),
);
