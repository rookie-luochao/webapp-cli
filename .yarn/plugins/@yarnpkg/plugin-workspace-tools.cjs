/* eslint-disable */
module.exports = {
  name: "@yarnpkg/plugin-workspace-tools",
  factory: function (require) {
    var plugin;
    plugin = (() => {
      "use strict";
      var e = {
          115: (e, t, n) => {
            n.r(t), n.d(t, { default: () => R });
            function o(e, t, n, o) {
              var r,
                a = arguments.length,
                s = a < 3 ? t : null === o ? (o = Object.getOwnPropertyDescriptor(t, n)) : o;
              if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) s = Reflect.decorate(e, t, n, o);
              else
                for (var i = e.length - 1; i >= 0; i--)
                  (r = e[i]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, n, s) : r(t, n)) || s);
              return a > 3 && s && Object.defineProperty(t, n, s), s;
            }
            var r = n(594),
              a = n(966),
              s = n(42);
            class i extends r.BaseCommand {
              constructor() {
                super(...arguments), (this.workspaces = []), (this.json = !1), (this.production = !1);
              }
              async execute() {
                const e = await a.Configuration.find(this.context.cwd, this.context.plugins),
                  { project: t, workspace: n } = await a.Project.find(e, this.context.cwd),
                  o = await a.Cache.find(e);
                let s;
                if (0 === this.workspaces.length) {
                  if (!n) throw new r.WorkspaceRequiredError(t.cwd, this.context.cwd);
                  s = new Set([n]);
                } else s = new Set(this.workspaces.map((e) => t.getWorkspaceByIdent(a.structUtils.parseIdent(e))));
                for (const e of s)
                  for (const n of a.Manifest.hardDependencies)
                    for (const o of e.manifest.getForScope(n).values()) {
                      const e = t.tryWorkspaceByDescriptor(o);
                      null !== e && s.add(e);
                    }
                for (const e of t.workspaces)
                  s.has(e)
                    ? this.production && e.manifest.devDependencies.clear()
                    : (e.manifest.dependencies.clear(),
                      e.manifest.devDependencies.clear(),
                      e.manifest.peerDependencies.clear());
                return (
                  await a.StreamReport.start(
                    { configuration: e, json: this.json, stdout: this.context.stdout, includeLogs: !0 },
                    async (e) => {
                      await t.install({ cache: o, report: e, persistProject: !1 }), await t.persistInstallStateFile();
                    },
                  )
                ).exitCode();
              }
            }
            (i.usage = s.Command.Usage({
              category: "Workspace-related commands",
              description: "install a single workspace and its dependencies",
              details:
                "\n      This command will run an install as if the specified workspaces (and all other workspaces they depend on) were the only ones in the project. If no workspaces are explicitly listed, the active one will be assumed.\n\n      Note that this command is only very moderately useful when using zero-installs, since the cache will contain all the packages anyway - meaning that the only difference between a full install and a focused install would just be a few extra lines in the `.pnp.js` file, at the cost of introducing an extra complexity.\n\n      If the `--production` flag is set, only regular dependencies will be installed, and dev dependencies will be omitted.\n\n      If the `--json` flag is set the output will follow a JSON-stream output also known as NDJSON (https://github.com/ndjson/ndjson-spec).\n    ",
            })),
              o([s.Command.Rest()], i.prototype, "workspaces", void 0),
              o([s.Command.Boolean("--json")], i.prototype, "json", void 0),
              o([s.Command.Boolean("--production")], i.prototype, "production", void 0),
              o([s.Command.Path("workspaces", "focus")], i.prototype, "execute", null);
            var u = n(401),
              l = n.n(u),
              p = n(87),
              c = n(578),
              f = n.n(c),
              d = n(440);
            const h = (e, t) => {
              const n = [];
              for (const o of e.workspacesCwds) {
                const e = t.workspacesByCwd.get(o);
                e && n.push(e, ...h(e, t));
              }
              return n;
            };
            class g extends r.BaseCommand {
              constructor() {
                super(...arguments),
                  (this.args = []),
                  (this.all = !1),
                  (this.verbose = !1),
                  (this.parallel = !1),
                  (this.interlaced = !1),
                  (this.topological = !1),
                  (this.topologicalDev = !1),
                  (this.include = []),
                  (this.exclude = []),
                  (this.private = !0);
              }
              async execute() {
                const e = await a.Configuration.find(this.context.cwd, this.context.plugins),
                  { project: t, workspace: n } = await a.Project.find(e, this.context.cwd);
                if (!this.all && !n) throw new r.WorkspaceRequiredError(t.cwd, this.context.cwd);
                const o = this.cli.process([this.commandName, ...this.args]),
                  i = 1 === o.path.length && "run" === o.path[0] && void 0 !== o.scriptName ? o.scriptName : null;
                if (0 === o.path.length)
                  throw new s.UsageError(
                    "Invalid subcommand name for iteration - use the 'run' keyword if you wish to execute a script",
                  );
                const u = this.all ? t.topLevelWorkspace : n,
                  c = [u, ...h(u, t)],
                  d = [];
                for (const e of c)
                  (i && !e.manifest.scripts.has(i)) ||
                    (i === process.env.npm_lifecycle_event && e.cwd === n.cwd) ||
                    (this.include.length > 0 && !l().isMatch(a.structUtils.stringifyIdent(e.locator), this.include)) ||
                    (this.exclude.length > 0 && l().isMatch(a.structUtils.stringifyIdent(e.locator), this.exclude)) ||
                    (!1 === this.private && !0 === e.manifest.private) ||
                    d.push(e);
                let g = this.interlaced;
                this.parallel || (g = !0);
                const R = new Map(),
                  y = new Set(),
                  m = this.parallel ? Math.max(1, (0, p.cpus)().length / 2) : 1,
                  _ = f()(this.jobs || m);
                let E = 0,
                  C = null;
                const b = await a.StreamReport.start({ configuration: e, stdout: this.context.stdout }, async (n) => {
                  const o = async (t, { commandIndex: o }) => {
                    !this.parallel && this.verbose && o > 1 && n.reportSeparator();
                    const r = (function (e, { configuration: t, commandIndex: n, verbose: o }) {
                        if (!o) return null;
                        const r = a.structUtils.convertToIdent(e.locator),
                          s = `[${a.structUtils.stringifyIdent(r)}]:`,
                          i = ["#2E86AB", "#A23B72", "#F18F01", "#C73E1D", "#CCE2A3"],
                          u = i[n % i.length];
                        return t.format(s, u);
                      })(t, { configuration: e, verbose: this.verbose, commandIndex: o }),
                      [s, i] = A(n, { prefix: r, interlaced: g }),
                      [u, l] = A(n, { prefix: r, interlaced: g });
                    try {
                      const e =
                        (await this.cli.run([this.commandName, ...this.args], { cwd: t.cwd, stdout: s, stderr: u })) ||
                        0;
                      s.end(), u.end();
                      const o = await i,
                        a = await l;
                      return (
                        this.verbose &&
                          o &&
                          a &&
                          n.reportInfo(null, `${r} Process exited without output (exit code ${e})`),
                        e
                      );
                    } catch (e) {
                      throw (s.end(), u.end(), await i, await l, e);
                    }
                  };
                  for (const e of d) R.set(e.anchoredLocator.locatorHash, e);
                  for (; R.size > 0 && !n.hasErrors(); ) {
                    const r = [];
                    for (const [e, n] of R) {
                      if (y.has(n.anchoredDescriptor.descriptorHash)) continue;
                      let a = !0;
                      if (this.topological || this.topologicalDev) {
                        const e = this.topologicalDev
                          ? new Map([...n.manifest.dependencies, ...n.manifest.devDependencies])
                          : n.manifest.dependencies;
                        for (const n of e.values()) {
                          const e = t.tryWorkspaceByDescriptor(n);
                          if (((a = null === e || !R.has(e.anchoredLocator.locatorHash)), !a)) break;
                        }
                      }
                      if (
                        a &&
                        (y.add(n.anchoredDescriptor.descriptorHash),
                        r.push(
                          _(async () => {
                            const t = await o(n, { commandIndex: ++E });
                            return R.delete(e), y.delete(n.anchoredDescriptor.descriptorHash), t;
                          }),
                        ),
                        !this.parallel)
                      )
                        break;
                    }
                    if (0 === r.length) {
                      const t = Array.from(R.values())
                        .map((t) => a.structUtils.prettyLocator(e, t.anchoredLocator))
                        .join(", ");
                      return void n.reportError(a.MessageName.CYCLIC_DEPENDENCIES, `Dependency cycle detected (${t})`);
                    }
                    const s = (await Promise.all(r)).find((e) => 0 !== e);
                    (C = void 0 !== s ? 1 : C),
                      (this.topological || this.topologicalDev) &&
                        void 0 !== s &&
                        n.reportError(
                          a.MessageName.UNNAMED,
                          "The command failed for workspaces that are depended upon by other workspaces; can't satisfy the dependency graph",
                        );
                  }
                });
                return null !== C ? C : b.exitCode();
              }
            }
            function A(e, { prefix: t, interlaced: n }) {
              const o = e.createStreamReporter(t),
                r = new a.miscUtils.DefaultStream();
              r.pipe(o, { end: !1 }),
                r.on("finish", () => {
                  o.end();
                });
              const s = new Promise((e) => {
                o.on("finish", () => {
                  e(r.active);
                });
              });
              if (n) return [r, s];
              const i = new a.miscUtils.BufferStream();
              return (
                i.pipe(r, { end: !1 }),
                i.on("finish", () => {
                  r.end();
                }),
                [i, s]
              );
            }
            (g.schema = d.object().shape({
              jobs: d.number().min(2),
              parallel: d.boolean().when("jobs", {
                is: (e) => e > 1,
                then: d.boolean().oneOf([!0], "--parallel must be set when using --jobs"),
                otherwise: d.boolean(),
              }),
            })),
              (g.usage = s.Command.Usage({
                category: "Workspace-related commands",
                description: "run a command on all workspaces",
                details:
                  "\n      This command will run a given sub-command on current and all its descendant workspaces. Various flags can alter the exact behavior of the command:\n\n      - If `-p,--parallel` is set, the commands will be ran in parallel; they'll by default be limited to a number of parallel tasks roughly equal to half your core number, but that can be overridden via `-j,--jobs`.\n\n      - If `-p,--parallel` and `-i,--interlaced` are both set, Yarn will print the lines from the output as it receives them. If `-i,--interlaced` wasn't set, it would instead buffer the output from each process and print the resulting buffers only after their source processes have exited.\n\n      - If `-t,--topological` is set, Yarn will only run the command after all workspaces that depend on it through the `dependencies` field have successfully finished executing. If `--topological-dev` is set, both the `dependencies` and `devDependencies` fields will be considered when figuring out the wait points.\n\n      - If `--all` is set, Yarn will run the command on all the workspaces of a project. By default yarn runs the command only on current and all its descendant workspaces.\n\n      - The command may apply to only some workspaces through the use of `--include` which acts as a whitelist. The `--exclude` flag will do the opposite and will be a list of packages that mustn't execute the script. Both flags accept glob patterns (if valid Idents and supported by [micromatch](https://github.com/micromatch/micromatch)). Make sure to escape the patterns, to prevent your own shell from trying to expand them.\n\n      Adding the `-v,--verbose` flag will cause Yarn to print more information; in particular the name of the workspace that generated the output will be printed at the front of each line.\n\n      If the command is `run` and the script being run does not exist the child workspace will be skipped without error.\n    ",
                examples: [
                  [
                    "Publish current and all descendant packages",
                    "yarn workspaces foreach npm publish --tolerate-republish",
                  ],
                  ["Run build script on current and all descendant packages", "yarn workspaces foreach run build"],
                  [
                    "Run build script on current and all descendant packages in parallel, building dependent packages first",
                    "yarn workspaces foreach -pt run build",
                  ],
                ],
              })),
              o([s.Command.String()], g.prototype, "commandName", void 0),
              o([s.Command.Proxy()], g.prototype, "args", void 0),
              o([s.Command.Boolean("-a,--all")], g.prototype, "all", void 0),
              o([s.Command.Boolean("-v,--verbose")], g.prototype, "verbose", void 0),
              o([s.Command.Boolean("-p,--parallel")], g.prototype, "parallel", void 0),
              o([s.Command.Boolean("-i,--interlaced")], g.prototype, "interlaced", void 0),
              o([s.Command.String("-j,--jobs")], g.prototype, "jobs", void 0),
              o([s.Command.Boolean("-t,--topological")], g.prototype, "topological", void 0),
              o([s.Command.Boolean("--topological-dev")], g.prototype, "topologicalDev", void 0),
              o([s.Command.Array("--include")], g.prototype, "include", void 0),
              o([s.Command.Array("--exclude")], g.prototype, "exclude", void 0),
              o([s.Command.Boolean("--private")], g.prototype, "private", void 0),
              o([s.Command.Path("workspaces", "foreach")], g.prototype, "execute", null);
            const R = { commands: [i, g] };
          },
          235: (e, t, n) => {
            const o = n(900),
              r = n(617),
              a = n(495),
              s = n(425),
              i = (e, t = {}) => {
                let n = [];
                if (Array.isArray(e))
                  for (let o of e) {
                    let e = i.create(o, t);
                    Array.isArray(e) ? n.push(...e) : n.push(e);
                  }
                else n = [].concat(i.create(e, t));
                return t && !0 === t.expand && !0 === t.nodupes && (n = [...new Set(n)]), n;
              };
            (i.parse = (e, t = {}) => s(e, t)),
              (i.stringify = (e, t = {}) => o("string" == typeof e ? i.parse(e, t) : e, t)),
              (i.compile = (e, t = {}) => ("string" == typeof e && (e = i.parse(e, t)), r(e, t))),
              (i.expand = (e, t = {}) => {
                "string" == typeof e && (e = i.parse(e, t));
                let n = a(e, t);
                return !0 === t.noempty && (n = n.filter(Boolean)), !0 === t.nodupes && (n = [...new Set(n)]), n;
              }),
              (i.create = (e, t = {}) =>
                "" === e || e.length < 3 ? [e] : !0 !== t.expand ? i.compile(e, t) : i.expand(e, t)),
              (e.exports = i);
          },
          617: (e, t, n) => {
            const o = n(169),
              r = n(542);
            e.exports = (e, t = {}) => {
              let n = (e, a = {}) => {
                let s = r.isInvalidBrace(a),
                  i = !0 === e.invalid && !0 === t.escapeInvalid,
                  u = !0 === s || !0 === i,
                  l = !0 === t.escapeInvalid ? "\\" : "",
                  p = "";
                if (!0 === e.isOpen) return l + e.value;
                if (!0 === e.isClose) return l + e.value;
                if ("open" === e.type) return u ? l + e.value : "(";
                if ("close" === e.type) return u ? l + e.value : ")";
                if ("comma" === e.type) return "comma" === e.prev.type ? "" : u ? e.value : "|";
                if (e.value) return e.value;
                if (e.nodes && e.ranges > 0) {
                  let n = r.reduce(e.nodes),
                    a = o(...n, { ...t, wrap: !1, toRegex: !0 });
                  if (0 !== a.length) return n.length > 1 && a.length > 1 ? `(${a})` : a;
                }
                if (e.nodes) for (let t of e.nodes) p += n(t, e);
                return p;
              };
              return n(e);
            };
          },
          384: (e) => {
            e.exports = {
              MAX_LENGTH: 65536,
              CHAR_0: "0",
              CHAR_9: "9",
              CHAR_UPPERCASE_A: "A",
              CHAR_LOWERCASE_A: "a",
              CHAR_UPPERCASE_Z: "Z",
              CHAR_LOWERCASE_Z: "z",
              CHAR_LEFT_PARENTHESES: "(",
              CHAR_RIGHT_PARENTHESES: ")",
              CHAR_ASTERISK: "*",
              CHAR_AMPERSAND: "&",
              CHAR_AT: "@",
              CHAR_BACKSLASH: "\\",
              CHAR_BACKTICK: "`",
              CHAR_CARRIAGE_RETURN: "\r",
              CHAR_CIRCUMFLEX_ACCENT: "^",
              CHAR_COLON: ":",
              CHAR_COMMA: ",",
              CHAR_DOLLAR: "$",
              CHAR_DOT: ".",
              CHAR_DOUBLE_QUOTE: '"',
              CHAR_EQUAL: "=",
              CHAR_EXCLAMATION_MARK: "!",
              CHAR_FORM_FEED: "\f",
              CHAR_FORWARD_SLASH: "/",
              CHAR_HASH: "#",
              CHAR_HYPHEN_MINUS: "-",
              CHAR_LEFT_ANGLE_BRACKET: "<",
              CHAR_LEFT_CURLY_BRACE: "{",
              CHAR_LEFT_SQUARE_BRACKET: "[",
              CHAR_LINE_FEED: "\n",
              CHAR_NO_BREAK_SPACE: " ",
              CHAR_PERCENT: "%",
              CHAR_PLUS: "+",
              CHAR_QUESTION_MARK: "?",
              CHAR_RIGHT_ANGLE_BRACKET: ">",
              CHAR_RIGHT_CURLY_BRACE: "}",
              CHAR_RIGHT_SQUARE_BRACKET: "]",
              CHAR_SEMICOLON: ";",
              CHAR_SINGLE_QUOTE: "'",
              CHAR_SPACE: " ",
              CHAR_TAB: "\t",
              CHAR_UNDERSCORE: "_",
              CHAR_VERTICAL_LINE: "|",
              CHAR_ZERO_WIDTH_NOBREAK_SPACE: "\ufeff",
            };
          },
          495: (e, t, n) => {
            const o = n(169),
              r = n(900),
              a = n(542),
              s = (e = "", t = "", n = !1) => {
                let o = [];
                if (((e = [].concat(e)), !(t = [].concat(t)).length)) return e;
                if (!e.length) return n ? a.flatten(t).map((e) => `{${e}}`) : t;
                for (let r of e)
                  if (Array.isArray(r)) for (let e of r) o.push(s(e, t, n));
                  else
                    for (let e of t)
                      !0 === n && "string" == typeof e && (e = `{${e}}`), o.push(Array.isArray(e) ? s(r, e, n) : r + e);
                return a.flatten(o);
              };
            e.exports = (e, t = {}) => {
              let n = void 0 === t.rangeLimit ? 1e3 : t.rangeLimit,
                i = (e, u = {}) => {
                  e.queue = [];
                  let l = u,
                    p = u.queue;
                  for (; "brace" !== l.type && "root" !== l.type && l.parent; ) (l = l.parent), (p = l.queue);
                  if (e.invalid || e.dollar) return void p.push(s(p.pop(), r(e, t)));
                  if ("brace" === e.type && !0 !== e.invalid && 2 === e.nodes.length)
                    return void p.push(s(p.pop(), ["{}"]));
                  if (e.nodes && e.ranges > 0) {
                    let i = a.reduce(e.nodes);
                    if (a.exceedsLimit(...i, t.step, n))
                      throw new RangeError(
                        "expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.",
                      );
                    let u = o(...i, t);
                    return 0 === u.length && (u = r(e, t)), p.push(s(p.pop(), u)), void (e.nodes = []);
                  }
                  let c = a.encloseBrace(e),
                    f = e.queue,
                    d = e;
                  for (; "brace" !== d.type && "root" !== d.type && d.parent; ) (d = d.parent), (f = d.queue);
                  for (let t = 0; t < e.nodes.length; t++) {
                    let n = e.nodes[t];
                    "comma" !== n.type || "brace" !== e.type
                      ? "close" !== n.type
                        ? n.value && "open" !== n.type
                          ? f.push(s(f.pop(), n.value))
                          : n.nodes && i(n, e)
                        : p.push(s(p.pop(), f, c))
                      : (1 === t && f.push(""), f.push(""));
                  }
                  return f;
                };
              return a.flatten(i(e));
            };
          },
          425: (e, t, n) => {
            const o = n(900),
              {
                MAX_LENGTH: r,
                CHAR_BACKSLASH: a,
                CHAR_BACKTICK: s,
                CHAR_COMMA: i,
                CHAR_DOT: u,
                CHAR_LEFT_PARENTHESES: l,
                CHAR_RIGHT_PARENTHESES: p,
                CHAR_LEFT_CURLY_BRACE: c,
                CHAR_RIGHT_CURLY_BRACE: f,
                CHAR_LEFT_SQUARE_BRACKET: d,
                CHAR_RIGHT_SQUARE_BRACKET: h,
                CHAR_DOUBLE_QUOTE: g,
                CHAR_SINGLE_QUOTE: A,
                CHAR_NO_BREAK_SPACE: R,
                CHAR_ZERO_WIDTH_NOBREAK_SPACE: y,
              } = n(384);
            e.exports = (e, t = {}) => {
              if ("string" != typeof e) throw new TypeError("Expected a string");
              let n = t || {},
                m = "number" == typeof n.maxLength ? Math.min(r, n.maxLength) : r;
              if (e.length > m) throw new SyntaxError(`Input length (${e.length}), exceeds max characters (${m})`);
              let _,
                E = { type: "root", input: e, nodes: [] },
                C = [E],
                b = E,
                x = E,
                v = 0,
                S = e.length,
                w = 0,
                H = 0;
              const T = () => e[w++],
                L = (e) => {
                  if (
                    ("text" === e.type && "dot" === x.type && (x.type = "text"),
                    !x || "text" !== x.type || "text" !== e.type)
                  )
                    return b.nodes.push(e), (e.parent = b), (e.prev = x), (x = e), e;
                  x.value += e.value;
                };
              for (L({ type: "bos" }); w < S; )
                if (((b = C[C.length - 1]), (_ = T()), _ !== y && _ !== R))
                  if (_ !== a)
                    if (_ !== h)
                      if (_ !== d)
                        if (_ !== l)
                          if (_ !== p)
                            if (_ !== g && _ !== A && _ !== s)
                              if (_ !== c)
                                if (_ !== f)
                                  if (_ === i && H > 0) {
                                    if (b.ranges > 0) {
                                      b.ranges = 0;
                                      let e = b.nodes.shift();
                                      b.nodes = [e, { type: "text", value: o(b) }];
                                    }
                                    L({ type: "comma", value: _ }), b.commas++;
                                  } else if (_ === u && H > 0 && 0 === b.commas) {
                                    let e = b.nodes;
                                    if (0 === H || 0 === e.length) {
                                      L({ type: "text", value: _ });
                                      continue;
                                    }
                                    if ("dot" === x.type) {
                                      if (
                                        ((b.range = []),
                                        (x.value += _),
                                        (x.type = "range"),
                                        3 !== b.nodes.length && 5 !== b.nodes.length)
                                      ) {
                                        (b.invalid = !0), (b.ranges = 0), (x.type = "text");
                                        continue;
                                      }
                                      b.ranges++, (b.args = []);
                                      continue;
                                    }
                                    if ("range" === x.type) {
                                      e.pop();
                                      let t = e[e.length - 1];
                                      (t.value += x.value + _), (x = t), b.ranges--;
                                      continue;
                                    }
                                    L({ type: "dot", value: _ });
                                  } else L({ type: "text", value: _ });
                                else {
                                  if ("brace" !== b.type) {
                                    L({ type: "text", value: _ });
                                    continue;
                                  }
                                  let e = "close";
                                  (b = C.pop()), (b.close = !0), L({ type: e, value: _ }), H--, (b = C[C.length - 1]);
                                }
                              else {
                                H++;
                                let e = (x.value && "$" === x.value.slice(-1)) || !0 === b.dollar;
                                (b = L({
                                  type: "brace",
                                  open: !0,
                                  close: !1,
                                  dollar: e,
                                  depth: H,
                                  commas: 0,
                                  ranges: 0,
                                  nodes: [],
                                })),
                                  C.push(b),
                                  L({ type: "open", value: _ });
                              }
                            else {
                              let e,
                                n = _;
                              for (!0 !== t.keepQuotes && (_ = ""); w < S && (e = T()); )
                                if (e !== a) {
                                  if (e === n) {
                                    !0 === t.keepQuotes && (_ += e);
                                    break;
                                  }
                                  _ += e;
                                } else _ += e + T();
                              L({ type: "text", value: _ });
                            }
                          else {
                            if ("paren" !== b.type) {
                              L({ type: "text", value: _ });
                              continue;
                            }
                            (b = C.pop()), L({ type: "text", value: _ }), (b = C[C.length - 1]);
                          }
                        else (b = L({ type: "paren", nodes: [] })), C.push(b), L({ type: "text", value: _ });
                      else {
                        v++;
                        let e;
                        for (; w < S && (e = T()); )
                          if (((_ += e), e !== d))
                            if (e !== a) {
                              if (e === h && (v--, 0 === v)) break;
                            } else _ += T();
                          else v++;
                        L({ type: "text", value: _ });
                      }
                    else L({ type: "text", value: "\\" + _ });
                  else L({ type: "text", value: (t.keepEscaping ? _ : "") + T() });
              do {
                if (((b = C.pop()), "root" !== b.type)) {
                  b.nodes.forEach((e) => {
                    e.nodes ||
                      ("open" === e.type && (e.isOpen = !0),
                      "close" === e.type && (e.isClose = !0),
                      e.nodes || (e.type = "text"),
                      (e.invalid = !0));
                  });
                  let e = C[C.length - 1],
                    t = e.nodes.indexOf(b);
                  e.nodes.splice(t, 1, ...b.nodes);
                }
              } while (C.length > 0);
              return L({ type: "eos" }), E;
            };
          },
          900: (e, t, n) => {
            const o = n(542);
            e.exports = (e, t = {}) => {
              let n = (e, r = {}) => {
                let a = t.escapeInvalid && o.isInvalidBrace(r),
                  s = !0 === e.invalid && !0 === t.escapeInvalid,
                  i = "";
                if (e.value) return (a || s) && o.isOpenOrClose(e) ? "\\" + e.value : e.value;
                if (e.value) return e.value;
                if (e.nodes) for (let t of e.nodes) i += n(t);
                return i;
              };
              return n(e);
            };
          },
          542: (e, t) => {
            (t.isInteger = (e) =>
              "number" == typeof e
                ? Number.isInteger(e)
                : "string" == typeof e && "" !== e.trim() && Number.isInteger(Number(e))),
              (t.find = (e, t) => e.nodes.find((e) => e.type === t)),
              (t.exceedsLimit = (e, n, o = 1, r) =>
                !1 !== r && !(!t.isInteger(e) || !t.isInteger(n)) && (Number(n) - Number(e)) / Number(o) >= r),
              (t.escapeNode = (e, t = 0, n) => {
                let o = e.nodes[t];
                o &&
                  ((n && o.type === n) || "open" === o.type || "close" === o.type) &&
                  !0 !== o.escaped &&
                  ((o.value = "\\" + o.value), (o.escaped = !0));
              }),
              (t.encloseBrace = (e) =>
                "brace" === e.type && (e.commas >> (0 + e.ranges)) >> 0 == 0 && ((e.invalid = !0), !0)),
              (t.isInvalidBrace = (e) =>
                "brace" === e.type &&
                (!(!0 !== e.invalid && !e.dollar) ||
                  (((e.commas >> (0 + e.ranges)) >> 0 == 0 || !0 !== e.open || !0 !== e.close) &&
                    ((e.invalid = !0), !0)))),
              (t.isOpenOrClose = (e) => "open" === e.type || "close" === e.type || !0 === e.open || !0 === e.close),
              (t.reduce = (e) =>
                e.reduce(
                  (e, t) => ("text" === t.type && e.push(t.value), "range" === t.type && (t.type = "text"), e),
                  [],
                )),
              (t.flatten = (...e) => {
                const t = [],
                  n = (e) => {
                    for (let o = 0; o < e.length; o++) {
                      let r = e[o];
                      Array.isArray(r) ? n(r, t) : void 0 !== r && t.push(r);
                    }
                    return t;
                  };
                return n(e), t;
              });
          },
          169: (e, t, n) => {
            /*!
             * fill-range <https://github.com/jonschlinkert/fill-range>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Licensed under the MIT License.
             */
            const o = n(669),
              r = n(615),
              a = (e) => null !== e && "object" == typeof e && !Array.isArray(e),
              s = (e) => "number" == typeof e || ("string" == typeof e && "" !== e),
              i = (e) => Number.isInteger(+e),
              u = (e) => {
                let t = "" + e,
                  n = -1;
                if (("-" === t[0] && (t = t.slice(1)), "0" === t)) return !1;
                for (; "0" === t[++n]; );
                return n > 0;
              },
              l = (e, t, n) => {
                if (t > 0) {
                  let n = "-" === e[0] ? "-" : "";
                  n && (e = e.slice(1)), (e = n + e.padStart(n ? t - 1 : t, "0"));
                }
                return !1 === n ? String(e) : e;
              },
              p = (e, t) => {
                let n = "-" === e[0] ? "-" : "";
                for (n && ((e = e.slice(1)), t--); e.length < t; ) e = "0" + e;
                return n ? "-" + e : e;
              },
              c = (e, t, n, o) => {
                if (n) return r(e, t, { wrap: !1, ...o });
                let a = String.fromCharCode(e);
                return e === t ? a : `[${a}-${String.fromCharCode(t)}]`;
              },
              f = (e, t, n) => {
                if (Array.isArray(e)) {
                  let t = !0 === n.wrap,
                    o = n.capture ? "" : "?:";
                  return t ? `(${o}${e.join("|")})` : e.join("|");
                }
                return r(e, t, n);
              },
              d = (...e) => new RangeError("Invalid range arguments: " + o.inspect(...e)),
              h = (e, t, n) => {
                if (!0 === n.strictRanges) throw d([e, t]);
                return [];
              },
              g = (e, t, n = 1, o = {}) => {
                let r = Number(e),
                  a = Number(t);
                if (!Number.isInteger(r) || !Number.isInteger(a)) {
                  if (!0 === o.strictRanges) throw d([e, t]);
                  return [];
                }
                0 === r && (r = 0), 0 === a && (a = 0);
                let s = r > a,
                  i = String(e),
                  h = String(t),
                  g = String(n);
                n = Math.max(Math.abs(n), 1);
                let A = u(i) || u(h) || u(g),
                  R = A ? Math.max(i.length, h.length, g.length) : 0,
                  y =
                    !1 === A &&
                    !1 === ((e, t, n) => "string" == typeof e || "string" == typeof t || !0 === n.stringify)(e, t, o),
                  m = o.transform || ((e) => (t) => (!0 === e ? Number(t) : String(t)))(y);
                if (o.toRegex && 1 === n) return c(p(e, R), p(t, R), !0, o);
                let _ = { negatives: [], positives: [] },
                  E = [],
                  C = 0;
                for (; s ? r >= a : r <= a; )
                  !0 === o.toRegex && n > 1
                    ? _[(b = r) < 0 ? "negatives" : "positives"].push(Math.abs(b))
                    : E.push(l(m(r, C), R, y)),
                    (r = s ? r - n : r + n),
                    C++;
                var b;
                return !0 === o.toRegex
                  ? n > 1
                    ? ((e, t) => {
                        e.negatives.sort((e, t) => (e < t ? -1 : e > t ? 1 : 0)),
                          e.positives.sort((e, t) => (e < t ? -1 : e > t ? 1 : 0));
                        let n,
                          o = t.capture ? "" : "?:",
                          r = "",
                          a = "";
                        return (
                          e.positives.length && (r = e.positives.join("|")),
                          e.negatives.length && (a = `-(${o}${e.negatives.join("|")})`),
                          (n = r && a ? `${r}|${a}` : r || a),
                          t.wrap ? `(${o}${n})` : n
                        );
                      })(_, o)
                    : f(E, null, { wrap: !1, ...o })
                  : E;
              },
              A = (e, t, n, o = {}) => {
                if (null == t && s(e)) return [e];
                if (!s(e) || !s(t)) return h(e, t, o);
                if ("function" == typeof n) return A(e, t, 1, { transform: n });
                if (a(n)) return A(e, t, 0, n);
                let r = { ...o };
                return (
                  !0 === r.capture && (r.wrap = !0),
                  (n = n || r.step || 1),
                  i(n)
                    ? i(e) && i(t)
                      ? g(e, t, n, r)
                      : ((e, t, n = 1, o = {}) => {
                          if ((!i(e) && e.length > 1) || (!i(t) && t.length > 1)) return h(e, t, o);
                          let r = o.transform || ((e) => String.fromCharCode(e)),
                            a = ("" + e).charCodeAt(0),
                            s = ("" + t).charCodeAt(0),
                            u = a > s,
                            l = Math.min(a, s),
                            p = Math.max(a, s);
                          if (o.toRegex && 1 === n) return c(l, p, !1, o);
                          let d = [],
                            g = 0;
                          for (; u ? a >= s : a <= s; ) d.push(r(a, g)), (a = u ? a - n : a + n), g++;
                          return !0 === o.toRegex ? f(d, null, { wrap: !1, options: o }) : d;
                        })(e, t, Math.max(Math.abs(n), 1), r)
                    : null == n || a(n)
                    ? A(e, t, 1, n)
                    : ((e, t) => {
                        if (!0 === t.strictRanges) throw new TypeError(`Expected step "${e}" to be a number`);
                        return [];
                      })(n, r)
                );
              };
            e.exports = A;
          },
          761: (e) => {
            /*!
             * is-number <https://github.com/jonschlinkert/is-number>
             *
             * Copyright (c) 2014-present, Jon Schlinkert.
             * Released under the MIT License.
             */
            e.exports = function (e) {
              return "number" == typeof e
                ? e - e == 0
                : "string" == typeof e && "" !== e.trim() && (Number.isFinite ? Number.isFinite(+e) : isFinite(+e));
            };
          },
          401: (e, t, n) => {
            const o = n(669),
              r = n(235),
              a = n(722),
              s = n(598),
              i = (e) => "string" == typeof e && ("" === e || "./" === e),
              u = (e, t, n) => {
                (t = [].concat(t)), (e = [].concat(e));
                let o = new Set(),
                  r = new Set(),
                  s = new Set(),
                  i = 0,
                  u = (e) => {
                    s.add(e.output), n && n.onResult && n.onResult(e);
                  };
                for (let s = 0; s < t.length; s++) {
                  let l = a(String(t[s]), { ...n, onResult: u }, !0),
                    p = l.state.negated || l.state.negatedExtglob;
                  p && i++;
                  for (let t of e) {
                    let e = l(t, !0);
                    (p ? !e.isMatch : e.isMatch) && (p ? o.add(e.output) : (o.delete(e.output), r.add(e.output)));
                  }
                }
                let l = (i === t.length ? [...s] : [...r]).filter((e) => !o.has(e));
                if (n && 0 === l.length) {
                  if (!0 === n.failglob) throw new Error(`No matches found for "${t.join(", ")}"`);
                  if (!0 === n.nonull || !0 === n.nullglob) return n.unescape ? t.map((e) => e.replace(/\\/g, "")) : t;
                }
                return l;
              };
            (u.match = u),
              (u.matcher = (e, t) => a(e, t)),
              (u.any = u.isMatch = (e, t, n) => a(t, n)(e)),
              (u.not = (e, t, n = {}) => {
                t = [].concat(t).map(String);
                let o = new Set(),
                  r = [],
                  a = u(e, t, {
                    ...n,
                    onResult: (e) => {
                      n.onResult && n.onResult(e), r.push(e.output);
                    },
                  });
                for (let e of r) a.includes(e) || o.add(e);
                return [...o];
              }),
              (u.contains = (e, t, n) => {
                if ("string" != typeof e) throw new TypeError(`Expected a string: "${o.inspect(e)}"`);
                if (Array.isArray(t)) return t.some((t) => u.contains(e, t, n));
                if ("string" == typeof t) {
                  if (i(e) || i(t)) return !1;
                  if (e.includes(t) || (e.startsWith("./") && e.slice(2).includes(t))) return !0;
                }
                return u.isMatch(e, t, { ...n, contains: !0 });
              }),
              (u.matchKeys = (e, t, n) => {
                if (!s.isObject(e)) throw new TypeError("Expected the first argument to be an object");
                let o = u(Object.keys(e), t, n),
                  r = {};
                for (let t of o) r[t] = e[t];
                return r;
              }),
              (u.some = (e, t, n) => {
                let o = [].concat(e);
                for (let e of [].concat(t)) {
                  let t = a(String(e), n);
                  if (o.some((e) => t(e))) return !0;
                }
                return !1;
              }),
              (u.every = (e, t, n) => {
                let o = [].concat(e);
                for (let e of [].concat(t)) {
                  let t = a(String(e), n);
                  if (!o.every((e) => t(e))) return !1;
                }
                return !0;
              }),
              (u.all = (e, t, n) => {
                if ("string" != typeof e) throw new TypeError(`Expected a string: "${o.inspect(e)}"`);
                return [].concat(t).every((t) => a(t, n)(e));
              }),
              (u.capture = (e, t, n) => {
                let o = s.isWindows(n),
                  r = a.makeRe(String(e), { ...n, capture: !0 }).exec(o ? s.toPosixSlashes(t) : t);
                if (r) return r.slice(1).map((e) => (void 0 === e ? "" : e));
              }),
              (u.makeRe = (...e) => a.makeRe(...e)),
              (u.scan = (...e) => a.scan(...e)),
              (u.parse = (e, t) => {
                let n = [];
                for (let o of [].concat(e || [])) for (let e of r(String(o), t)) n.push(a.parse(e, t));
                return n;
              }),
              (u.braces = (e, t) => {
                if ("string" != typeof e) throw new TypeError("Expected a string");
                return (t && !0 === t.nobrace) || !/\{.*\}/.test(e) ? [e] : r(e, t);
              }),
              (u.braceExpand = (e, t) => {
                if ("string" != typeof e) throw new TypeError("Expected a string");
                return u.braces(e, { ...t, expand: !0 });
              }),
              (e.exports = u);
          },
          578: (e, t, n) => {
            const o = n(550),
              r = (e) => {
                if (e < 1) throw new TypeError("Expected `concurrency` to be a number from 1 and up");
                const t = [];
                let n = 0;
                const r = () => {
                    n--, t.length > 0 && t.shift()();
                  },
                  a = (e, t, ...a) => {
                    n++;
                    const s = o(e, ...a);
                    t(s), s.then(r, r);
                  },
                  s = (o, ...r) =>
                    new Promise((s) =>
                      ((o, r, ...s) => {
                        n < e ? a(o, r, ...s) : t.push(a.bind(null, o, r, ...s));
                      })(o, s, ...r),
                    );
                return (
                  Object.defineProperties(s, { activeCount: { get: () => n }, pendingCount: { get: () => t.length } }),
                  s
                );
              };
            (e.exports = r), (e.exports.default = r);
          },
          550: (e) => {
            e.exports = (e, ...t) =>
              new Promise((n) => {
                n(e(...t));
              });
          },
          722: (e, t, n) => {
            e.exports = n(828);
          },
          86: (e, t, n) => {
            const o = n(622),
              r = {
                DOT_LITERAL: "\\.",
                PLUS_LITERAL: "\\+",
                QMARK_LITERAL: "\\?",
                SLASH_LITERAL: "\\/",
                ONE_CHAR: "(?=.)",
                QMARK: "[^/]",
                END_ANCHOR: "(?:\\/|$)",
                DOTS_SLASH: "\\.{1,2}(?:\\/|$)",
                NO_DOT: "(?!\\.)",
                NO_DOTS: "(?!(?:^|\\/)\\.{1,2}(?:\\/|$))",
                NO_DOT_SLASH: "(?!\\.{0,1}(?:\\/|$))",
                NO_DOTS_SLASH: "(?!\\.{1,2}(?:\\/|$))",
                QMARK_NO_DOT: "[^.\\/]",
                STAR: "[^/]*?",
                START_ANCHOR: "(?:^|\\/)",
              },
              a = {
                ...r,
                SLASH_LITERAL: "[\\\\/]",
                QMARK: "[^\\\\/]",
                STAR: "[^\\\\/]*?",
                DOTS_SLASH: "\\.{1,2}(?:[\\\\/]|$)",
                NO_DOT: "(?!\\.)",
                NO_DOTS: "(?!(?:^|[\\\\/])\\.{1,2}(?:[\\\\/]|$))",
                NO_DOT_SLASH: "(?!\\.{0,1}(?:[\\\\/]|$))",
                NO_DOTS_SLASH: "(?!\\.{1,2}(?:[\\\\/]|$))",
                QMARK_NO_DOT: "[^.\\\\/]",
                START_ANCHOR: "(?:^|[\\\\/])",
                END_ANCHOR: "(?:[\\\\/]|$)",
              };
            e.exports = {
              MAX_LENGTH: 65536,
              POSIX_REGEX_SOURCE: {
                alnum: "a-zA-Z0-9",
                alpha: "a-zA-Z",
                ascii: "\\x00-\\x7F",
                blank: " \\t",
                cntrl: "\\x00-\\x1F\\x7F",
                digit: "0-9",
                graph: "\\x21-\\x7E",
                lower: "a-z",
                print: "\\x20-\\x7E ",
                punct: "\\-!\"#$%&'()\\*+,./:;<=>?@[\\]^_`{|}~",
                space: " \\t\\r\\n\\v\\f",
                upper: "A-Z",
                word: "A-Za-z0-9_",
                xdigit: "A-Fa-f0-9",
              },
              REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
              REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
              REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
              REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
              REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
              REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
              REPLACEMENTS: { "***": "*", "**/**": "**", "**/**/**": "**" },
              CHAR_0: 48,
              CHAR_9: 57,
              CHAR_UPPERCASE_A: 65,
              CHAR_LOWERCASE_A: 97,
              CHAR_UPPERCASE_Z: 90,
              CHAR_LOWERCASE_Z: 122,
              CHAR_LEFT_PARENTHESES: 40,
              CHAR_RIGHT_PARENTHESES: 41,
              CHAR_ASTERISK: 42,
              CHAR_AMPERSAND: 38,
              CHAR_AT: 64,
              CHAR_BACKWARD_SLASH: 92,
              CHAR_CARRIAGE_RETURN: 13,
              CHAR_CIRCUMFLEX_ACCENT: 94,
              CHAR_COLON: 58,
              CHAR_COMMA: 44,
              CHAR_DOT: 46,
              CHAR_DOUBLE_QUOTE: 34,
              CHAR_EQUAL: 61,
              CHAR_EXCLAMATION_MARK: 33,
              CHAR_FORM_FEED: 12,
              CHAR_FORWARD_SLASH: 47,
              CHAR_GRAVE_ACCENT: 96,
              CHAR_HASH: 35,
              CHAR_HYPHEN_MINUS: 45,
              CHAR_LEFT_ANGLE_BRACKET: 60,
              CHAR_LEFT_CURLY_BRACE: 123,
              CHAR_LEFT_SQUARE_BRACKET: 91,
              CHAR_LINE_FEED: 10,
              CHAR_NO_BREAK_SPACE: 160,
              CHAR_PERCENT: 37,
              CHAR_PLUS: 43,
              CHAR_QUESTION_MARK: 63,
              CHAR_RIGHT_ANGLE_BRACKET: 62,
              CHAR_RIGHT_CURLY_BRACE: 125,
              CHAR_RIGHT_SQUARE_BRACKET: 93,
              CHAR_SEMICOLON: 59,
              CHAR_SINGLE_QUOTE: 39,
              CHAR_SPACE: 32,
              CHAR_TAB: 9,
              CHAR_UNDERSCORE: 95,
              CHAR_VERTICAL_LINE: 124,
              CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
              SEP: o.sep,
              extglobChars: (e) => ({
                "!": { type: "negate", open: "(?:(?!(?:", close: `))${e.STAR})` },
                "?": { type: "qmark", open: "(?:", close: ")?" },
                "+": { type: "plus", open: "(?:", close: ")+" },
                "*": { type: "star", open: "(?:", close: ")*" },
                "@": { type: "at", open: "(?:", close: ")" },
              }),
              globChars: (e) => (!0 === e ? a : r),
            };
          },
          974: (e, t, n) => {
            const o = n(86),
              r = n(598),
              {
                MAX_LENGTH: a,
                POSIX_REGEX_SOURCE: s,
                REGEX_NON_SPECIAL_CHARS: i,
                REGEX_SPECIAL_CHARS_BACKREF: u,
                REPLACEMENTS: l,
              } = o,
              p = (e, t) => {
                if ("function" == typeof t.expandRange) return t.expandRange(...e, t);
                e.sort();
                const n = `[${e.join("-")}]`;
                try {
                  new RegExp(n);
                } catch (t) {
                  return e.map((e) => r.escapeRegex(e)).join("..");
                }
                return n;
              },
              c = (e, t) => `Missing ${e}: "${t}" - use "\\\\${t}" to match literal characters`,
              f = (e, t) => {
                if ("string" != typeof e) throw new TypeError("Expected a string");
                e = l[e] || e;
                const n = { ...t },
                  f = "number" == typeof n.maxLength ? Math.min(a, n.maxLength) : a;
                let d = e.length;
                if (d > f) throw new SyntaxError(`Input length: ${d}, exceeds maximum allowed length: ${f}`);
                const h = { type: "bos", value: "", output: n.prepend || "" },
                  g = [h],
                  A = n.capture ? "" : "?:",
                  R = r.isWindows(t),
                  y = o.globChars(R),
                  m = o.extglobChars(y),
                  {
                    DOT_LITERAL: _,
                    PLUS_LITERAL: E,
                    SLASH_LITERAL: C,
                    ONE_CHAR: b,
                    DOTS_SLASH: x,
                    NO_DOT: v,
                    NO_DOT_SLASH: S,
                    NO_DOTS_SLASH: w,
                    QMARK: H,
                    QMARK_NO_DOT: T,
                    STAR: L,
                    START_ANCHOR: k,
                  } = y,
                  O = (e) => `(${A}(?:(?!${k}${e.dot ? x : _}).)*?)`,
                  $ = n.dot ? "" : v,
                  N = n.dot ? H : T;
                let I = !0 === n.bash ? O(n) : L;
                n.capture && (I = `(${I})`), "boolean" == typeof n.noext && (n.noextglob = n.noext);
                const B = {
                  input: e,
                  index: -1,
                  start: 0,
                  dot: !0 === n.dot,
                  consumed: "",
                  output: "",
                  prefix: "",
                  backtrack: !1,
                  negated: !1,
                  brackets: 0,
                  braces: 0,
                  parens: 0,
                  quotes: 0,
                  globstar: !1,
                  tokens: g,
                };
                (e = r.removePrefix(e, B)), (d = e.length);
                const M = [],
                  P = [],
                  D = [];
                let U,
                  G = h;
                const j = () => B.index === d - 1,
                  K = (B.peek = (t = 1) => e[B.index + t]),
                  F = (B.advance = () => e[++B.index]),
                  W = () => e.slice(B.index + 1),
                  Q = (e = "", t = 0) => {
                    (B.consumed += e), (B.index += t);
                  },
                  X = (e) => {
                    (B.output += null != e.output ? e.output : e.value), Q(e.value);
                  },
                  q = () => {
                    let e = 1;
                    for (; "!" === K() && ("(" !== K(2) || "?" === K(3)); ) F(), B.start++, e++;
                    return e % 2 != 0 && ((B.negated = !0), B.start++, !0);
                  },
                  Z = (e) => {
                    B[e]++, D.push(e);
                  },
                  Y = (e) => {
                    B[e]--, D.pop();
                  },
                  z = (e) => {
                    if ("globstar" === G.type) {
                      const t = B.braces > 0 && ("comma" === e.type || "brace" === e.type),
                        n = !0 === e.extglob || (M.length && ("pipe" === e.type || "paren" === e.type));
                      "slash" === e.type ||
                        "paren" === e.type ||
                        t ||
                        n ||
                        ((B.output = B.output.slice(0, -G.output.length)),
                        (G.type = "star"),
                        (G.value = "*"),
                        (G.output = I),
                        (B.output += G.output));
                    }
                    if (
                      (M.length && "paren" !== e.type && !m[e.value] && (M[M.length - 1].inner += e.value),
                      (e.value || e.output) && X(e),
                      G && "text" === G.type && "text" === e.type)
                    )
                      return (G.value += e.value), void (G.output = (G.output || "") + e.value);
                    (e.prev = G), g.push(e), (G = e);
                  },
                  V = (e, t) => {
                    const o = { ...m[t], conditions: 1, inner: "" };
                    (o.prev = G), (o.parens = B.parens), (o.output = B.output);
                    const r = (n.capture ? "(" : "") + o.open;
                    Z("parens"),
                      z({ type: e, value: t, output: B.output ? "" : b }),
                      z({ type: "paren", extglob: !0, value: F(), output: r }),
                      M.push(o);
                  },
                  J = (e) => {
                    let t = e.close + (n.capture ? ")" : "");
                    if ("negate" === e.type) {
                      let o = I;
                      e.inner && e.inner.length > 1 && e.inner.includes("/") && (o = O(n)),
                        (o !== I || j() || /^\)+$/.test(W())) && (t = e.close = ")$))" + o),
                        "bos" === e.prev.type && j() && (B.negatedExtglob = !0);
                    }
                    z({ type: "paren", extglob: !0, value: U, output: t }), Y("parens");
                  };
                if (!1 !== n.fastpaths && !/(^[*!]|[/()[\]{}"])/.test(e)) {
                  let o = !1,
                    a = e.replace(u, (e, t, n, r, a, s) =>
                      "\\" === r
                        ? ((o = !0), e)
                        : "?" === r
                        ? t
                          ? t + r + (a ? H.repeat(a.length) : "")
                          : 0 === s
                          ? N + (a ? H.repeat(a.length) : "")
                          : H.repeat(n.length)
                        : "." === r
                        ? _.repeat(n.length)
                        : "*" === r
                        ? t
                          ? t + r + (a ? I : "")
                          : I
                        : t
                        ? e
                        : "\\" + e,
                    );
                  return (
                    !0 === o &&
                      (a =
                        !0 === n.unescape
                          ? a.replace(/\\/g, "")
                          : a.replace(/\\+/g, (e) => (e.length % 2 == 0 ? "\\\\" : e ? "\\" : ""))),
                    a === e && !0 === n.contains ? ((B.output = e), B) : ((B.output = r.wrapOutput(a, B, t)), B)
                  );
                }
                for (; !j(); ) {
                  if (((U = F()), "\0" === U)) continue;
                  if ("\\" === U) {
                    const e = K();
                    if ("/" === e && !0 !== n.bash) continue;
                    if ("." === e || ";" === e) continue;
                    if (!e) {
                      (U += "\\"), z({ type: "text", value: U });
                      continue;
                    }
                    const t = /^\\+/.exec(W());
                    let o = 0;
                    if (
                      (t && t[0].length > 2 && ((o = t[0].length), (B.index += o), o % 2 != 0 && (U += "\\")),
                      !0 === n.unescape ? (U = F() || "") : (U += F() || ""),
                      0 === B.brackets)
                    ) {
                      z({ type: "text", value: U });
                      continue;
                    }
                  }
                  if (B.brackets > 0 && ("]" !== U || "[" === G.value || "[^" === G.value)) {
                    if (!1 !== n.posix && ":" === U) {
                      const e = G.value.slice(1);
                      if (e.includes("[") && ((G.posix = !0), e.includes(":"))) {
                        const e = G.value.lastIndexOf("["),
                          t = G.value.slice(0, e),
                          n = G.value.slice(e + 2),
                          o = s[n];
                        if (o) {
                          (G.value = t + o), (B.backtrack = !0), F(), h.output || 1 !== g.indexOf(G) || (h.output = b);
                          continue;
                        }
                      }
                    }
                    (("[" === U && ":" !== K()) || ("-" === U && "]" === K())) && (U = "\\" + U),
                      "]" !== U || ("[" !== G.value && "[^" !== G.value) || (U = "\\" + U),
                      !0 === n.posix && "!" === U && "[" === G.value && (U = "^"),
                      (G.value += U),
                      X({ value: U });
                    continue;
                  }
                  if (1 === B.quotes && '"' !== U) {
                    (U = r.escapeRegex(U)), (G.value += U), X({ value: U });
                    continue;
                  }
                  if ('"' === U) {
                    (B.quotes = 1 === B.quotes ? 0 : 1), !0 === n.keepQuotes && z({ type: "text", value: U });
                    continue;
                  }
                  if ("(" === U) {
                    Z("parens"), z({ type: "paren", value: U });
                    continue;
                  }
                  if (")" === U) {
                    if (0 === B.parens && !0 === n.strictBrackets) throw new SyntaxError(c("opening", "("));
                    const e = M[M.length - 1];
                    if (e && B.parens === e.parens + 1) {
                      J(M.pop());
                      continue;
                    }
                    z({ type: "paren", value: U, output: B.parens ? ")" : "\\)" }), Y("parens");
                    continue;
                  }
                  if ("[" === U) {
                    if (!0 !== n.nobracket && W().includes("]")) Z("brackets");
                    else {
                      if (!0 !== n.nobracket && !0 === n.strictBrackets) throw new SyntaxError(c("closing", "]"));
                      U = "\\" + U;
                    }
                    z({ type: "bracket", value: U });
                    continue;
                  }
                  if ("]" === U) {
                    if (!0 === n.nobracket || (G && "bracket" === G.type && 1 === G.value.length)) {
                      z({ type: "text", value: U, output: "\\" + U });
                      continue;
                    }
                    if (0 === B.brackets) {
                      if (!0 === n.strictBrackets) throw new SyntaxError(c("opening", "["));
                      z({ type: "text", value: U, output: "\\" + U });
                      continue;
                    }
                    Y("brackets");
                    const e = G.value.slice(1);
                    if (
                      (!0 === G.posix || "^" !== e[0] || e.includes("/") || (U = "/" + U),
                      (G.value += U),
                      X({ value: U }),
                      !1 === n.literalBrackets || r.hasRegexChars(e))
                    )
                      continue;
                    const t = r.escapeRegex(G.value);
                    if (((B.output = B.output.slice(0, -G.value.length)), !0 === n.literalBrackets)) {
                      (B.output += t), (G.value = t);
                      continue;
                    }
                    (G.value = `(${A}${t}|${G.value})`), (B.output += G.value);
                    continue;
                  }
                  if ("{" === U && !0 !== n.nobrace) {
                    Z("braces");
                    const e = {
                      type: "brace",
                      value: U,
                      output: "(",
                      outputIndex: B.output.length,
                      tokensIndex: B.tokens.length,
                    };
                    P.push(e), z(e);
                    continue;
                  }
                  if ("}" === U) {
                    const e = P[P.length - 1];
                    if (!0 === n.nobrace || !e) {
                      z({ type: "text", value: U, output: U });
                      continue;
                    }
                    let t = ")";
                    if (!0 === e.dots) {
                      const e = g.slice(),
                        o = [];
                      for (let t = e.length - 1; t >= 0 && (g.pop(), "brace" !== e[t].type); t--)
                        "dots" !== e[t].type && o.unshift(e[t].value);
                      (t = p(o, n)), (B.backtrack = !0);
                    }
                    if (!0 !== e.comma && !0 !== e.dots) {
                      const n = B.output.slice(0, e.outputIndex),
                        o = B.tokens.slice(e.tokensIndex);
                      (e.value = e.output = "\\{"), (U = t = "\\}"), (B.output = n);
                      for (const e of o) B.output += e.output || e.value;
                    }
                    z({ type: "brace", value: U, output: t }), Y("braces"), P.pop();
                    continue;
                  }
                  if ("|" === U) {
                    M.length > 0 && M[M.length - 1].conditions++, z({ type: "text", value: U });
                    continue;
                  }
                  if ("," === U) {
                    let e = U;
                    const t = P[P.length - 1];
                    t && "braces" === D[D.length - 1] && ((t.comma = !0), (e = "|")),
                      z({ type: "comma", value: U, output: e });
                    continue;
                  }
                  if ("/" === U) {
                    if ("dot" === G.type && B.index === B.start + 1) {
                      (B.start = B.index + 1), (B.consumed = ""), (B.output = ""), g.pop(), (G = h);
                      continue;
                    }
                    z({ type: "slash", value: U, output: C });
                    continue;
                  }
                  if ("." === U) {
                    if (B.braces > 0 && "dot" === G.type) {
                      "." === G.value && (G.output = _);
                      const e = P[P.length - 1];
                      (G.type = "dots"), (G.output += U), (G.value += U), (e.dots = !0);
                      continue;
                    }
                    if (B.braces + B.parens === 0 && "bos" !== G.type && "slash" !== G.type) {
                      z({ type: "text", value: U, output: _ });
                      continue;
                    }
                    z({ type: "dot", value: U, output: _ });
                    continue;
                  }
                  if ("?" === U) {
                    if (!(G && "(" === G.value) && !0 !== n.noextglob && "(" === K() && "?" !== K(2)) {
                      V("qmark", U);
                      continue;
                    }
                    if (G && "paren" === G.type) {
                      const e = K();
                      let t = U;
                      if ("<" === e && !r.supportsLookbehinds())
                        throw new Error("Node.js v10 or higher is required for regex lookbehinds");
                      (("(" === G.value && !/[!=<:]/.test(e)) || ("<" === e && !/<([!=]|\w+>)/.test(W()))) &&
                        (t = "\\" + U),
                        z({ type: "text", value: U, output: t });
                      continue;
                    }
                    if (!0 !== n.dot && ("slash" === G.type || "bos" === G.type)) {
                      z({ type: "qmark", value: U, output: T });
                      continue;
                    }
                    z({ type: "qmark", value: U, output: H });
                    continue;
                  }
                  if ("!" === U) {
                    if (!0 !== n.noextglob && "(" === K() && ("?" !== K(2) || !/[!=<:]/.test(K(3)))) {
                      V("negate", U);
                      continue;
                    }
                    if (!0 !== n.nonegate && 0 === B.index) {
                      q();
                      continue;
                    }
                  }
                  if ("+" === U) {
                    if (!0 !== n.noextglob && "(" === K() && "?" !== K(2)) {
                      V("plus", U);
                      continue;
                    }
                    if ((G && "(" === G.value) || !1 === n.regex) {
                      z({ type: "plus", value: U, output: E });
                      continue;
                    }
                    if ((G && ("bracket" === G.type || "paren" === G.type || "brace" === G.type)) || B.parens > 0) {
                      z({ type: "plus", value: U });
                      continue;
                    }
                    z({ type: "plus", value: E });
                    continue;
                  }
                  if ("@" === U) {
                    if (!0 !== n.noextglob && "(" === K() && "?" !== K(2)) {
                      z({ type: "at", extglob: !0, value: U, output: "" });
                      continue;
                    }
                    z({ type: "text", value: U });
                    continue;
                  }
                  if ("*" !== U) {
                    ("$" !== U && "^" !== U) || (U = "\\" + U);
                    const e = i.exec(W());
                    e && ((U += e[0]), (B.index += e[0].length)), z({ type: "text", value: U });
                    continue;
                  }
                  if (G && ("globstar" === G.type || !0 === G.star)) {
                    (G.type = "star"),
                      (G.star = !0),
                      (G.value += U),
                      (G.output = I),
                      (B.backtrack = !0),
                      (B.globstar = !0),
                      Q(U);
                    continue;
                  }
                  let t = W();
                  if (!0 !== n.noextglob && /^\([^?]/.test(t)) {
                    V("star", U);
                    continue;
                  }
                  if ("star" === G.type) {
                    if (!0 === n.noglobstar) {
                      Q(U);
                      continue;
                    }
                    const o = G.prev,
                      r = o.prev,
                      a = "slash" === o.type || "bos" === o.type,
                      s = r && ("star" === r.type || "globstar" === r.type);
                    if (!0 === n.bash && (!a || (t[0] && "/" !== t[0]))) {
                      z({ type: "star", value: U, output: "" });
                      continue;
                    }
                    const i = B.braces > 0 && ("comma" === o.type || "brace" === o.type),
                      u = M.length && ("pipe" === o.type || "paren" === o.type);
                    if (!a && "paren" !== o.type && !i && !u) {
                      z({ type: "star", value: U, output: "" });
                      continue;
                    }
                    for (; "/**" === t.slice(0, 3); ) {
                      const n = e[B.index + 4];
                      if (n && "/" !== n) break;
                      (t = t.slice(3)), Q("/**", 3);
                    }
                    if ("bos" === o.type && j()) {
                      (G.type = "globstar"),
                        (G.value += U),
                        (G.output = O(n)),
                        (B.output = G.output),
                        (B.globstar = !0),
                        Q(U);
                      continue;
                    }
                    if ("slash" === o.type && "bos" !== o.prev.type && !s && j()) {
                      (B.output = B.output.slice(0, -(o.output + G.output).length)),
                        (o.output = "(?:" + o.output),
                        (G.type = "globstar"),
                        (G.output = O(n) + (n.strictSlashes ? ")" : "|$)")),
                        (G.value += U),
                        (B.globstar = !0),
                        (B.output += o.output + G.output),
                        Q(U);
                      continue;
                    }
                    if ("slash" === o.type && "bos" !== o.prev.type && "/" === t[0]) {
                      const e = void 0 !== t[1] ? "|$" : "";
                      (B.output = B.output.slice(0, -(o.output + G.output).length)),
                        (o.output = "(?:" + o.output),
                        (G.type = "globstar"),
                        (G.output = `${O(n)}${C}|${C}${e})`),
                        (G.value += U),
                        (B.output += o.output + G.output),
                        (B.globstar = !0),
                        Q(U + F()),
                        z({ type: "slash", value: "/", output: "" });
                      continue;
                    }
                    if ("bos" === o.type && "/" === t[0]) {
                      (G.type = "globstar"),
                        (G.value += U),
                        (G.output = `(?:^|${C}|${O(n)}${C})`),
                        (B.output = G.output),
                        (B.globstar = !0),
                        Q(U + F()),
                        z({ type: "slash", value: "/", output: "" });
                      continue;
                    }
                    (B.output = B.output.slice(0, -G.output.length)),
                      (G.type = "globstar"),
                      (G.output = O(n)),
                      (G.value += U),
                      (B.output += G.output),
                      (B.globstar = !0),
                      Q(U);
                    continue;
                  }
                  const o = { type: "star", value: U, output: I };
                  !0 !== n.bash
                    ? !G || ("bracket" !== G.type && "paren" !== G.type) || !0 !== n.regex
                      ? ((B.index !== B.start && "slash" !== G.type && "dot" !== G.type) ||
                          ("dot" === G.type
                            ? ((B.output += S), (G.output += S))
                            : !0 === n.dot
                            ? ((B.output += w), (G.output += w))
                            : ((B.output += $), (G.output += $)),
                          "*" !== K() && ((B.output += b), (G.output += b))),
                        z(o))
                      : ((o.output = U), z(o))
                    : ((o.output = ".*?"), ("bos" !== G.type && "slash" !== G.type) || (o.output = $ + o.output), z(o));
                }
                for (; B.brackets > 0; ) {
                  if (!0 === n.strictBrackets) throw new SyntaxError(c("closing", "]"));
                  (B.output = r.escapeLast(B.output, "[")), Y("brackets");
                }
                for (; B.parens > 0; ) {
                  if (!0 === n.strictBrackets) throw new SyntaxError(c("closing", ")"));
                  (B.output = r.escapeLast(B.output, "(")), Y("parens");
                }
                for (; B.braces > 0; ) {
                  if (!0 === n.strictBrackets) throw new SyntaxError(c("closing", "}"));
                  (B.output = r.escapeLast(B.output, "{")), Y("braces");
                }
                if (
                  (!0 === n.strictSlashes ||
                    ("star" !== G.type && "bracket" !== G.type) ||
                    z({ type: "maybe_slash", value: "", output: C + "?" }),
                  !0 === B.backtrack)
                ) {
                  B.output = "";
                  for (const e of B.tokens)
                    (B.output += null != e.output ? e.output : e.value), e.suffix && (B.output += e.suffix);
                }
                return B;
              };
            (f.fastpaths = (e, t) => {
              const n = { ...t },
                s = "number" == typeof n.maxLength ? Math.min(a, n.maxLength) : a,
                i = e.length;
              if (i > s) throw new SyntaxError(`Input length: ${i}, exceeds maximum allowed length: ${s}`);
              e = l[e] || e;
              const u = r.isWindows(t),
                {
                  DOT_LITERAL: p,
                  SLASH_LITERAL: c,
                  ONE_CHAR: f,
                  DOTS_SLASH: d,
                  NO_DOT: h,
                  NO_DOTS: g,
                  NO_DOTS_SLASH: A,
                  STAR: R,
                  START_ANCHOR: y,
                } = o.globChars(u),
                m = n.dot ? g : h,
                _ = n.dot ? A : h,
                E = n.capture ? "" : "?:";
              let C = !0 === n.bash ? ".*?" : R;
              n.capture && (C = `(${C})`);
              const b = (e) => (!0 === e.noglobstar ? C : `(${E}(?:(?!${y}${e.dot ? d : p}).)*?)`),
                x = (e) => {
                  switch (e) {
                    case "*":
                      return `${m}${f}${C}`;
                    case ".*":
                      return `${p}${f}${C}`;
                    case "*.*":
                      return `${m}${C}${p}${f}${C}`;
                    case "*/*":
                      return `${m}${C}${c}${f}${_}${C}`;
                    case "**":
                      return m + b(n);
                    case "**/*":
                      return `(?:${m}${b(n)}${c})?${_}${f}${C}`;
                    case "**/*.*":
                      return `(?:${m}${b(n)}${c})?${_}${C}${p}${f}${C}`;
                    case "**/.*":
                      return `(?:${m}${b(n)}${c})?${p}${f}${C}`;
                    default: {
                      const t = /^(.*?)\.(\w+)$/.exec(e);
                      if (!t) return;
                      const n = x(t[1]);
                      if (!n) return;
                      return n + p + t[2];
                    }
                  }
                },
                v = r.removePrefix(e, { negated: !1, prefix: "" });
              let S = x(v);
              return S && !0 !== n.strictSlashes && (S += c + "?"), S;
            }),
              (e.exports = f);
          },
          828: (e, t, n) => {
            const o = n(622),
              r = n(321),
              a = n(974),
              s = n(598),
              i = n(86),
              u = (e, t, n = !1) => {
                if (Array.isArray(e)) {
                  const o = e.map((e) => u(e, t, n));
                  return (e) => {
                    for (const t of o) {
                      const n = t(e);
                      if (n) return n;
                    }
                    return !1;
                  };
                }
                const o = (r = e) && "object" == typeof r && !Array.isArray(r) && e.tokens && e.input;
                var r;
                if ("" === e || ("string" != typeof e && !o))
                  throw new TypeError("Expected pattern to be a non-empty string");
                const a = t || {},
                  i = s.isWindows(t),
                  l = o ? u.compileRe(e, t) : u.makeRe(e, t, !1, !0),
                  p = l.state;
                delete l.state;
                let c = () => !1;
                if (a.ignore) {
                  const e = { ...t, ignore: null, onMatch: null, onResult: null };
                  c = u(a.ignore, e, n);
                }
                const f = (n, o = !1) => {
                  const { isMatch: r, match: s, output: f } = u.test(n, l, t, { glob: e, posix: i }),
                    d = { glob: e, state: p, regex: l, posix: i, input: n, output: f, match: s, isMatch: r };
                  return (
                    "function" == typeof a.onResult && a.onResult(d),
                    !1 === r
                      ? ((d.isMatch = !1), !!o && d)
                      : c(n)
                      ? ("function" == typeof a.onIgnore && a.onIgnore(d), (d.isMatch = !1), !!o && d)
                      : ("function" == typeof a.onMatch && a.onMatch(d), !o || d)
                  );
                };
                return n && (f.state = p), f;
              };
            (u.test = (e, t, n, { glob: o, posix: r } = {}) => {
              if ("string" != typeof e) throw new TypeError("Expected input to be a string");
              if ("" === e) return { isMatch: !1, output: "" };
              const a = n || {},
                i = a.format || (r ? s.toPosixSlashes : null);
              let l = e === o,
                p = l && i ? i(e) : e;
              return (
                !1 === l && ((p = i ? i(e) : e), (l = p === o)),
                (!1 !== l && !0 !== a.capture) ||
                  (l = !0 === a.matchBase || !0 === a.basename ? u.matchBase(e, t, n, r) : t.exec(p)),
                { isMatch: Boolean(l), match: l, output: p }
              );
            }),
              (u.matchBase = (e, t, n, r = s.isWindows(n)) =>
                (t instanceof RegExp ? t : u.makeRe(t, n)).test(o.basename(e))),
              (u.isMatch = (e, t, n) => u(t, n)(e)),
              (u.parse = (e, t) => (Array.isArray(e) ? e.map((e) => u.parse(e, t)) : a(e, { ...t, fastpaths: !1 }))),
              (u.scan = (e, t) => r(e, t)),
              (u.compileRe = (e, t, n = !1, o = !1) => {
                if (!0 === n) return e.output;
                const r = t || {},
                  a = r.contains ? "" : "^",
                  s = r.contains ? "" : "$";
                let i = `${a}(?:${e.output})${s}`;
                e && !0 === e.negated && (i = `^(?!${i}).*$`);
                const l = u.toRegex(i, t);
                return !0 === o && (l.state = e), l;
              }),
              (u.makeRe = (e, t, n = !1, o = !1) => {
                if (!e || "string" != typeof e) throw new TypeError("Expected a non-empty string");
                const r = t || {};
                let s,
                  i = { negated: !1, fastpaths: !0 },
                  l = "";
                return (
                  e.startsWith("./") && ((e = e.slice(2)), (l = i.prefix = "./")),
                  !1 === r.fastpaths || ("." !== e[0] && "*" !== e[0]) || (s = a.fastpaths(e, t)),
                  void 0 === s ? ((i = a(e, t)), (i.prefix = l + (i.prefix || ""))) : (i.output = s),
                  u.compileRe(i, t, n, o)
                );
              }),
              (u.toRegex = (e, t) => {
                try {
                  const n = t || {};
                  return new RegExp(e, n.flags || (n.nocase ? "i" : ""));
                } catch (e) {
                  if (t && !0 === t.debug) throw e;
                  return /$^/;
                }
              }),
              (u.constants = i),
              (e.exports = u);
          },
          321: (e, t, n) => {
            const o = n(598),
              {
                CHAR_ASTERISK: r,
                CHAR_AT: a,
                CHAR_BACKWARD_SLASH: s,
                CHAR_COMMA: i,
                CHAR_DOT: u,
                CHAR_EXCLAMATION_MARK: l,
                CHAR_FORWARD_SLASH: p,
                CHAR_LEFT_CURLY_BRACE: c,
                CHAR_LEFT_PARENTHESES: f,
                CHAR_LEFT_SQUARE_BRACKET: d,
                CHAR_PLUS: h,
                CHAR_QUESTION_MARK: g,
                CHAR_RIGHT_CURLY_BRACE: A,
                CHAR_RIGHT_PARENTHESES: R,
                CHAR_RIGHT_SQUARE_BRACKET: y,
              } = n(86),
              m = (e) => e === p || e === s,
              _ = (e) => {
                !0 !== e.isPrefix && (e.depth = e.isGlobstar ? 1 / 0 : 1);
              };
            e.exports = (e, t) => {
              const n = t || {},
                E = e.length - 1,
                C = !0 === n.parts || !0 === n.scanToEnd,
                b = [],
                x = [],
                v = [];
              let S,
                w,
                H = e,
                T = -1,
                L = 0,
                k = 0,
                O = !1,
                $ = !1,
                N = !1,
                I = !1,
                B = !1,
                M = !1,
                P = !1,
                D = !1,
                U = !1,
                G = 0,
                j = { value: "", depth: 0, isGlob: !1 };
              const K = () => T >= E,
                F = () => ((S = w), H.charCodeAt(++T));
              for (; T < E; ) {
                let e;
                if (((w = F()), w !== s)) {
                  if (!0 === M || w === c) {
                    for (G++; !0 !== K() && (w = F()); )
                      if (w !== s)
                        if (w !== c) {
                          if (!0 !== M && w === u && (w = F()) === u) {
                            if (((O = j.isBrace = !0), (N = j.isGlob = !0), (U = !0), !0 === C)) continue;
                            break;
                          }
                          if (!0 !== M && w === i) {
                            if (((O = j.isBrace = !0), (N = j.isGlob = !0), (U = !0), !0 === C)) continue;
                            break;
                          }
                          if (w === A && (G--, 0 === G)) {
                            (M = !1), (O = j.isBrace = !0), (U = !0);
                            break;
                          }
                        } else G++;
                      else (P = j.backslashes = !0), F();
                    if (!0 === C) continue;
                    break;
                  }
                  if (w !== p) {
                    if (!0 !== n.noext) {
                      if (!0 === (w === h || w === a || w === r || w === g || w === l) && H.charCodeAt(T + 1) === f) {
                        if (((N = j.isGlob = !0), (I = j.isExtglob = !0), (U = !0), !0 === C)) {
                          for (; !0 !== K() && (w = F()); )
                            if (w !== s) {
                              if (w === R) {
                                (N = j.isGlob = !0), (U = !0);
                                break;
                              }
                            } else (P = j.backslashes = !0), (w = F());
                          continue;
                        }
                        break;
                      }
                    }
                    if (w === r) {
                      if ((S === r && (B = j.isGlobstar = !0), (N = j.isGlob = !0), (U = !0), !0 === C)) continue;
                      break;
                    }
                    if (w === g) {
                      if (((N = j.isGlob = !0), (U = !0), !0 === C)) continue;
                      break;
                    }
                    if (w === d)
                      for (; !0 !== K() && (e = F()); )
                        if (e !== s) {
                          if (e === y) {
                            if ((($ = j.isBracket = !0), (N = j.isGlob = !0), (U = !0), !0 === C)) continue;
                            break;
                          }
                        } else (P = j.backslashes = !0), F();
                    if (!0 === n.nonegate || w !== l || T !== L) {
                      if (!0 !== n.noparen && w === f) {
                        if (((N = j.isGlob = !0), !0 === C)) {
                          for (; !0 !== K() && (w = F()); )
                            if (w !== f) {
                              if (w === R) {
                                U = !0;
                                break;
                              }
                            } else (P = j.backslashes = !0), (w = F());
                          continue;
                        }
                        break;
                      }
                      if (!0 === N) {
                        if (((U = !0), !0 === C)) continue;
                        break;
                      }
                    } else (D = j.negated = !0), L++;
                  } else {
                    if ((b.push(T), x.push(j), (j = { value: "", depth: 0, isGlob: !1 }), !0 === U)) continue;
                    if (S === u && T === L + 1) {
                      L += 2;
                      continue;
                    }
                    k = T + 1;
                  }
                } else (P = j.backslashes = !0), (w = F()), w === c && (M = !0);
              }
              !0 === n.noext && ((I = !1), (N = !1));
              let W = H,
                Q = "",
                X = "";
              L > 0 && ((Q = H.slice(0, L)), (H = H.slice(L)), (k -= L)),
                W && !0 === N && k > 0
                  ? ((W = H.slice(0, k)), (X = H.slice(k)))
                  : !0 === N
                  ? ((W = ""), (X = H))
                  : (W = H),
                W && "" !== W && "/" !== W && W !== H && m(W.charCodeAt(W.length - 1)) && (W = W.slice(0, -1)),
                !0 === n.unescape && (X && (X = o.removeBackslashes(X)), W && !0 === P && (W = o.removeBackslashes(W)));
              const q = {
                prefix: Q,
                input: e,
                start: L,
                base: W,
                glob: X,
                isBrace: O,
                isBracket: $,
                isGlob: N,
                isExtglob: I,
                isGlobstar: B,
                negated: D,
              };
              if (
                (!0 === n.tokens && ((q.maxDepth = 0), m(w) || x.push(j), (q.tokens = x)),
                !0 === n.parts || !0 === n.tokens)
              ) {
                let t;
                for (let o = 0; o < b.length; o++) {
                  const r = t ? t + 1 : L,
                    a = b[o],
                    s = e.slice(r, a);
                  n.tokens &&
                    (0 === o && 0 !== L ? ((x[o].isPrefix = !0), (x[o].value = Q)) : (x[o].value = s),
                    _(x[o]),
                    (q.maxDepth += x[o].depth)),
                    (0 === o && "" === s) || v.push(s),
                    (t = a);
                }
                if (t && t + 1 < e.length) {
                  const o = e.slice(t + 1);
                  v.push(o),
                    n.tokens &&
                      ((x[x.length - 1].value = o), _(x[x.length - 1]), (q.maxDepth += x[x.length - 1].depth));
                }
                (q.slashes = b), (q.parts = v);
              }
              return q;
            };
          },
          598: (e, t, n) => {
            const o = n(622),
              r = "win32" === process.platform,
              {
                REGEX_BACKSLASH: a,
                REGEX_REMOVE_BACKSLASH: s,
                REGEX_SPECIAL_CHARS: i,
                REGEX_SPECIAL_CHARS_GLOBAL: u,
              } = n(86);
            (t.isObject = (e) => null !== e && "object" == typeof e && !Array.isArray(e)),
              (t.hasRegexChars = (e) => i.test(e)),
              (t.isRegexChar = (e) => 1 === e.length && t.hasRegexChars(e)),
              (t.escapeRegex = (e) => e.replace(u, "\\$1")),
              (t.toPosixSlashes = (e) => e.replace(a, "/")),
              (t.removeBackslashes = (e) => e.replace(s, (e) => ("\\" === e ? "" : e))),
              (t.supportsLookbehinds = () => {
                const e = process.version.slice(1).split(".").map(Number);
                return (3 === e.length && e[0] >= 9) || (8 === e[0] && e[1] >= 10);
              }),
              (t.isWindows = (e) => (e && "boolean" == typeof e.windows ? e.windows : !0 === r || "\\" === o.sep)),
              (t.escapeLast = (e, n, o) => {
                const r = e.lastIndexOf(n, o);
                return -1 === r ? e : "\\" === e[r - 1] ? t.escapeLast(e, n, r - 1) : `${e.slice(0, r)}\\${e.slice(r)}`;
              }),
              (t.removePrefix = (e, t = {}) => {
                let n = e;
                return n.startsWith("./") && ((n = n.slice(2)), (t.prefix = "./")), n;
              }),
              (t.wrapOutput = (e, t = {}, n = {}) => {
                let o = `${n.contains ? "" : "^"}(?:${e})${n.contains ? "" : "$"}`;
                return !0 === t.negated && (o = `(?:^(?!${o}).*$)`), o;
              });
          },
          615: (e, t, n) => {
            /*!
             * to-regex-range <https://github.com/micromatch/to-regex-range>
             *
             * Copyright (c) 2015-present, Jon Schlinkert.
             * Released under the MIT License.
             */
            const o = n(761),
              r = (e, t, n) => {
                if (!1 === o(e)) throw new TypeError("toRegexRange: expected the first argument to be a number");
                if (void 0 === t || e === t) return String(e);
                if (!1 === o(t)) throw new TypeError("toRegexRange: expected the second argument to be a number.");
                let a = { relaxZeros: !0, ...n };
                "boolean" == typeof a.strictZeros && (a.relaxZeros = !1 === a.strictZeros);
                let u =
                  e + ":" + t + "=" + String(a.relaxZeros) + String(a.shorthand) + String(a.capture) + String(a.wrap);
                if (r.cache.hasOwnProperty(u)) return r.cache[u].result;
                let l = Math.min(e, t),
                  p = Math.max(e, t);
                if (1 === Math.abs(l - p)) {
                  let n = e + "|" + t;
                  return a.capture ? `(${n})` : !1 === a.wrap ? n : `(?:${n})`;
                }
                let c = h(e) || h(t),
                  f = { min: e, max: t, a: l, b: p },
                  d = [],
                  g = [];
                if ((c && ((f.isPadded = c), (f.maxLen = String(f.max).length)), l < 0)) {
                  (g = s(p < 0 ? Math.abs(p) : 1, Math.abs(l), f, a)), (l = f.a = 0);
                }
                return (
                  p >= 0 && (d = s(l, p, f, a)),
                  (f.negatives = g),
                  (f.positives = d),
                  (f.result = (function (e, t, n) {
                    let o = i(e, t, "-", !1, n) || [],
                      r = i(t, e, "", !1, n) || [],
                      a = i(e, t, "-?", !0, n) || [];
                    return o.concat(a).concat(r).join("|");
                  })(g, d, a)),
                  !0 === a.capture
                    ? (f.result = `(${f.result})`)
                    : !1 !== a.wrap && d.length + g.length > 1 && (f.result = `(?:${f.result})`),
                  (r.cache[u] = f),
                  f.result
                );
              };
            function a(e, t, n) {
              if (e === t) return { pattern: e, count: [], digits: 0 };
              let o = (function (e, t) {
                  let n = [];
                  for (let o = 0; o < e.length; o++) n.push([e[o], t[o]]);
                  return n;
                })(e, t),
                r = o.length,
                a = "",
                s = 0;
              for (let e = 0; e < r; e++) {
                let [t, r] = o[e];
                t === r ? (a += t) : "0" !== t || "9" !== r ? (a += d(t, r, n)) : s++;
              }
              return s && (a += !0 === n.shorthand ? "\\d" : "[0-9]"), { pattern: a, count: [s], digits: r };
            }
            function s(e, t, n, o) {
              let r,
                s = (function (e, t) {
                  let n = 1,
                    o = 1,
                    r = p(e, n),
                    a = new Set([t]);
                  for (; e <= r && r <= t; ) a.add(r), (n += 1), (r = p(e, n));
                  for (r = c(t + 1, o) - 1; e < r && r <= t; ) a.add(r), (o += 1), (r = c(t + 1, o) - 1);
                  return (a = [...a]), a.sort(u), a;
                })(e, t),
                i = [],
                l = e;
              for (let e = 0; e < s.length; e++) {
                let t = s[e],
                  u = a(String(l), String(t), o),
                  p = "";
                n.isPadded || !r || r.pattern !== u.pattern
                  ? (n.isPadded && (p = g(t, n, o)),
                    (u.string = p + u.pattern + f(u.count)),
                    i.push(u),
                    (l = t + 1),
                    (r = u))
                  : (r.count.length > 1 && r.count.pop(),
                    r.count.push(u.count[0]),
                    (r.string = r.pattern + f(r.count)),
                    (l = t + 1));
              }
              return i;
            }
            function i(e, t, n, o, r) {
              let a = [];
              for (let r of e) {
                let { string: e } = r;
                o || l(t, "string", e) || a.push(n + e), o && l(t, "string", e) && a.push(n + e);
              }
              return a;
            }
            function u(e, t) {
              return e > t ? 1 : t > e ? -1 : 0;
            }
            function l(e, t, n) {
              return e.some((e) => e[t] === n);
            }
            function p(e, t) {
              return Number(String(e).slice(0, -t) + "9".repeat(t));
            }
            function c(e, t) {
              return e - (e % Math.pow(10, t));
            }
            function f(e) {
              let [t = 0, n = ""] = e;
              return n || t > 1 ? `{${t + (n ? "," + n : "")}}` : "";
            }
            function d(e, t, n) {
              return `[${e}${t - e == 1 ? "" : "-"}${t}]`;
            }
            function h(e) {
              return /^-?(0+)\d/.test(e);
            }
            function g(e, t, n) {
              if (!t.isPadded) return e;
              let o = Math.abs(t.maxLen - String(e).length),
                r = !1 !== n.relaxZeros;
              switch (o) {
                case 0:
                  return "";
                case 1:
                  return r ? "0?" : "0";
                case 2:
                  return r ? "0{0,2}" : "00";
                default:
                  return r ? `0{0,${o}}` : `0{${o}}`;
              }
            }
            (r.cache = {}), (r.clearCache = () => (r.cache = {})), (e.exports = r);
          },
          594: (e) => {
            e.exports = require("@yarnpkg/cli");
          },
          966: (e) => {
            e.exports = require("@yarnpkg/core");
          },
          42: (e) => {
            e.exports = require("clipanion");
          },
          87: (e) => {
            e.exports = require("os");
          },
          622: (e) => {
            e.exports = require("path");
          },
          669: (e) => {
            e.exports = require("util");
          },
          440: (e) => {
            e.exports = require("yup");
          },
        },
        t = {};
      function n(o) {
        if (t[o]) return t[o].exports;
        var r = (t[o] = { exports: {} });
        return e[o](r, r.exports, n), r.exports;
      }
      return (
        (n.n = (e) => {
          var t = e && e.__esModule ? () => e.default : () => e;
          return n.d(t, { a: t }), t;
        }),
        (n.d = (e, t) => {
          for (var o in t) n.o(t, o) && !n.o(e, o) && Object.defineProperty(e, o, { enumerable: !0, get: t[o] });
        }),
        (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (n.r = (e) => {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        n(115)
      );
    })();
    return plugin;
  },
};
