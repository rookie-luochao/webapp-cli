/* eslint-disable */
module.exports = {
  name: "@yarnpkg/plugin-typescript",
  factory: function (require) {
    var plugin;
    plugin = (() => {
      var e = {
          948: (e, t, r) => {
            "use strict";
            r.r(t), r.d(t, { default: () => u });
            var s = r(966),
              a = r(850),
              o = r(513),
              n = r.n(o),
              i = r(410),
              c = r.n(i);
            const d = (e) => {
                const t = {
                  async send(t) {
                    try {
                      const r = await s.httpUtils.request(t.url, t.data || null, {
                        configuration: e,
                        headers: t.headers,
                      });
                      return { content: r.body, isTimedOut: !1, status: r.statusCode };
                    } catch (e) {
                      return { content: e.response.body, isTimedOut: !1, status: e.response.statusCode };
                    }
                  },
                };
                return c()("OFCNCOG2CU", "e8e1bd300d860104bb8c58453ffa1eb4", { requester: t });
              },
              l = (e) => (e.scope ? `${e.scope}__${e.name}` : "" + e.name),
              u = {
                hooks: {
                  afterWorkspaceDependencyAddition: async (e, t, r, o) => {
                    if ("types" === r.scope) return;
                    const { project: i } = e,
                      { configuration: c } = i,
                      u = c.makeResolver(),
                      p = { project: i, resolver: u, report: new s.ThrowReport() };
                    if (
                      !(await (async (e, t) => {
                        var r;
                        const a = s.structUtils.stringifyIdent(e),
                          o = d(t).initIndex("npm-search");
                        try {
                          return (
                            "definitely-typed" ===
                            (null === (r = (await o.getObject(a, { attributesToRetrieve: ["types"] })).types) ||
                            void 0 === r
                              ? void 0
                              : r.ts)
                          );
                        } catch (e) {
                          return !1;
                        }
                      })(r, c))
                    )
                      return;
                    const m = l(r);
                    let h = s.structUtils.parseRange(r.range).selector;
                    if (!n().validRange(h)) {
                      const e = await u.getCandidates(r, new Map(), p);
                      h = s.structUtils.parseRange(e[0].reference).selector;
                    }
                    const y = n().coerce(h);
                    if (null === y) return;
                    const g = `${a.suggestUtils.Modifier.CARET}${y.major}`,
                      b = s.structUtils.makeDescriptor(s.structUtils.makeIdent("types", m), g),
                      f = s.miscUtils.mapAndFind(i.workspaces, (e) => {
                        var t, a;
                        const o =
                            null === (t = e.manifest.dependencies.get(r.identHash)) || void 0 === t
                              ? void 0
                              : t.descriptorHash,
                          n =
                            null === (a = e.manifest.devDependencies.get(r.identHash)) || void 0 === a
                              ? void 0
                              : a.descriptorHash;
                        if (o !== r.descriptorHash && n !== r.descriptorHash) return s.miscUtils.mapAndFind.skip;
                        const i = [];
                        for (const t of s.Manifest.allDependencies) {
                          const r = e.manifest[t].get(b.identHash);
                          void 0 !== r && i.push([t, r]);
                        }
                        return 0 === i.length ? s.miscUtils.mapAndFind.skip : i;
                      });
                    if (void 0 !== f) for (const [t, r] of f) e.manifest[t].set(r.identHash, r);
                    else {
                      try {
                        if (0 === (await u.getCandidates(b, new Map(), p)).length) return;
                      } catch (e) {
                        return;
                      }
                      e.manifest[a.suggestUtils.Target.DEVELOPMENT].set(b.identHash, b);
                    }
                  },
                  afterWorkspaceDependencyRemoval: async (e, t, r) => {
                    if ("types" === r.scope) return;
                    const a = l(r),
                      o = s.structUtils.makeIdent("types", a);
                    for (const t of s.Manifest.allDependencies) {
                      void 0 !== e.manifest[t].get(o.identHash) && e.manifest[t].delete(o.identHash);
                    }
                  },
                  beforeWorkspacePacking: (e, t) => {
                    t.publishConfig && t.publishConfig.typings && (t.typings = t.publishConfig.typings),
                      t.publishConfig && t.publishConfig.types && (t.types = t.publishConfig.types);
                  },
                },
              };
          },
          469: (e, t, r) => {
            "use strict";
            function s(e) {
              const t = [...e.caches],
                r = t.shift();
              return void 0 === r
                ? a()
                : {
                    get: (e, a, o = { miss: () => Promise.resolve() }) =>
                      r.get(e, a, o).catch(() => s({ caches: t }).get(e, a, o)),
                    set: (e, a) => r.set(e, a).catch(() => s({ caches: t }).set(e, a)),
                    delete: (e) => r.delete(e).catch(() => s({ caches: t }).delete(e)),
                    clear: () => r.clear().catch(() => s({ caches: t }).clear()),
                  };
            }
            function a() {
              return {
                get: (e, t, r = { miss: () => Promise.resolve() }) =>
                  t()
                    .then((e) => Promise.all([e, r.miss(e)]))
                    .then(([e]) => e),
                set: (e, t) => Promise.resolve(t),
                delete: (e) => Promise.resolve(),
                clear: () => Promise.resolve(),
              };
            }
            r.r(t), r.d(t, { createFallbackableCache: () => s, createNullCache: () => a });
          },
          712: (e, t, r) => {
            "use strict";
            function s(e = { serializable: !0 }) {
              let t = {};
              return {
                get(r, s, a = { miss: () => Promise.resolve() }) {
                  const o = JSON.stringify(r);
                  if (o in t) return Promise.resolve(e.serializable ? JSON.parse(t[o]) : t[o]);
                  const n = s(),
                    i = (a && a.miss) || (() => Promise.resolve());
                  return n.then((e) => i(e)).then(() => n);
                },
                set: (r, s) => ((t[JSON.stringify(r)] = e.serializable ? JSON.stringify(s) : s), Promise.resolve(s)),
                delete: (e) => (delete t[JSON.stringify(e)], Promise.resolve()),
                clear: () => ((t = {}), Promise.resolve()),
              };
            }
            r.r(t), r.d(t, { createInMemoryCache: () => s });
          },
          223: (e, t, r) => {
            "use strict";
            r.r(t),
              r.d(t, {
                addABTest: () => i,
                createAnalyticsClient: () => n,
                deleteABTest: () => c,
                getABTest: () => d,
                getABTests: () => l,
                stopABTest: () => u,
              });
            var s = r(757),
              a = r(858),
              o = r(541);
            const n = (e) => {
                const t = e.region || "us",
                  r = (0, s.createAuth)(s.AuthMode.WithinHeaders, e.appId, e.apiKey),
                  o = (0, a.createTransporter)({
                    hosts: [{ url: `analytics.${t}.algolia.com` }],
                    ...e,
                    headers: { ...r.headers(), "content-type": "application/json", ...e.headers },
                    queryParameters: { ...r.queryParameters(), ...e.queryParameters },
                  }),
                  n = e.appId;
                return (0, s.addMethods)({ appId: n, transporter: o }, e.methods);
              },
              i = (e) => (t, r) => e.transporter.write({ method: o.N.Post, path: "2/abtests", data: t }, r),
              c = (e) => (t, r) =>
                e.transporter.write({ method: o.N.Delete, path: (0, s.encode)("2/abtests/%s", t) }, r),
              d = (e) => (t, r) => e.transporter.read({ method: o.N.Get, path: (0, s.encode)("2/abtests/%s", t) }, r),
              l = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "2/abtests" }, t),
              u = (e) => (t, r) =>
                e.transporter.write({ method: o.N.Post, path: (0, s.encode)("2/abtests/%s/stop", t) }, r);
          },
          757: (e, t, r) => {
            "use strict";
            function s(e, t, r) {
              const s = { "x-algolia-api-key": r, "x-algolia-application-id": t };
              return {
                headers: () => (e === u.WithinHeaders ? s : {}),
                queryParameters: () => (e === u.WithinQueryParameters ? s : {}),
              };
            }
            function a(e) {
              let t = 0;
              const r = () => (
                t++,
                new Promise((s) => {
                  setTimeout(() => {
                    s(e(r));
                  }, Math.min(100 * t, 1e3));
                })
              );
              return e(r);
            }
            function o(e, t = (e, t) => Promise.resolve()) {
              return Object.assign(e, { wait: (r) => o(e.then((e) => Promise.all([t(e, r), e])).then((e) => e[1])) });
            }
            function n(e) {
              let t = e.length - 1;
              for (; t > 0; t--) {
                const r = Math.floor(Math.random() * (t + 1)),
                  s = e[t];
                (e[t] = e[r]), (e[r] = s);
              }
              return e;
            }
            function i(e, t) {
              return (
                Object.keys(void 0 !== t ? t : {}).forEach((r) => {
                  e[r] = t[r](e);
                }),
                e
              );
            }
            function c(e, ...t) {
              let r = 0;
              return e.replace(/%s/g, () => encodeURIComponent(t[r++]));
            }
            r.r(t),
              r.d(t, {
                AuthMode: () => u,
                addMethods: () => i,
                createAuth: () => s,
                createRetryablePromise: () => a,
                createWaitablePromise: () => o,
                destroy: () => l,
                encode: () => c,
                shuffle: () => n,
                version: () => d,
              });
            const d = "4.2.0",
              l = (e) => () => e.transporter.requester.destroy(),
              u = { WithinQueryParameters: 0, WithinHeaders: 1 };
          },
          103: (e, t, r) => {
            "use strict";
            r.r(t),
              r.d(t, {
                createRecommendationClient: () => n,
                getPersonalizationStrategy: () => i,
                setPersonalizationStrategy: () => c,
              });
            var s = r(757),
              a = r(858),
              o = r(541);
            const n = (e) => {
                const t = e.region || "us",
                  r = (0, s.createAuth)(s.AuthMode.WithinHeaders, e.appId, e.apiKey),
                  o = (0, a.createTransporter)({
                    hosts: [{ url: `recommendation.${t}.algolia.com` }],
                    ...e,
                    headers: { ...r.headers(), "content-type": "application/json", ...e.headers },
                    queryParameters: { ...r.queryParameters(), ...e.queryParameters },
                  });
                return (0, s.addMethods)({ appId: e.appId, transporter: o }, e.methods);
              },
              i = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/strategies/personalization" }, t),
              c = (e) => (t, r) =>
                e.transporter.write({ method: o.N.Post, path: "1/strategies/personalization", data: t }, r);
          },
          586: (e, t, r) => {
            "use strict";
            r.r(t),
              r.d(t, {
                ApiKeyACLEnum: () => De,
                BatchActionEnum: () => we,
                ScopeEnum: () => Ae,
                StrategyEnum: () => qe,
                SynonymEnum: () => Re,
                addApiKey: () => p,
                assignUserID: () => m,
                assignUserIDs: () => h,
                batch: () => H,
                browseObjects: () => K,
                browseRules: () => B,
                browseSynonyms: () => z,
                chunkedBatch: () => V,
                clearObjects: () => $,
                clearRules: () => L,
                clearSynonyms: () => Q,
                copyIndex: () => y,
                copyRules: () => g,
                copySettings: () => b,
                copySynonyms: () => f,
                createBrowsablePromise: () => i,
                createMissingObjectIDError: () => d,
                createObjectNotFoundError: () => l,
                createSearchClient: () => c,
                createValidUntilNotFoundError: () => u,
                deleteApiKey: () => P,
                deleteBy: () => J,
                deleteIndex: () => _,
                deleteObject: () => X,
                deleteObjects: () => Y,
                deleteRule: () => Z,
                deleteSynonym: () => ee,
                exists: () => te,
                findObject: () => re,
                generateSecuredApiKey: () => I,
                getApiKey: () => O,
                getLogs: () => j,
                getObject: () => se,
                getObjectPosition: () => ae,
                getObjects: () => oe,
                getRule: () => ne,
                getSecuredApiKeyRemainingValidity: () => v,
                getSettings: () => ie,
                getSynonym: () => ce,
                getTask: () => de,
                getTopUserIDs: () => N,
                getUserID: () => x,
                hasPendingMappings: () => S,
                initIndex: () => D,
                listApiKeys: () => w,
                listClusters: () => A,
                listIndices: () => q,
                listUserIDs: () => R,
                moveIndex: () => T,
                multipleBatch: () => k,
                multipleGetObjects: () => U,
                multipleQueries: () => C,
                multipleSearchForFacetValues: () => E,
                partialUpdateObject: () => le,
                partialUpdateObjects: () => ue,
                removeUserID: () => M,
                replaceAllObjects: () => pe,
                replaceAllRules: () => me,
                replaceAllSynonyms: () => he,
                restoreApiKey: () => W,
                saveObject: () => ye,
                saveObjects: () => ge,
                saveRule: () => be,
                saveRules: () => fe,
                saveSynonym: () => Pe,
                saveSynonyms: () => Ie,
                search: () => Oe,
                searchForFacetValues: () => je,
                searchRules: () => ve,
                searchSynonyms: () => Ne,
                searchUserIDs: () => F,
                setSettings: () => xe,
                updateApiKey: () => G,
                waitTask: () => Se,
              });
            var s = r(757),
              a = r(858),
              o = r(541),
              n = r(417);
            function i(e) {
              const t = (r) =>
                e.request(r).then((s) => {
                  if ((void 0 !== e.batch && e.batch(s.hits), !e.shouldStop(s)))
                    return s.cursor ? t({ cursor: s.cursor }) : t({ page: (r.page || 0) + 1 });
                });
              return t({});
            }
            const c = (e) => {
              const t = e.appId,
                r = (0, s.createAuth)(void 0 !== e.authMode ? e.authMode : s.AuthMode.WithinHeaders, t, e.apiKey),
                o = (0, a.createTransporter)({
                  hosts: [
                    { url: t + "-dsn.algolia.net", accept: a.CallEnum.Read },
                    { url: t + ".algolia.net", accept: a.CallEnum.Write },
                  ].concat(
                    (0, s.shuffle)([
                      { url: t + "-1.algolianet.com" },
                      { url: t + "-2.algolianet.com" },
                      { url: t + "-3.algolianet.com" },
                    ]),
                  ),
                  ...e,
                  headers: { ...r.headers(), "content-type": "application/x-www-form-urlencoded", ...e.headers },
                  queryParameters: { ...r.queryParameters(), ...e.queryParameters },
                }),
                n = {
                  transporter: o,
                  appId: t,
                  addAlgoliaAgent(e, t) {
                    o.userAgent.add({ segment: e, version: t });
                  },
                  clearCache: () => Promise.all([o.requestsCache.clear(), o.responsesCache.clear()]).then(() => {}),
                };
              return (0, s.addMethods)(n, e.methods);
            };
            function d() {
              return {
                name: "MissingObjectIDError",
                message:
                  "All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option.",
              };
            }
            function l() {
              return { name: "ObjectNotFoundError", message: "Object not found." };
            }
            function u() {
              return { name: "ValidUntilNotFoundError", message: "ValidUntil not found in given secured api key." };
            }
            const p = (e) => (t, r) => {
                const { queryParameters: a, ...n } = r || {},
                  i = { acl: t, ...(void 0 !== a ? { queryParameters: a } : {}) };
                return (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Post, path: "1/keys", data: i }, n),
                  (t, r) =>
                    (0, s.createRetryablePromise)((s) =>
                      O(e)(t.key, r).catch((e) => {
                        if (404 !== e.status) throw e;
                        return s();
                      }),
                    ),
                );
              },
              m = (e) => (t, r, s) => {
                const n = (0, a.createMappedRequestOptions)(s);
                return (
                  (n.queryParameters["X-Algolia-User-ID"] = t),
                  e.transporter.write({ method: o.N.Post, path: "1/clusters/mapping", data: { cluster: r } }, n)
                );
              },
              h = (e) => (t, r, s) =>
                e.transporter.write(
                  { method: o.N.Post, path: "1/clusters/mapping/batch", data: { users: t, cluster: r } },
                  s,
                ),
              y = (e) => (t, r, a) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write(
                    {
                      method: o.N.Post,
                      path: (0, s.encode)("1/indexes/%s/operation", t),
                      data: { operation: "copy", destination: r },
                    },
                    a,
                  ),
                  (r, s) => D(e)(t, { methods: { waitTask: Se } }).waitTask(r.taskID, s),
                ),
              g = (e) => (t, r, s) => y(e)(t, r, { ...s, scope: [Ae.Rules] }),
              b = (e) => (t, r, s) => y(e)(t, r, { ...s, scope: [Ae.Settings] }),
              f = (e) => (t, r, s) => y(e)(t, r, { ...s, scope: [Ae.Synonyms] }),
              P = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Delete, path: (0, s.encode)("1/keys/%s", t) }, r),
                  (r, a) =>
                    (0, s.createRetryablePromise)((r) =>
                      O(e)(t, a)
                        .then(r)
                        .catch((e) => {
                          if (404 !== e.status) throw e;
                        }),
                    ),
                ),
              I = () => (e, t) => {
                const r = (0, a.serializeQueryParameters)(t),
                  s = (0, n.createHmac)("sha256", e).update(r).digest("hex");
                return Buffer.from(s + r).toString("base64");
              },
              O = (e) => (t, r) => e.transporter.read({ method: o.N.Get, path: (0, s.encode)("1/keys/%s", t) }, r),
              j = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/logs" }, t),
              v = () => (e) => {
                const t = Buffer.from(e, "base64")
                  .toString("ascii")
                  .match(/validUntil=(\d+)/);
                if (null === t)
                  throw { name: "ValidUntilNotFoundError", message: "ValidUntil not found in given secured api key." };
                return parseInt(t[1], 10) - Math.round(new Date().getTime() / 1e3);
              },
              N = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/clusters/mapping/top" }, t),
              x = (e) => (t, r) =>
                e.transporter.read({ method: o.N.Get, path: (0, s.encode)("1/clusters/mapping/%s", t) }, r),
              S = (e) => (t) => {
                const { retrieveMappings: r, ...s } = t || {};
                return (
                  !0 === r && (s.getClusters = !0),
                  e.transporter.read({ method: o.N.Get, path: "1/clusters/mapping/pending" }, s)
                );
              },
              D = (e) => (t, r = {}) => {
                const a = { transporter: e.transporter, appId: e.appId, indexName: t };
                return (0, s.addMethods)(a, r.methods);
              },
              w = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/keys" }, t),
              A = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/clusters" }, t),
              q = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/indexes" }, t),
              R = (e) => (t) => e.transporter.read({ method: o.N.Get, path: "1/clusters/mapping" }, t),
              T = (e) => (t, r, a) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write(
                    {
                      method: o.N.Post,
                      path: (0, s.encode)("1/indexes/%s/operation", t),
                      data: { operation: "move", destination: r },
                    },
                    a,
                  ),
                  (r, s) => D(e)(t, { methods: { waitTask: Se } }).waitTask(r.taskID, s),
                ),
              k = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Post, path: "1/indexes/*/batch", data: { requests: t } }, r),
                  (t, r) =>
                    Promise.all(
                      Object.keys(t.taskID).map((s) => D(e)(s, { methods: { waitTask: Se } }).waitTask(t.taskID[s], r)),
                    ),
                ),
              U = (e) => (t, r) =>
                e.transporter.read({ method: o.N.Post, path: "1/indexes/*/objects", data: { requests: t } }, r),
              C = (e) => (t, r) => {
                const s = t.map((e) => ({ ...e, params: (0, a.serializeQueryParameters)(e.params || {}) }));
                return e.transporter.read(
                  { method: o.N.Post, path: "1/indexes/*/queries", data: { requests: s }, cacheable: !0 },
                  r,
                );
              },
              E = (e) => (t, r) =>
                Promise.all(
                  t.map((t) => {
                    const { facetName: s, facetQuery: a, ...o } = t.params;
                    return D(e)(t.indexName, { methods: { searchForFacetValues: je } }).searchForFacetValues(s, a, {
                      ...r,
                      ...o,
                    });
                  }),
                ),
              M = (e) => (t, r) => {
                const s = (0, a.createMappedRequestOptions)(r);
                return (
                  (s.queryParameters["X-Algolia-User-ID"] = t),
                  e.transporter.write({ method: o.N.Delete, path: "1/clusters/mapping" }, s)
                );
              },
              W = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Post, path: (0, s.encode)("1/keys/%s/restore", t) }, r),
                  (r, a) =>
                    (0, s.createRetryablePromise)((r) =>
                      O(e)(t, a).catch((e) => {
                        if (404 !== e.status) throw e;
                        return r();
                      }),
                    ),
                ),
              F = (e) => (t, r) =>
                e.transporter.read({ method: o.N.Post, path: "1/clusters/mapping/search", data: { query: t } }, r),
              G = (e) => (t, r) => {
                const a = Object.assign({}, r),
                  { queryParameters: n, ...i } = r || {},
                  c = n ? { queryParameters: n } : {},
                  d = [
                    "acl",
                    "indexes",
                    "referers",
                    "restrictSources",
                    "queryParameters",
                    "description",
                    "maxQueriesPerIPPerHour",
                    "maxHitsPerQuery",
                  ];
                return (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Put, path: (0, s.encode)("1/keys/%s", t), data: c }, i),
                  (r, o) =>
                    (0, s.createRetryablePromise)((r) =>
                      O(e)(t, o).then((e) =>
                        ((e) =>
                          Object.keys(a)
                            .filter((e) => -1 !== d.indexOf(e))
                            .every((t) => e[t] === a[t]))(e)
                          ? Promise.resolve()
                          : r(),
                      ),
                    ),
                );
              },
              H = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write(
                    { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/batch", e.indexName), data: { requests: t } },
                    r,
                  ),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              K = (e) => (t) =>
                i({
                  ...t,
                  shouldStop: (e) => void 0 === e.cursor,
                  request: (r) =>
                    e.transporter.read(
                      { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/browse", e.indexName), data: r },
                      t,
                    ),
                }),
              B = (e) => (t) => {
                const r = { hitsPerPage: 1e3, ...t };
                return i({
                  ...r,
                  shouldStop: (e) => e.hits.length < r.hitsPerPage,
                  request: (t) =>
                    ve(e)("", { ...r, ...t }).then((e) => ({
                      ...e,
                      hits: e.hits.map((e) => (delete e._highlightResult, e)),
                    })),
                });
              },
              z = (e) => (t) => {
                const r = { hitsPerPage: 1e3, ...t };
                return i({
                  ...r,
                  shouldStop: (e) => e.hits.length < r.hitsPerPage,
                  request: (t) =>
                    Ne(e)("", { ...r, ...t }).then((e) => ({
                      ...e,
                      hits: e.hits.map((e) => (delete e._highlightResult, e)),
                    })),
                });
              },
              V = (e) => (t, r, a) => {
                const { batchSize: o, ...n } = a || {},
                  i = { taskIDs: [], objectIDs: [] },
                  c = (s = 0) => {
                    const a = [];
                    let d;
                    for (d = s; d < t.length && (a.push(t[d]), a.length !== (o || 1e3)); d++);
                    return 0 === a.length
                      ? Promise.resolve(i)
                      : H(e)(
                          a.map((e) => ({ action: r, body: e })),
                          n,
                        ).then(
                          (e) => ((i.objectIDs = i.objectIDs.concat(e.objectIDs)), i.taskIDs.push(e.taskID), d++, c(d)),
                        );
                  };
                return (0, s.createWaitablePromise)(c(), (t, r) => Promise.all(t.taskIDs.map((t) => Se(e)(t, r))));
              },
              $ = (e) => (t) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Post, path: (0, s.encode)("1/indexes/%s/clear", e.indexName) }, t),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              L = (e) => (t) => {
                const { forwardToReplicas: r, ...n } = t || {},
                  i = (0, a.createMappedRequestOptions)(n);
                return (
                  r && (i.queryParameters.forwardToReplicas = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/rules/clear", e.indexName) },
                      i,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              Q = (e) => (t) => {
                const { forwardToReplicas: r, ...n } = t || {},
                  i = (0, a.createMappedRequestOptions)(n);
                return (
                  r && (i.queryParameters.forwardToReplicas = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/synonyms/clear", e.indexName) },
                      i,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              J = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write(
                    { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/deleteByQuery", e.indexName), data: t },
                    r,
                  ),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              _ = (e) => (t) =>
                (0, s.createWaitablePromise)(
                  e.transporter.write({ method: o.N.Delete, path: (0, s.encode)("1/indexes/%s", e.indexName) }, t),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              X = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  Y(e)([t], r).then((e) => ({ taskID: e.taskIDs[0] })),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              Y = (e) => (t, r) => {
                const s = t.map((e) => ({ objectID: e }));
                return V(e)(s, we.DeleteObject, r);
              },
              Z = (e) => (t, r) => {
                const { forwardToReplicas: n, ...i } = r || {},
                  c = (0, a.createMappedRequestOptions)(i);
                return (
                  n && (c.queryParameters.forwardToReplicas = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Delete, path: (0, s.encode)("1/indexes/%s/rules/%s", e.indexName, t) },
                      c,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              ee = (e) => (t, r) => {
                const { forwardToReplicas: n, ...i } = r || {},
                  c = (0, a.createMappedRequestOptions)(i);
                return (
                  n && (c.queryParameters.forwardToReplicas = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Delete, path: (0, s.encode)("1/indexes/%s/synonyms/%s", e.indexName, t) },
                      c,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              te = (e) => (t) =>
                ie(e)(t)
                  .then(() => !0)
                  .catch((e) => {
                    if (404 !== e.status) throw e;
                    return !1;
                  }),
              re = (e) => (t, r) => {
                const { query: s, paginate: a, ...o } = r || {};
                let n = 0;
                const i = () =>
                  Oe(e)(s || "", { ...o, page: n }).then((e) => {
                    for (const [r, s] of Object.entries(e.hits))
                      if (t(s)) return { object: s, position: parseInt(r, 10), page: n };
                    if ((n++, !1 === a || n >= e.nbPages))
                      throw { name: "ObjectNotFoundError", message: "Object not found." };
                    return i();
                  });
                return i();
              },
              se = (e) => (t, r) =>
                e.transporter.read({ method: o.N.Get, path: (0, s.encode)("1/indexes/%s/%s", e.indexName, t) }, r),
              ae = () => (e, t) => {
                for (const [r, s] of Object.entries(e.hits)) if (s.objectID === t) return parseInt(r, 10);
                return -1;
              },
              oe = (e) => (t, r) => {
                const { attributesToRetrieve: s, ...a } = r || {},
                  n = t.map((t) => ({
                    indexName: e.indexName,
                    objectID: t,
                    ...(s ? { attributesToRetrieve: s } : {}),
                  }));
                return e.transporter.read({ method: o.N.Post, path: "1/indexes/*/objects", data: { requests: n } }, a);
              },
              ne = (e) => (t, r) =>
                e.transporter.read(
                  { method: o.N.Get, path: (0, s.encode)("1/indexes/%s/rules/%s", e.indexName, t) },
                  r,
                ),
              ie = (e) => (t) =>
                e.transporter.read(
                  {
                    method: o.N.Get,
                    path: (0, s.encode)("1/indexes/%s/settings", e.indexName),
                    data: { getVersion: 2 },
                  },
                  t,
                ),
              ce = (e) => (t, r) =>
                e.transporter.read(
                  { method: o.N.Get, path: (0, s.encode)("1/indexes/%s/synonyms/%s", e.indexName, t) },
                  r,
                ),
              de = (e) => (t, r) =>
                e.transporter.read(
                  { method: o.N.Get, path: (0, s.encode)("1/indexes/%s/task/%s", e.indexName, t.toString()) },
                  r,
                ),
              le = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  ue(e)([t], r).then((e) => ({ objectID: e.objectIDs[0], taskID: e.taskIDs[0] })),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              ue = (e) => (t, r) => {
                const { createIfNotExists: s, ...a } = r || {},
                  o = s ? we.PartialUpdateObject : we.PartialUpdateObjectNoCreate;
                return V(e)(t, o, a);
              },
              pe = (e) => (t, r) => {
                const { safe: a, autoGenerateObjectIDIfNotExist: n, batchSize: i, ...c } = r || {},
                  d = (t, r, a, n) =>
                    (0, s.createWaitablePromise)(
                      e.transporter.write(
                        {
                          method: o.N.Post,
                          path: (0, s.encode)("1/indexes/%s/operation", t),
                          data: { operation: a, destination: r },
                        },
                        n,
                      ),
                      (t, r) => Se(e)(t.taskID, r),
                    ),
                  l = Math.random().toString(36).substring(7),
                  u = `${e.indexName}_tmp_${l}`,
                  p = ge({ appId: e.appId, transporter: e.transporter, indexName: u });
                let m = [];
                const h = d(e.indexName, u, "copy", { ...c, scope: ["settings", "synonyms", "rules"] });
                m.push(h);
                const y = (a ? h.wait(c) : h)
                  .then(() => {
                    const e = p(t, { ...c, autoGenerateObjectIDIfNotExist: n, batchSize: i });
                    return m.push(e), a ? e.wait(c) : e;
                  })
                  .then(() => {
                    const t = d(u, e.indexName, "move", c);
                    return m.push(t), a ? t.wait(c) : t;
                  })
                  .then(() => Promise.all(m))
                  .then(([e, t, r]) => ({ objectIDs: t.objectIDs, taskIDs: [e.taskID, ...t.taskIDs, r.taskID] }));
                return (0, s.createWaitablePromise)(y, (e, t) => Promise.all(m.map((e) => e.wait(t))));
              },
              me = (e) => (t, r) => fe(e)(t, { ...r, clearExistingRules: !0 }),
              he = (e) => (t, r) => Ie(e)(t, { ...r, replaceExistingSynonyms: !0 }),
              ye = (e) => (t, r) =>
                (0, s.createWaitablePromise)(
                  ge(e)([t], r).then((e) => ({ objectID: e.objectIDs[0], taskID: e.taskIDs[0] })),
                  (t, r) => Se(e)(t.taskID, r),
                ),
              ge = (e) => (t, r) => {
                const { autoGenerateObjectIDIfNotExist: a, ...o } = r || {},
                  n = a ? we.AddObject : we.UpdateObject;
                if (n === we.UpdateObject)
                  for (const e of t)
                    if (void 0 === e.objectID)
                      return (0, s.createWaitablePromise)(
                        Promise.reject({
                          name: "MissingObjectIDError",
                          message:
                            "All objects must have an unique objectID (like a primary key) to be valid. Algolia is also able to generate objectIDs automatically but *it's not recommended*. To do it, use the `{'autoGenerateObjectIDIfNotExist': true}` option.",
                        }),
                      );
                return V(e)(t, n, o);
              },
              be = (e) => (t, r) => fe(e)([t], r),
              fe = (e) => (t, r) => {
                const { forwardToReplicas: n, clearExistingRules: i, ...c } = r || {},
                  d = (0, a.createMappedRequestOptions)(c);
                return (
                  n && (d.queryParameters.forwardToReplicas = 1),
                  i && (d.queryParameters.clearExistingRules = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/rules/batch", e.indexName), data: t },
                      d,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              Pe = (e) => (t, r) => Ie(e)([t], r),
              Ie = (e) => (t, r) => {
                const { forwardToReplicas: n, replaceExistingSynonyms: i, ...c } = r || {},
                  d = (0, a.createMappedRequestOptions)(c);
                return (
                  n && (d.queryParameters.forwardToReplicas = 1),
                  i && (d.queryParameters.replaceExistingSynonyms = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Post, path: (0, s.encode)("1/indexes/%s/synonyms/batch", e.indexName), data: t },
                      d,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              Oe = (e) => (t, r) =>
                e.transporter.read(
                  {
                    method: o.N.Post,
                    path: (0, s.encode)("1/indexes/%s/query", e.indexName),
                    data: { query: t },
                    cacheable: !0,
                  },
                  r,
                ),
              je = (e) => (t, r, a) =>
                e.transporter.read(
                  {
                    method: o.N.Post,
                    path: (0, s.encode)("1/indexes/%s/facets/%s/query", e.indexName, t),
                    data: { facetQuery: r },
                    cacheable: !0,
                  },
                  a,
                ),
              ve = (e) => (t, r) =>
                e.transporter.read(
                  {
                    method: o.N.Post,
                    path: (0, s.encode)("1/indexes/%s/rules/search", e.indexName),
                    data: { query: t },
                  },
                  r,
                ),
              Ne = (e) => (t, r) =>
                e.transporter.read(
                  {
                    method: o.N.Post,
                    path: (0, s.encode)("1/indexes/%s/synonyms/search", e.indexName),
                    data: { query: t },
                  },
                  r,
                ),
              xe = (e) => (t, r) => {
                const { forwardToReplicas: n, ...i } = r || {},
                  c = (0, a.createMappedRequestOptions)(i);
                return (
                  n && (c.queryParameters.forwardToReplicas = 1),
                  (0, s.createWaitablePromise)(
                    e.transporter.write(
                      { method: o.N.Put, path: (0, s.encode)("1/indexes/%s/settings", e.indexName), data: t },
                      c,
                    ),
                    (t, r) => Se(e)(t.taskID, r),
                  )
                );
              },
              Se = (e) => (t, r) =>
                (0, s.createRetryablePromise)((s) =>
                  de(e)(t, r).then((e) => ("published" !== e.status ? s() : void 0)),
                ),
              De = {
                AddObject: "addObject",
                Analytics: "analytics",
                Browser: "browse",
                DeleteIndex: "deleteIndex",
                DeleteObject: "deleteObject",
                EditSettings: "editSettings",
                ListIndexes: "listIndexes",
                Logs: "logs",
                Recommendation: "recommendation",
                Search: "search",
                SeeUnretrievableAttributes: "seeUnretrievableAttributes",
                Settings: "settings",
                Usage: "usage",
              },
              we = {
                AddObject: "addObject",
                UpdateObject: "updateObject",
                PartialUpdateObject: "partialUpdateObject",
                PartialUpdateObjectNoCreate: "partialUpdateObjectNoCreate",
                DeleteObject: "deleteObject",
              },
              Ae = { Settings: "settings", Synonyms: "synonyms", Rules: "rules" },
              qe = { None: "none", StopIfEnoughMatches: "stopIfEnoughMatches" },
              Re = {
                Synonym: "synonym",
                OneWaySynonym: "oneWaySynonym",
                AltCorrection1: "altCorrection1",
                AltCorrection2: "altCorrection2",
                Placeholder: "placeholder",
              };
          },
          45: (e, t, r) => {
            "use strict";
            function s() {
              return {
                debug: (e, t) => Promise.resolve(),
                info: (e, t) => Promise.resolve(),
                error: (e, t) => Promise.resolve(),
              };
            }
            r.r(t), r.d(t, { LogLevelEnum: () => a, createNullLogger: () => s });
            const a = { Debug: 1, Info: 2, Error: 3 };
          },
          541: (e, t, r) => {
            "use strict";
            r.d(t, { N: () => s });
            const s = { Delete: "DELETE", Get: "GET", Post: "POST", Put: "PUT" };
          },
          178: (e, t, r) => {
            "use strict";
            r.r(t), r.d(t, { createNodeHttpRequester: () => n });
            var s = r(605),
              a = r(211),
              o = r(835);
            function n() {
              const e = { keepAlive: !0 },
                t = new s.Agent(e),
                r = new a.Agent(e);
              return {
                send: (e) =>
                  new Promise((n) => {
                    const i = (0, o.parse)(e.url),
                      c = null === i.query ? i.pathname : `${i.pathname}?${i.query}`,
                      d = {
                        agent: "https:" === i.protocol ? r : t,
                        hostname: i.hostname,
                        path: c,
                        method: e.method,
                        headers: e.headers,
                        ...(void 0 !== i.port ? { port: i.port || "" } : {}),
                      },
                      l = ("https:" === i.protocol ? a : s).request(d, (e) => {
                        let t = "";
                        e.on("data", (e) => (t += e)),
                          e.on("end", () => {
                            clearTimeout(p),
                              clearTimeout(m),
                              n({ status: e.statusCode || 0, content: t, isTimedOut: !1 });
                          });
                      }),
                      u = (e, t) =>
                        setTimeout(() => {
                          l.abort(), n({ status: 0, content: t, isTimedOut: !0 });
                        }, 1e3 * e),
                      p = u(e.connectTimeout, "Connection timeout");
                    let m;
                    l.on("error", (e) => {
                      clearTimeout(p), clearTimeout(m), n({ status: 0, content: e.message, isTimedOut: !1 });
                    }),
                      l.once("response", () => {
                        clearTimeout(p), (m = u(e.responseTimeout, "Socket timeout"));
                      }),
                      void 0 !== e.data && l.write(e.data),
                      l.end();
                  }),
                destroy: () => (t.destroy(), r.destroy(), Promise.resolve()),
              };
            }
          },
          858: (e, t, r) => {
            "use strict";
            r.r(t),
              r.d(t, {
                CallEnum: () => o,
                HostStatusEnum: () => n,
                createApiError: () => j,
                createDeserializationError: () => v,
                createMappedRequestOptions: () => a,
                createRetryError: () => N,
                createStatefulHost: () => i,
                createStatelessHost: () => l,
                createTransporter: () => p,
                createUserAgent: () => m,
                deserializeFailure: () => y,
                deserializeSuccess: () => h,
                isStatefulHostTimeouted: () => d,
                isStatefulHostUp: () => c,
                serializeData: () => f,
                serializeHeaders: () => P,
                serializeQueryParameters: () => b,
                serializeUrl: () => g,
                stackFrameWithoutCredentials: () => O,
                stackTraceWithoutCredentials: () => I,
              });
            var s = r(541);
            function a(e, t) {
              const r = e || {},
                s = r.data || {};
              return (
                Object.keys(r).forEach((e) => {
                  -1 === ["timeout", "headers", "queryParameters", "data", "cacheable"].indexOf(e) && (s[e] = r[e]);
                }),
                {
                  data: Object.entries(s).length > 0 ? s : void 0,
                  timeout: r.timeout || t,
                  headers: r.headers || {},
                  queryParameters: r.queryParameters || {},
                  cacheable: r.cacheable,
                }
              );
            }
            const o = { Read: 1, Write: 2, Any: 3 },
              n = { Up: 1, Down: 2, Timeouted: 3 };
            function i(e, t = n.Up) {
              return { ...e, status: t, lastUpdate: Date.now() };
            }
            function c(e) {
              return e.status === n.Up || Date.now() - e.lastUpdate > 12e4;
            }
            function d(e) {
              return e.status === n.Timeouted && Date.now() - e.lastUpdate <= 12e4;
            }
            function l(e) {
              return { protocol: e.protocol || "https", url: e.url, accept: e.accept || o.Any };
            }
            function u(e, t, r, a) {
              const o = [],
                u = f(r, a),
                p = P(e, a),
                m = r.method,
                b = r.method !== s.N.Get ? {} : { ...r.data, ...a.data },
                j = { "x-algolia-agent": e.userAgent.value, ...e.queryParameters, ...b, ...a.queryParameters };
              let v = 0;
              const x = (t, s) => {
                const c = t.pop();
                if (void 0 === c) throw N(I(o));
                const d = {
                    data: u,
                    headers: p,
                    method: m,
                    url: g(c, r.path, j),
                    connectTimeout: s(v, e.timeouts.connect),
                    responseTimeout: s(v, a.timeout),
                  },
                  l = (e) => {
                    const r = { request: d, response: e, host: c, triesLeft: t.length };
                    return o.push(r), r;
                  },
                  b = {
                    onSucess: (e) => h(e),
                    onRetry(r) {
                      const a = l(r);
                      return (
                        r.isTimedOut && v++,
                        Promise.all([
                          e.logger.info("Retryable failure", O(a)),
                          e.hostsCache.set(c, i(c, r.isTimedOut ? n.Timeouted : n.Down)),
                        ]).then(() => x(t, s))
                      );
                    },
                    onFail(e) {
                      throw (l(e), y(e, I(o)));
                    },
                  };
                return e.requester.send(d).then((e) =>
                  ((e, t) =>
                    ((e) => {
                      const t = e.status;
                      return (
                        e.isTimedOut ||
                        (({ isTimedOut: e, status: t }) => !e && 0 == ~~t)(e) ||
                        (2 != ~~(t / 100) && 4 != ~~(t / 100))
                      );
                    })(e)
                      ? t.onRetry(e)
                      : (({ status: e }) => 2 == ~~(e / 100))(e)
                      ? t.onSucess(e)
                      : t.onFail(e))(e, b),
                );
              };
              return (function (e, t) {
                return Promise.all(t.map((t) => e.get(t, () => Promise.resolve(i(t))))).then((e) => {
                  const r = e.filter((e) => c(e)),
                    s = e.filter((e) => d(e)),
                    a = [...r, ...s];
                  return {
                    getTimeout: (e, t) => (0 === s.length && 0 === e ? 1 : s.length + 3 + e) * t,
                    statelessHosts: a.length > 0 ? a.map((e) => l(e)) : t,
                  };
                });
              })(e.hostsCache, t).then((e) => x([...e.statelessHosts].reverse(), e.getTimeout));
            }
            function p(e) {
              const {
                  hostsCache: t,
                  logger: r,
                  requester: s,
                  requestsCache: n,
                  responsesCache: i,
                  timeouts: c,
                  userAgent: d,
                  hosts: p,
                  queryParameters: m,
                  headers: h,
                } = e,
                y = {
                  hostsCache: t,
                  logger: r,
                  requester: s,
                  requestsCache: n,
                  responsesCache: i,
                  timeouts: c,
                  userAgent: d,
                  headers: h,
                  queryParameters: m,
                  hosts: p.map((e) => l(e)),
                  read(e, t) {
                    const r = a(t, y.timeouts.read),
                      s = () =>
                        u(
                          y,
                          y.hosts.filter((e) => 0 != (e.accept & o.Read)),
                          e,
                          r,
                        );
                    if (!0 !== (void 0 !== r.cacheable ? r.cacheable : e.cacheable)) return s();
                    const n = {
                      request: e,
                      mappedRequestOptions: r,
                      transporter: { queryParameters: y.queryParameters, headers: y.headers },
                    };
                    return y.responsesCache.get(
                      n,
                      () =>
                        y.requestsCache.get(n, () =>
                          y.requestsCache
                            .set(n, s())
                            .then(
                              (e) => Promise.all([y.requestsCache.delete(n), e]),
                              (e) => Promise.all([y.requestsCache.delete(n), Promise.reject(e)]),
                            )
                            .then(([e, t]) => t),
                        ),
                      { miss: (e) => y.responsesCache.set(n, e) },
                    );
                  },
                  write: (e, t) =>
                    u(
                      y,
                      y.hosts.filter((e) => 0 != (e.accept & o.Write)),
                      e,
                      a(t, y.timeouts.write),
                    ),
                };
              return y;
            }
            function m(e) {
              const t = {
                value: `Algolia for JavaScript (${e})`,
                add(e) {
                  const r = `; ${e.segment}${void 0 !== e.version ? ` (${e.version})` : ""}`;
                  return -1 === t.value.indexOf(r) && (t.value = `${t.value}${r}`), t;
                },
              };
              return t;
            }
            function h(e) {
              try {
                return JSON.parse(e.content);
              } catch (t) {
                throw v(t.message, e);
              }
            }
            function y({ content: e, status: t }, r) {
              let s = e;
              try {
                s = JSON.parse(e).message;
              } catch (e) {}
              return j(s, t, r);
            }
            function g(e, t, r) {
              const s = b(r);
              let a = `${e.protocol}://${e.url}/${"/" === t.charAt(0) ? t.substr(1) : t}`;
              return s.length && (a += "?" + s), a;
            }
            function b(e) {
              return Object.keys(e)
                .map((t) => {
                  return (function (e, ...t) {
                    let r = 0;
                    return e.replace(/%s/g, () => encodeURIComponent(t[r++]));
                  })(
                    "%s=%s",
                    t,
                    ((r = e[t]),
                    "[object Object]" === Object.prototype.toString.call(r) ||
                    "[object Array]" === Object.prototype.toString.call(r)
                      ? JSON.stringify(e[t])
                      : e[t]),
                  );
                  var r;
                })
                .join("&");
            }
            function f(e, t) {
              if (e.method === s.N.Get || (void 0 === e.data && void 0 === t.data)) return;
              const r = Array.isArray(e.data) ? e.data : { ...e.data, ...t.data };
              return JSON.stringify(r);
            }
            function P(e, t) {
              const r = { ...e.headers, ...t.headers },
                s = {};
              return (
                Object.keys(r).forEach((e) => {
                  const t = r[e];
                  s[e.toLowerCase()] = t;
                }),
                s
              );
            }
            function I(e) {
              return e.map((e) => O(e));
            }
            function O(e) {
              const t = e.request.headers["x-algolia-api-key"] ? { "x-algolia-api-key": "*****" } : {};
              return { ...e, request: { ...e.request, headers: { ...e.request.headers, ...t } } };
            }
            function j(e, t, r) {
              return { name: "ApiError", message: e, status: t, transporterStackTrace: r };
            }
            function v(e, t) {
              return { name: "DeserializationError", message: e, response: t };
            }
            function N(e) {
              return {
                name: "RetryError",
                message:
                  "Unreachable hosts - your application id may be incorrect. If the error persists, contact support@algolia.com.",
                transporterStackTrace: e,
              };
            }
          },
          774: (e, t, r) => {
            "use strict";
            var s = r(469),
              a = r(712),
              o = r(223),
              n = r(757),
              i = r(103),
              c = r(586),
              d = r(45),
              l = r(178),
              u = r(858);
            function p(e, t, r) {
              const p = {
                appId: e,
                apiKey: t,
                timeouts: { connect: 2, read: 5, write: 30 },
                requester: l.createNodeHttpRequester(),
                logger: d.createNullLogger(),
                responsesCache: s.createNullCache(),
                requestsCache: s.createNullCache(),
                hostsCache: a.createInMemoryCache(),
                userAgent: u.createUserAgent(n.version).add({ segment: "Node.js", version: process.versions.node }),
              };
              return c.createSearchClient({
                ...p,
                ...r,
                methods: {
                  search: c.multipleQueries,
                  searchForFacetValues: c.multipleSearchForFacetValues,
                  multipleBatch: c.multipleBatch,
                  multipleGetObjects: c.multipleGetObjects,
                  multipleQueries: c.multipleQueries,
                  copyIndex: c.copyIndex,
                  copySettings: c.copySettings,
                  copyRules: c.copyRules,
                  copySynonyms: c.copySynonyms,
                  moveIndex: c.moveIndex,
                  listIndices: c.listIndices,
                  getLogs: c.getLogs,
                  listClusters: c.listClusters,
                  multipleSearchForFacetValues: c.multipleSearchForFacetValues,
                  getApiKey: c.getApiKey,
                  addApiKey: c.addApiKey,
                  listApiKeys: c.listApiKeys,
                  updateApiKey: c.updateApiKey,
                  deleteApiKey: c.deleteApiKey,
                  restoreApiKey: c.restoreApiKey,
                  assignUserID: c.assignUserID,
                  assignUserIDs: c.assignUserIDs,
                  getUserID: c.getUserID,
                  searchUserIDs: c.searchUserIDs,
                  listUserIDs: c.listUserIDs,
                  getTopUserIDs: c.getTopUserIDs,
                  removeUserID: c.removeUserID,
                  hasPendingMappings: c.hasPendingMappings,
                  generateSecuredApiKey: c.generateSecuredApiKey,
                  getSecuredApiKeyRemainingValidity: c.getSecuredApiKeyRemainingValidity,
                  destroy: n.destroy,
                  initIndex: (e) => (t) =>
                    c.initIndex(e)(t, {
                      methods: {
                        batch: c.batch,
                        delete: c.deleteIndex,
                        getObject: c.getObject,
                        getObjects: c.getObjects,
                        saveObject: c.saveObject,
                        saveObjects: c.saveObjects,
                        search: c.search,
                        searchForFacetValues: c.searchForFacetValues,
                        waitTask: c.waitTask,
                        setSettings: c.setSettings,
                        getSettings: c.getSettings,
                        partialUpdateObject: c.partialUpdateObject,
                        partialUpdateObjects: c.partialUpdateObjects,
                        deleteObject: c.deleteObject,
                        deleteObjects: c.deleteObjects,
                        deleteBy: c.deleteBy,
                        clearObjects: c.clearObjects,
                        browseObjects: c.browseObjects,
                        getObjectPosition: c.getObjectPosition,
                        findObject: c.findObject,
                        exists: c.exists,
                        saveSynonym: c.saveSynonym,
                        saveSynonyms: c.saveSynonyms,
                        getSynonym: c.getSynonym,
                        searchSynonyms: c.searchSynonyms,
                        browseSynonyms: c.browseSynonyms,
                        deleteSynonym: c.deleteSynonym,
                        clearSynonyms: c.clearSynonyms,
                        replaceAllObjects: c.replaceAllObjects,
                        replaceAllSynonyms: c.replaceAllSynonyms,
                        searchRules: c.searchRules,
                        getRule: c.getRule,
                        deleteRule: c.deleteRule,
                        saveRule: c.saveRule,
                        saveRules: c.saveRules,
                        replaceAllRules: c.replaceAllRules,
                        browseRules: c.browseRules,
                        clearRules: c.clearRules,
                      },
                    }),
                  initAnalytics: () => (e) =>
                    o.createAnalyticsClient({
                      ...p,
                      ...e,
                      methods: {
                        addABTest: o.addABTest,
                        getABTest: o.getABTest,
                        getABTests: o.getABTests,
                        stopABTest: o.stopABTest,
                        deleteABTest: o.deleteABTest,
                      },
                    }),
                  initRecommendation: () => (e) =>
                    i.createRecommendationClient({
                      ...p,
                      ...e,
                      methods: {
                        getPersonalizationStrategy: i.getPersonalizationStrategy,
                        setPersonalizationStrategy: i.setPersonalizationStrategy,
                      },
                    }),
                },
              });
            }
            (p.version = n.version), (e.exports = p);
          },
          410: (e, t, r) => {
            const s = r(774);
            (e.exports = s), (e.exports.default = s);
          },
          966: (e) => {
            "use strict";
            e.exports = require("@yarnpkg/core");
          },
          850: (e) => {
            "use strict";
            e.exports = require("@yarnpkg/plugin-essentials");
          },
          417: (e) => {
            "use strict";
            e.exports = require("crypto");
          },
          605: (e) => {
            "use strict";
            e.exports = require("http");
          },
          211: (e) => {
            "use strict";
            e.exports = require("https");
          },
          513: (e) => {
            "use strict";
            e.exports = require("semver");
          },
          835: (e) => {
            "use strict";
            e.exports = require("url");
          },
        },
        t = {};
      function r(s) {
        if (t[s]) return t[s].exports;
        var a = (t[s] = { exports: {} });
        return e[s](a, a.exports, r), a.exports;
      }
      return (
        (r.n = (e) => {
          var t = e && e.__esModule ? () => e.default : () => e;
          return r.d(t, { a: t }), t;
        }),
        (r.d = (e, t) => {
          for (var s in t) r.o(t, s) && !r.o(e, s) && Object.defineProperty(e, s, { enumerable: !0, get: t[s] });
        }),
        (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (r.r = (e) => {
          "undefined" != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
            Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        r(948)
      );
    })();
    return plugin;
  },
};
