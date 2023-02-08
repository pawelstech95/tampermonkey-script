# tampermonkey-script

## Creating the build JS file

Run the command `yarn install`

Run the command `yarn build`


````
Notes:

If the script stops working, it is possible that Tampermonkey no longer supports // @include
You can not download all developers at once - there is a limit of 75 dev
-> this.pageSize = 75 - each query should contain 70 developers with the exception of the last one
-> The sum of developers should be equal to the count parameter in the requescie (https://beta.primetric.com/api/myHub/developers/?page=8&page_size=1&workload_min=1990-01-01&workload_max=2050-01-31)
The request for developers runs twice because the first time I download the "count".

````


## Installation Tampermonkey
Install the Tampermonkey extension for your browser from here: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en


Once Tampermonkey is installed, open the extension and click on the "Add a new script" button.

In the new script tab, paste the script below and save it.

````js
(() => {
  'use strict';
  var e = {
      119: (e, t, u) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.updateDataTableRows = void 0);
        const n = u(970),
          r = u(593),
          i = u(314),
          s = u(534);
        t.updateDataTableRows = async function e(t, u) {
          const a = await s.PrimetricApiService.getInstance().getDevelopers(t);
          u.querySelectorAll('tbody tr').forEach((l) => {
            const o = (0, r.getUserUuid)(l),
              D = (function (e, t) {
                var u, n;
                return null !==
                (n =
                  null === (u = t.find((t) => t.uuid === e)) || void 0 === u
                    ? void 0
                    : u.note) && void 0 !== n
                  ? n
                  : 'Developer not found, for some reason, they are not exist in the developer array';
              })(o, a);
            (0, i.createOrUpdateTableColumn)(
              l,
              'notes',
              o,
              n.marked.parse(D),
              D
            ),
              (function (t, u, r, a, l) {
                const o = document.createElement('button');
                (o.innerHTML =
                  '<i class="pri-icon" style="font-size: 16px;"><svg data-v-273726f4="" height="1em" stroke="currentColor" viewBox="0 0 14 14" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9.31276 2.96313L11.0372 4.68755L4.9201 10.8046L3.19568 9.08021L9.31276 2.96313Z"></path><path d="M3.19541 9.08008L2.33334 11.6667L4.91997 10.8046L3.19541 9.08008Z"></path><path d="M11.037 4.68717L9.31287 2.96302L9.60023 2.67566C9.8302 2.45355 10.1382 2.33064 10.4579 2.33342C10.7776 2.3362 11.0835 2.46444 11.3095 2.69051C11.5356 2.91659 11.6638 3.22242 11.6666 3.54212C11.6694 3.86183 11.5465 4.16984 11.3244 4.39981L11.037 4.68717Z"></path></svg></i>'),
                  (o.type = 'button'),
                  (o.className =
                    'p-button p-component p-button-icon-only p-button-primary p-button-text pri-button pri-button--lg'),
                  o.addEventListener('click', () => {
                    !(function (t, u, r, a, l) {
                      const o = document.createElement('textarea');
                      (o.value = l),
                        (0, i.createOrUpdateTableColumn)(r, 'notes', a, o),
                        o.focus(),
                        o.addEventListener('blur', async (o) => {
                          (0, i.createOrUpdateTableColumn)(
                            r,
                            'notes',
                            a,
                            n.marked.parse(o.target.value),
                            o.target.value
                          ),
                          l !== o.target.value &&
                          (await s.PrimetricApiService.getInstance().updateDeveloperNotes(
                            t,
                            a,
                            o.target.value
                          ),
                            await e(t, u));
                        });
                    })(t, u, r, a, l);
                  }),
                  (0, i.createOrUpdateTableColumn)(r, 'edit', a, o);
              })(t, u, l, o, D);
          });
        };
      },
      839: (e, t, u) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.cleanup = t.createDataTableObserver = void 0);
        const n = u(593);
        let r = [];
        (t.createDataTableObserver = async (e, t) => {
          const u = await new MutationObserver(() => {
            const u = (0, n.getUserIdsFromTable)(e);
            JSON.stringify(u) !== JSON.stringify(r) && ((r = u), t());
          });
          r.length || (await t()),
            await u.observe(e, { childList: !0, subtree: !0, attributes: !0 });
        }),
          (t.cleanup = function () {
            r = [];
          });
      },
      826: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.watchIfTableIsMounted = void 0);
        const u = '.reports-availability-table';
        t.watchIfTableIsMounted = function (e) {
          let t,
            n = !1;
          function r() {
            n || ((t = e(document.querySelector(u))), (n = !0));
          }
          function i() {
            n && (null == t || t(), (n = !1));
          }
          document.querySelector(u) ? r() : i(),
            new MutationObserver(() => {
              document.querySelector(u) ? r() : i();
            }).observe(document.body, { childList: !0, subtree: !0 });
        };
      },
      534: (e, t, u) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.PrimetricApiService = void 0);
        const n = u(593);
        class r {
          static getInstance() {
            return this.instance || (this.instance = new r()), this.instance;
          }
          async getDevelopers(e, t) {
            if (
              ((this.page = 1),
                (this.pageSize = 75),
              !this.developers || !e || t)
            ) {
              const t = await fetch(
                `https://${e}/api/myHub/developers/?page=1&page_size=${this.pageSize}&workload_min=1990-01-01&workload_max=2050-01-31`
              );
              this.count = (await t.json()).count;
              const u = Math.ceil(this.count / this.pageSize),
                n = Array.from({ length: u }, (t, u) =>
                  fetch(
                    `https://${e}/api/myHub/developers/?page=${
                      u + 1
                    }&page_size=${
                      this.pageSize
                    }&workload_min=1990-01-01&workload_max=2050-01-31`
                  ).then((e) => e.json())
                ),
                r = await Promise.all(n);
              this.developers = r.flatMap((e) => e.results);
            }
            return this.developers;
          }
          async updateDeveloperNotes(e, t, u) {
            await fetch(`https://${e}/api/employees_profiles/${t}/`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'x-csrftoken': (0, n.getCookie)('csrftoken'),
              },
              body: JSON.stringify({ note: u }),
            }),
              await this.getDevelopers(e, !0);
          }
        }
        t.PrimetricApiService = r;
      },
      314: (e, t) => {
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.loadStylesheet =
            t.removeTableColumn =
              t.createOrUpdateTableColumn =
                t.removeTableHeader =
                  t.createTableHeader =
                    void 0),
          (t.createTableHeader = function (e, t) {
            if (!e.querySelector(`thead th[data-header-name=${t}]`)) {
              const u = document.createElement('th');
              (u.textContent = t),
                (u.dataset.headerName = t),
                e.querySelector('thead tr').appendChild(u);
            }
          }),
          (t.removeTableHeader = function (e, t) {
            if (e.querySelector(`thead th [title="${t}"]`)) {
              const u = e.querySelector(`thead th [title="${t}"]`).parentNode
                .parentNode;
              u.parentNode.removeChild(u);
            }
          }),
          (t.createOrUpdateTableColumn = function (e, t, u, n, r) {
            let i = e.querySelector(`td[data-column-name=${t}]`);
            i ||
            ((i = document.createElement('td')),
              (i.dataset.columnName = t),
              e.appendChild(i)),
              (i.dataset.userUuid = u),
              'string' == typeof n ? (i.innerHTML = n) : i.replaceChildren(n),
              r ? i.setAttribute('title', r) : i.removeAttribute('title');
          }),
          (t.removeTableColumn = function (e, t) {
            let u = e.querySelectorAll('td.pri-table-cell')[t];
            u && u.remove();
          }),
          (t.loadStylesheet = () => {
            const e = document.createElement('style');
            (e.textContent =
              '\n  .pri-table__inner{\n    width: 100% !important;\n  }\n  \n  .reports-availability-table .pri-table-header tr th:nth-child(3), .reports-availability-table tr td.pri-table-cell:nth-child(3){\n    display: none;\n  }  \n  \n  .reports-availability-table td {\n    overflow: hidden;\n    position: relative;\n  }\n  \n  [data-header-name="Notes"] {\n  width: 45%;\n  line-height: 1;\n  white-space: break-spaces;\n  }\n  \n  [data-header-name="Edit"] {\n  width: 5%;\n  }\n  \n  .reports-availability-table td textarea {\n  background: transparent; \n  color: inherit; \n  width: 100%;\n  height: 200px;\n  padding: 10px 10px;\n  box-sizing: border-box;\n  resize: none;\n  }\n  \n  .reports-availability-table td textarea::-webkit-scrollbar {\n    width: 1px;\n    background-color: red;\n}\n  '),
              document.head.appendChild(e);
          });
      },
      593: (e, t) => {
        function u(e) {
          var t, u;
          return null ===
          (u =
            null === (t = e.querySelector('td:first-child a')) || void 0 === t
              ? void 0
              : t.getAttribute('href')) || void 0 === u
            ? void 0
            : u.split('/')[2];
        }
        Object.defineProperty(t, '__esModule', { value: !0 }),
          (t.getCookie = t.getUserUuid = t.getUserIdsFromTable = void 0),
          (t.getUserIdsFromTable = function (e) {
            const t = [];
            return (
              e.querySelectorAll('tbody tr').forEach((e) => {
                const n = u(e);
                n && t.push(n);
              }),
                t
            );
          }),
          (t.getUserUuid = u),
          (t.getCookie = function (e) {
            const t = `; ${document.cookie}`.split(`; ${e}=`);
            if (2 === t.length) return t.pop().split(';').shift();
          });
      },
      970: (e, t) => {
        function u(e, t) {
          for (var u = 0; u < t.length; u++) {
            var n = t[u];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
            'value' in n && (n.writable = !0),
              Object.defineProperty(
                e,
                (void 0,
                  'symbol' ==
                  typeof (r = (function (e, t) {
                    if ('object' != typeof e || null === e) return e;
                    var u = e[Symbol.toPrimitive];
                    if (void 0 !== u) {
                      var n = u.call(e, 'string');
                      if ('object' != typeof n) return n;
                      throw new TypeError(
                        '@@toPrimitive must return a primitive value.'
                      );
                    }
                    return String(e);
                  })(n.key))
                    ? r
                    : String(r)),
                n
              );
          }
          var r;
        }
        function n(e, t) {
          (null == t || t > e.length) && (t = e.length);
          for (var u = 0, n = new Array(t); u < t; u++) n[u] = e[u];
          return n;
        }
        function r(e, t) {
          var u =
            ('undefined' != typeof Symbol && e[Symbol.iterator]) ||
            e['@@iterator'];
          if (u) return (u = u.call(e)).next.bind(u);
          if (
            Array.isArray(e) ||
            (u = (function (e, t) {
              if (e) {
                if ('string' == typeof e) return n(e, t);
                var u = Object.prototype.toString.call(e).slice(8, -1);
                return (
                  'Object' === u && e.constructor && (u = e.constructor.name),
                    'Map' === u || 'Set' === u
                      ? Array.from(e)
                      : 'Arguments' === u ||
                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(u)
                        ? n(e, t)
                        : void 0
                );
              }
            })(e)) ||
            (t && e && 'number' == typeof e.length)
          ) {
            u && (e = u);
            var r = 0;
            return function () {
              return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
            };
          }
          throw new TypeError(
            'Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
          );
        }
        function i() {
          return {
            async: !1,
            baseUrl: null,
            breaks: !1,
            extensions: null,
            gfm: !0,
            headerIds: !0,
            headerPrefix: '',
            highlight: null,
            langPrefix: 'language-',
            mangle: !0,
            pedantic: !1,
            renderer: null,
            sanitize: !1,
            sanitizer: null,
            silent: !1,
            smartypants: !1,
            tokenizer: null,
            walkTokens: null,
            xhtml: !1,
          };
        }
        t.defaults = {
          async: !1,
          baseUrl: null,
          breaks: !1,
          extensions: null,
          gfm: !0,
          headerIds: !0,
          headerPrefix: '',
          highlight: null,
          langPrefix: 'language-',
          mangle: !0,
          pedantic: !1,
          renderer: null,
          sanitize: !1,
          sanitizer: null,
          silent: !1,
          smartypants: !1,
          tokenizer: null,
          walkTokens: null,
          xhtml: !1,
        };
        var s = /[&<>"']/,
          a = new RegExp(s.source, 'g'),
          l = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
          o = new RegExp(l.source, 'g'),
          D = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          },
          c = function (e) {
            return D[e];
          };
        function h(e, t) {
          if (t) {
            if (s.test(e)) return e.replace(a, c);
          } else if (l.test(e)) return e.replace(o, c);
          return e;
        }
        var p = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;
        function f(e) {
          return e.replace(p, function (e, t) {
            return 'colon' === (t = t.toLowerCase())
              ? ':'
              : '#' === t.charAt(0)
                ? 'x' === t.charAt(1)
                  ? String.fromCharCode(parseInt(t.substring(2), 16))
                  : String.fromCharCode(+t.substring(1))
                : '';
          });
        }
        var g = /(^|[^\[])\^/g;
        function d(e, t) {
          (e = 'string' == typeof e ? e : e.source), (t = t || '');
          var u = {
            replace: function (t, n) {
              return (
                (n = (n = n.source || n).replace(g, '$1')),
                  (e = e.replace(t, n)),
                  u
              );
            },
            getRegex: function () {
              return new RegExp(e, t);
            },
          };
          return u;
        }
        var F = /[^\w:]/g,
          A = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
        function C(e, t, u) {
          if (e) {
            var n;
            try {
              n = decodeURIComponent(f(u)).replace(F, '').toLowerCase();
            } catch (e) {
              return null;
            }
            if (
              0 === n.indexOf('javascript:') ||
              0 === n.indexOf('vbscript:') ||
              0 === n.indexOf('data:')
            )
              return null;
          }
          t &&
          !A.test(u) &&
          (u = (function (e, t) {
            k[' ' + e] ||
            (E.test(e)
              ? (k[' ' + e] = e + '/')
              : (k[' ' + e] = B(e, '/', !0)));
            var u = -1 === (e = k[' ' + e]).indexOf(':');
            return '//' === t.substring(0, 2)
              ? u
                ? t
                : e.replace(m, '$1') + t
              : '/' === t.charAt(0)
                ? u
                  ? t
                  : e.replace(x, '$1') + t
                : e + t;
          })(t, u));
          try {
            u = encodeURI(u).replace(/%25/g, '%');
          } catch (e) {
            return null;
          }
          return u;
        }
        var k = {},
          E = /^[^:]+:\/*[^/]*$/,
          m = /^([^:]+:)[\s\S]*$/,
          x = /^([^:]+:\/*[^/]*)[\s\S]*$/,
          b = { exec: function () {} };
        function v(e) {
          for (var t, u, n = 1; n < arguments.length; n++)
            for (u in (t = arguments[n]))
              Object.prototype.hasOwnProperty.call(t, u) && (e[u] = t[u]);
          return e;
        }
        function w(e, t) {
          var u = e
              .replace(/\|/g, function (e, t, u) {
                for (var n = !1, r = t; --r >= 0 && '\\' === u[r]; ) n = !n;
                return n ? '|' : ' |';
              })
              .split(/ \|/),
            n = 0;
          if (
            (u[0].trim() || u.shift(),
            u.length > 0 && !u[u.length - 1].trim() && u.pop(),
            u.length > t)
          )
            u.splice(t);
          else for (; u.length < t; ) u.push('');
          for (; n < u.length; n++) u[n] = u[n].trim().replace(/\\\|/g, '|');
          return u;
        }
        function B(e, t, u) {
          var n = e.length;
          if (0 === n) return '';
          for (var r = 0; r < n; ) {
            var i = e.charAt(n - r - 1);
            if (i !== t || u) {
              if (i === t || !u) break;
              r++;
            } else r++;
          }
          return e.slice(0, n - r);
        }
        function y(e) {
          e &&
          e.sanitize &&
          !e.silent &&
          console.warn(
            'marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options'
          );
        }
        function _(e, t) {
          if (t < 1) return '';
          for (var u = ''; t > 1; ) 1 & t && (u += e), (t >>= 1), (e += e);
          return u + e;
        }
        function z(e, t, u, n) {
          var r = t.href,
            i = t.title ? h(t.title) : null,
            s = e[1].replace(/\\([\[\]])/g, '$1');
          if ('!' !== e[0].charAt(0)) {
            n.state.inLink = !0;
            var a = {
              type: 'link',
              raw: u,
              href: r,
              title: i,
              text: s,
              tokens: n.inlineTokens(s),
            };
            return (n.state.inLink = !1), a;
          }
          return { type: 'image', raw: u, href: r, title: i, text: h(s) };
        }
        var S = (function () {
            function e(e) {
              this.options = e || t.defaults;
            }
            var u = e.prototype;
            return (
              (u.space = function (e) {
                var t = this.rules.block.newline.exec(e);
                if (t && t[0].length > 0) return { type: 'space', raw: t[0] };
              }),
                (u.code = function (e) {
                  var t = this.rules.block.code.exec(e);
                  if (t) {
                    var u = t[0].replace(/^ {1,4}/gm, '');
                    return {
                      type: 'code',
                      raw: t[0],
                      codeBlockStyle: 'indented',
                      text: this.options.pedantic ? u : B(u, '\n'),
                    };
                  }
                }),
                (u.fences = function (e) {
                  var t = this.rules.block.fences.exec(e);
                  if (t) {
                    var u = t[0],
                      n = (function (e, t) {
                        var u = e.match(/^(\s+)(?:```)/);
                        if (null === u) return t;
                        var n = u[1];
                        return t
                          .split('\n')
                          .map(function (e) {
                            var t = e.match(/^\s+/);
                            return null === t
                              ? e
                              : t[0].length >= n.length
                                ? e.slice(n.length)
                                : e;
                          })
                          .join('\n');
                      })(u, t[3] || '');
                    return {
                      type: 'code',
                      raw: u,
                      lang: t[2]
                        ? t[2].trim().replace(this.rules.inline._escapes, '$1')
                        : t[2],
                      text: n,
                    };
                  }
                }),
                (u.heading = function (e) {
                  var t = this.rules.block.heading.exec(e);
                  if (t) {
                    var u = t[2].trim();
                    if (/#$/.test(u)) {
                      var n = B(u, '#');
                      this.options.pedantic
                        ? (u = n.trim())
                        : (n && !/ $/.test(n)) || (u = n.trim());
                    }
                    return {
                      type: 'heading',
                      raw: t[0],
                      depth: t[1].length,
                      text: u,
                      tokens: this.lexer.inline(u),
                    };
                  }
                }),
                (u.hr = function (e) {
                  var t = this.rules.block.hr.exec(e);
                  if (t) return { type: 'hr', raw: t[0] };
                }),
                (u.blockquote = function (e) {
                  var t = this.rules.block.blockquote.exec(e);
                  if (t) {
                    var u = t[0].replace(/^ *>[ \t]?/gm, ''),
                      n = this.lexer.state.top;
                    this.lexer.state.top = !0;
                    var r = this.lexer.blockTokens(u);
                    return (
                      (this.lexer.state.top = n),
                        { type: 'blockquote', raw: t[0], tokens: r, text: u }
                    );
                  }
                }),
                (u.list = function (e) {
                  var t = this.rules.block.list.exec(e);
                  if (t) {
                    var u,
                      n,
                      r,
                      i,
                      s,
                      a,
                      l,
                      o,
                      D,
                      c,
                      h,
                      p,
                      f = t[1].trim(),
                      g = f.length > 1,
                      d = {
                        type: 'list',
                        raw: '',
                        ordered: g,
                        start: g ? +f.slice(0, -1) : '',
                        loose: !1,
                        items: [],
                      };
                    (f = g ? '\\d{1,9}\\' + f.slice(-1) : '\\' + f),
                    this.options.pedantic && (f = g ? f : '[*+-]');
                    for (
                      var F = new RegExp(
                        '^( {0,3}' + f + ')((?:[\t ][^\\n]*)?(?:\\n|$))'
                      );
                      e &&
                      ((p = !1), (t = F.exec(e))) &&
                      !this.rules.block.hr.test(e);

                    ) {
                      if (
                        ((u = t[0]),
                          (e = e.substring(u.length)),
                          (o = t[2].split('\n', 1)[0].replace(/^\t+/, function (e) {
                            return ' '.repeat(3 * e.length);
                          })),
                          (D = e.split('\n', 1)[0]),
                          this.options.pedantic
                            ? ((i = 2), (h = o.trimLeft()))
                            : ((i = (i = t[2].search(/[^ ]/)) > 4 ? 1 : i),
                              (h = o.slice(i)),
                              (i += t[1].length)),
                          (a = !1),
                        !o &&
                        /^ *$/.test(D) &&
                        ((u += D + '\n'),
                          (e = e.substring(D.length + 1)),
                          (p = !0)),
                          !p)
                      )
                        for (
                          var A = new RegExp(
                              '^ {0,' +
                              Math.min(3, i - 1) +
                              '}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))'
                            ),
                            C = new RegExp(
                              '^ {0,' +
                              Math.min(3, i - 1) +
                              '}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)'
                            ),
                            k = new RegExp(
                              '^ {0,' + Math.min(3, i - 1) + '}(?:```|~~~)'
                            ),
                            E = new RegExp('^ {0,' + Math.min(3, i - 1) + '}#');
                          e &&
                          ((D = c = e.split('\n', 1)[0]),
                          this.options.pedantic &&
                          (D = D.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ')),
                            !k.test(D)) &&
                          !E.test(D) &&
                          !A.test(D) &&
                          !C.test(e);

                        ) {
                          if (D.search(/[^ ]/) >= i || !D.trim())
                            h += '\n' + D.slice(i);
                          else {
                            if (a) break;
                            if (o.search(/[^ ]/) >= 4) break;
                            if (k.test(o)) break;
                            if (E.test(o)) break;
                            if (C.test(o)) break;
                            h += '\n' + D;
                          }
                          a || D.trim() || (a = !0),
                            (u += c + '\n'),
                            (e = e.substring(c.length + 1)),
                            (o = D.slice(i));
                        }
                      d.loose ||
                      (l ? (d.loose = !0) : /\n *\n *$/.test(u) && (l = !0)),
                      this.options.gfm &&
                      (n = /^\[[ xX]\] /.exec(h)) &&
                      ((r = '[ ] ' !== n[0]),
                        (h = h.replace(/^\[[ xX]\] +/, ''))),
                        d.items.push({
                          type: 'list_item',
                          raw: u,
                          task: !!n,
                          checked: r,
                          loose: !1,
                          text: h,
                        }),
                        (d.raw += u);
                    }
                    (d.items[d.items.length - 1].raw = u.trimRight()),
                      (d.items[d.items.length - 1].text = h.trimRight()),
                      (d.raw = d.raw.trimRight());
                    var m = d.items.length;
                    for (s = 0; s < m; s++)
                      if (
                        ((this.lexer.state.top = !1),
                          (d.items[s].tokens = this.lexer.blockTokens(
                            d.items[s].text,
                            []
                          )),
                          !d.loose)
                      ) {
                        var x = d.items[s].tokens.filter(function (e) {
                            return 'space' === e.type;
                          }),
                          b =
                            x.length > 0 &&
                            x.some(function (e) {
                              return /\n.*\n/.test(e.raw);
                            });
                        d.loose = b;
                      }
                    if (d.loose) for (s = 0; s < m; s++) d.items[s].loose = !0;
                    return d;
                  }
                }),
                (u.html = function (e) {
                  var t = this.rules.block.html.exec(e);
                  if (t) {
                    var u = {
                      type: 'html',
                      raw: t[0],
                      pre:
                        !this.options.sanitizer &&
                        ('pre' === t[1] || 'script' === t[1] || 'style' === t[1]),
                      text: t[0],
                    };
                    if (this.options.sanitize) {
                      var n = this.options.sanitizer
                        ? this.options.sanitizer(t[0])
                        : h(t[0]);
                      (u.type = 'paragraph'),
                        (u.text = n),
                        (u.tokens = this.lexer.inline(n));
                    }
                    return u;
                  }
                }),
                (u.def = function (e) {
                  var t = this.rules.block.def.exec(e);
                  if (t) {
                    var u = t[1].toLowerCase().replace(/\s+/g, ' '),
                      n = t[2]
                        ? t[2]
                          .replace(/^<(.*)>$/, '$1')
                          .replace(this.rules.inline._escapes, '$1')
                        : '',
                      r = t[3]
                        ? t[3]
                          .substring(1, t[3].length - 1)
                          .replace(this.rules.inline._escapes, '$1')
                        : t[3];
                    return { type: 'def', tag: u, raw: t[0], href: n, title: r };
                  }
                }),
                (u.table = function (e) {
                  var t = this.rules.block.table.exec(e);
                  if (t) {
                    var u = {
                      type: 'table',
                      header: w(t[1]).map(function (e) {
                        return { text: e };
                      }),
                      align: t[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                      rows:
                        t[3] && t[3].trim()
                          ? t[3].replace(/\n[ \t]*$/, '').split('\n')
                          : [],
                    };
                    if (u.header.length === u.align.length) {
                      u.raw = t[0];
                      var n,
                        r,
                        i,
                        s,
                        a = u.align.length;
                      for (n = 0; n < a; n++)
                        /^ *-+: *$/.test(u.align[n])
                          ? (u.align[n] = 'right')
                          : /^ *:-+: *$/.test(u.align[n])
                            ? (u.align[n] = 'center')
                            : /^ *:-+ *$/.test(u.align[n])
                              ? (u.align[n] = 'left')
                              : (u.align[n] = null);
                      for (a = u.rows.length, n = 0; n < a; n++)
                        u.rows[n] = w(u.rows[n], u.header.length).map(function (
                          e
                        ) {
                          return { text: e };
                        });
                      for (a = u.header.length, r = 0; r < a; r++)
                        u.header[r].tokens = this.lexer.inline(u.header[r].text);
                      for (a = u.rows.length, r = 0; r < a; r++)
                        for (s = u.rows[r], i = 0; i < s.length; i++)
                          s[i].tokens = this.lexer.inline(s[i].text);
                      return u;
                    }
                  }
                }),
                (u.lheading = function (e) {
                  var t = this.rules.block.lheading.exec(e);
                  if (t)
                    return {
                      type: 'heading',
                      raw: t[0],
                      depth: '=' === t[2].charAt(0) ? 1 : 2,
                      text: t[1],
                      tokens: this.lexer.inline(t[1]),
                    };
                }),
                (u.paragraph = function (e) {
                  var t = this.rules.block.paragraph.exec(e);
                  if (t) {
                    var u =
                      '\n' === t[1].charAt(t[1].length - 1)
                        ? t[1].slice(0, -1)
                        : t[1];
                    return {
                      type: 'paragraph',
                      raw: t[0],
                      text: u,
                      tokens: this.lexer.inline(u),
                    };
                  }
                }),
                (u.text = function (e) {
                  var t = this.rules.block.text.exec(e);
                  if (t)
                    return {
                      type: 'text',
                      raw: t[0],
                      text: t[0],
                      tokens: this.lexer.inline(t[0]),
                    };
                }),
                (u.escape = function (e) {
                  var t = this.rules.inline.escape.exec(e);
                  if (t) return { type: 'escape', raw: t[0], text: h(t[1]) };
                }),
                (u.tag = function (e) {
                  var t = this.rules.inline.tag.exec(e);
                  if (t)
                    return (
                      !this.lexer.state.inLink && /^<a /i.test(t[0])
                        ? (this.lexer.state.inLink = !0)
                        : this.lexer.state.inLink &&
                        /^<\/a>/i.test(t[0]) &&
                        (this.lexer.state.inLink = !1),
                        !this.lexer.state.inRawBlock &&
                        /^<(pre|code|kbd|script)(\s|>)/i.test(t[0])
                          ? (this.lexer.state.inRawBlock = !0)
                          : this.lexer.state.inRawBlock &&
                          /^<\/(pre|code|kbd|script)(\s|>)/i.test(t[0]) &&
                          (this.lexer.state.inRawBlock = !1),
                        {
                          type: this.options.sanitize ? 'text' : 'html',
                          raw: t[0],
                          inLink: this.lexer.state.inLink,
                          inRawBlock: this.lexer.state.inRawBlock,
                          text: this.options.sanitize
                            ? this.options.sanitizer
                              ? this.options.sanitizer(t[0])
                              : h(t[0])
                            : t[0],
                        }
                    );
                }),
                (u.link = function (e) {
                  var t = this.rules.inline.link.exec(e);
                  if (t) {
                    var u = t[2].trim();
                    if (!this.options.pedantic && /^</.test(u)) {
                      if (!/>$/.test(u)) return;
                      var n = B(u.slice(0, -1), '\\');
                      if ((u.length - n.length) % 2 == 0) return;
                    } else {
                      var r = (function (e, t) {
                        if (-1 === e.indexOf(t[1])) return -1;
                        for (var u = e.length, n = 0, r = 0; r < u; r++)
                          if ('\\' === e[r]) r++;
                          else if (e[r] === t[0]) n++;
                          else if (e[r] === t[1] && --n < 0) return r;
                        return -1;
                      })(t[2], '()');
                      if (r > -1) {
                        var i =
                          (0 === t[0].indexOf('!') ? 5 : 4) + t[1].length + r;
                        (t[2] = t[2].substring(0, r)),
                          (t[0] = t[0].substring(0, i).trim()),
                          (t[3] = '');
                      }
                    }
                    var s = t[2],
                      a = '';
                    if (this.options.pedantic) {
                      var l = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s);
                      l && ((s = l[1]), (a = l[3]));
                    } else a = t[3] ? t[3].slice(1, -1) : '';
                    return (
                      (s = s.trim()),
                      /^</.test(s) &&
                      (s =
                        this.options.pedantic && !/>$/.test(u)
                          ? s.slice(1)
                          : s.slice(1, -1)),
                        z(
                          t,
                          {
                            href: s
                              ? s.replace(this.rules.inline._escapes, '$1')
                              : s,
                            title: a
                              ? a.replace(this.rules.inline._escapes, '$1')
                              : a,
                          },
                          t[0],
                          this.lexer
                        )
                    );
                  }
                }),
                (u.reflink = function (e, t) {
                  var u;
                  if (
                    (u = this.rules.inline.reflink.exec(e)) ||
                    (u = this.rules.inline.nolink.exec(e))
                  ) {
                    var n = (u[2] || u[1]).replace(/\s+/g, ' ');
                    if (!(n = t[n.toLowerCase()])) {
                      var r = u[0].charAt(0);
                      return { type: 'text', raw: r, text: r };
                    }
                    return z(u, n, u[0], this.lexer);
                  }
                }),
                (u.emStrong = function (e, t, u) {
                  void 0 === u && (u = '');
                  var n = this.rules.inline.emStrong.lDelim.exec(e);
                  if (
                    n &&
                    (!n[3] ||
                      !u.match(
                        /(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/
                      ))
                  ) {
                    var r = n[1] || n[2] || '';
                    if (
                      !r ||
                      (r && ('' === u || this.rules.inline.punctuation.exec(u)))
                    ) {
                      var i,
                        s,
                        a = n[0].length - 1,
                        l = a,
                        o = 0,
                        D =
                          '*' === n[0][0]
                            ? this.rules.inline.emStrong.rDelimAst
                            : this.rules.inline.emStrong.rDelimUnd;
                      for (
                        D.lastIndex = 0, t = t.slice(-1 * e.length + a);
                        null != (n = D.exec(t));

                      )
                        if ((i = n[1] || n[2] || n[3] || n[4] || n[5] || n[6]))
                          if (((s = i.length), n[3] || n[4])) l += s;
                          else if (!((n[5] || n[6]) && a % 3) || (a + s) % 3) {
                            if (!((l -= s) > 0)) {
                              s = Math.min(s, s + l + o);
                              var c = e.slice(
                                0,
                                a + n.index + (n[0].length - i.length) + s
                              );
                              if (Math.min(a, s) % 2) {
                                var h = c.slice(1, -1);
                                return {
                                  type: 'em',
                                  raw: c,
                                  text: h,
                                  tokens: this.lexer.inlineTokens(h),
                                };
                              }
                              var p = c.slice(2, -2);
                              return {
                                type: 'strong',
                                raw: c,
                                text: p,
                                tokens: this.lexer.inlineTokens(p),
                              };
                            }
                          } else o += s;
                    }
                  }
                }),
                (u.codespan = function (e) {
                  var t = this.rules.inline.code.exec(e);
                  if (t) {
                    var u = t[2].replace(/\n/g, ' '),
                      n = /[^ ]/.test(u),
                      r = /^ /.test(u) && / $/.test(u);
                    return (
                      n && r && (u = u.substring(1, u.length - 1)),
                        (u = h(u, !0)),
                        { type: 'codespan', raw: t[0], text: u }
                    );
                  }
                }),
                (u.br = function (e) {
                  var t = this.rules.inline.br.exec(e);
                  if (t) return { type: 'br', raw: t[0] };
                }),
                (u.del = function (e) {
                  var t = this.rules.inline.del.exec(e);
                  if (t)
                    return {
                      type: 'del',
                      raw: t[0],
                      text: t[2],
                      tokens: this.lexer.inlineTokens(t[2]),
                    };
                }),
                (u.autolink = function (e, t) {
                  var u,
                    n,
                    r = this.rules.inline.autolink.exec(e);
                  if (r)
                    return (
                      (n =
                        '@' === r[2]
                          ? 'mailto:' +
                          (u = h(this.options.mangle ? t(r[1]) : r[1]))
                          : (u = h(r[1]))),
                        {
                          type: 'link',
                          raw: r[0],
                          text: u,
                          href: n,
                          tokens: [{ type: 'text', raw: u, text: u }],
                        }
                    );
                }),
                (u.url = function (e, t) {
                  var u;
                  if ((u = this.rules.inline.url.exec(e))) {
                    var n, r;
                    if ('@' === u[2])
                      r =
                        'mailto:' + (n = h(this.options.mangle ? t(u[0]) : u[0]));
                    else {
                      var i;
                      do {
                        (i = u[0]),
                          (u[0] = this.rules.inline._backpedal.exec(u[0])[0]);
                      } while (i !== u[0]);
                      (n = h(u[0])),
                        (r = 'www.' === u[1] ? 'http://' + u[0] : u[0]);
                    }
                    return {
                      type: 'link',
                      raw: u[0],
                      text: n,
                      href: r,
                      tokens: [{ type: 'text', raw: n, text: n }],
                    };
                  }
                }),
                (u.inlineText = function (e, t) {
                  var u,
                    n = this.rules.inline.text.exec(e);
                  if (n)
                    return (
                      (u = this.lexer.state.inRawBlock
                        ? this.options.sanitize
                          ? this.options.sanitizer
                            ? this.options.sanitizer(n[0])
                            : h(n[0])
                          : n[0]
                        : h(this.options.smartypants ? t(n[0]) : n[0])),
                        { type: 'text', raw: n[0], text: u }
                    );
                }),
                e
            );
          })(),
          $ = {
            newline: /^(?: *(?:\n|$))+/,
            code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
            fences:
              /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
            hr: /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
            heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
            blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
            list: /^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/,
            html: '^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))',
            def: /^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/,
            table: b,
            lheading: /^((?:.|\n(?!\n))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
            _paragraph:
              /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
            text: /^[^\n]+/,
            _label: /(?!\s*\])(?:\\.|[^\[\]\\])+/,
            _title:
              /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,
          };
        ($.def = d($.def)
          .replace('label', $._label)
          .replace('title', $._title)
          .getRegex()),
          ($.bullet = /(?:[*+-]|\d{1,9}[.)])/),
          ($.listItemStart = d(/^( *)(bull) */)
            .replace('bull', $.bullet)
            .getRegex()),
          ($.list = d($.list)
            .replace(/bull/g, $.bullet)
            .replace(
              'hr',
              '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))'
            )
            .replace('def', '\\n+(?=' + $.def.source + ')')
            .getRegex()),
          ($._tag =
            'address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul'),
          ($._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/),
          ($.html = d($.html, 'i')
            .replace('comment', $._comment)
            .replace('tag', $._tag)
            .replace(
              'attribute',
              / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/
            )
            .getRegex()),
          ($.paragraph = d($._paragraph)
            .replace('hr', $.hr)
            .replace('heading', ' {0,3}#{1,6} ')
            .replace('|lheading', '')
            .replace('|table', '')
            .replace('blockquote', ' {0,3}>')
            .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
            .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
            .replace(
              'html',
              '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)'
            )
            .replace('tag', $._tag)
            .getRegex()),
          ($.blockquote = d($.blockquote)
            .replace('paragraph', $.paragraph)
            .getRegex()),
          ($.normal = v({}, $)),
          ($.gfm = v({}, $.normal, {
            table:
              '^ *([^\\n ].*\\|.*)\\n {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)(?:\\| *)?(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
          })),
          ($.gfm.table = d($.gfm.table)
            .replace('hr', $.hr)
            .replace('heading', ' {0,3}#{1,6} ')
            .replace('blockquote', ' {0,3}>')
            .replace('code', ' {4}[^\\n]')
            .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
            .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
            .replace(
              'html',
              '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)'
            )
            .replace('tag', $._tag)
            .getRegex()),
          ($.gfm.paragraph = d($._paragraph)
            .replace('hr', $.hr)
            .replace('heading', ' {0,3}#{1,6} ')
            .replace('|lheading', '')
            .replace('table', $.gfm.table)
            .replace('blockquote', ' {0,3}>')
            .replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n')
            .replace('list', ' {0,3}(?:[*+-]|1[.)]) ')
            .replace(
              'html',
              '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)'
            )
            .replace('tag', $._tag)
            .getRegex()),
          ($.pedantic = v({}, $.normal, {
            html: d(
              '^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))'
            )
              .replace('comment', $._comment)
              .replace(
                /tag/g,
                '(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b'
              )
              .getRegex(),
            def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
            heading: /^(#{1,6})(.*)(?:\n+|$)/,
            fences: b,
            lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
            paragraph: d($.normal._paragraph)
              .replace('hr', $.hr)
              .replace('heading', ' *#{1,6} *[^\n]')
              .replace('lheading', $.lheading)
              .replace('blockquote', ' {0,3}>')
              .replace('|fences', '')
              .replace('|list', '')
              .replace('|html', '')
              .getRegex(),
          }));
        var T = {
          escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
          autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
          url: b,
          tag: '^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
          link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
          reflink: /^!?\[(label)\]\[(ref)\]/,
          nolink: /^!?\[(ref)\](?:\[\])?/,
          reflinkSearch: 'reflink|nolink(?!\\()',
          emStrong: {
            lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
            rDelimAst:
              /^(?:[^_*\\]|\\.)*?\_\_(?:[^_*\\]|\\.)*?\*(?:[^_*\\]|\\.)*?(?=\_\_)|(?:[^*\\]|\\.)+(?=[^*])|[punct_](\*+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|(?:[^punct*_\s\\]|\\.)(\*+)(?=[^punct*_\s])/,
            rDelimUnd:
              /^(?:[^_*\\]|\\.)*?\*\*(?:[^_*\\]|\\.)*?\_(?:[^_*\\]|\\.)*?(?=\*\*)|(?:[^_\\]|\\.)+(?=[^_])|[punct*](\_+)(?=[\s]|$)|(?:[^punct*_\s\\]|\\.)(\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/,
          },
          code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
          br: /^( {2,}|\\)\n(?!\s*$)/,
          del: b,
          text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
          punctuation: /^([\spunctuation])/,
        };
        function R(e) {
          return e
            .replace(/---/g, '—')
            .replace(/--/g, '–')
            .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1‘')
            .replace(/'/g, '’')
            .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1“')
            .replace(/"/g, '”')
            .replace(/\.{3}/g, '…');
        }
        function I(e) {
          var t,
            u,
            n = '',
            r = e.length;
          for (t = 0; t < r; t++)
            (u = e.charCodeAt(t)),
            Math.random() > 0.5 && (u = 'x' + u.toString(16)),
              (n += '&#' + u + ';');
          return n;
        }
        (T._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~'),
          (T.punctuation = d(T.punctuation)
            .replace(/punctuation/g, T._punctuation)
            .getRegex()),
          (T.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g),
          (T.escapedEmSt = /(?:^|[^\\])(?:\\\\)*\\[*_]/g),
          (T._comment = d($._comment)
            .replace('(?:--\x3e|$)', '--\x3e')
            .getRegex()),
          (T.emStrong.lDelim = d(T.emStrong.lDelim)
            .replace(/punct/g, T._punctuation)
            .getRegex()),
          (T.emStrong.rDelimAst = d(T.emStrong.rDelimAst, 'g')
            .replace(/punct/g, T._punctuation)
            .getRegex()),
          (T.emStrong.rDelimUnd = d(T.emStrong.rDelimUnd, 'g')
            .replace(/punct/g, T._punctuation)
            .getRegex()),
          (T._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g),
          (T._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/),
          (T._email =
            /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/),
          (T.autolink = d(T.autolink)
            .replace('scheme', T._scheme)
            .replace('email', T._email)
            .getRegex()),
          (T._attribute =
            /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/),
          (T.tag = d(T.tag)
            .replace('comment', T._comment)
            .replace('attribute', T._attribute)
            .getRegex()),
          (T._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/),
          (T._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/),
          (T._title =
            /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/),
          (T.link = d(T.link)
            .replace('label', T._label)
            .replace('href', T._href)
            .replace('title', T._title)
            .getRegex()),
          (T.reflink = d(T.reflink)
            .replace('label', T._label)
            .replace('ref', $._label)
            .getRegex()),
          (T.nolink = d(T.nolink).replace('ref', $._label).getRegex()),
          (T.reflinkSearch = d(T.reflinkSearch, 'g')
            .replace('reflink', T.reflink)
            .replace('nolink', T.nolink)
            .getRegex()),
          (T.normal = v({}, T)),
          (T.pedantic = v({}, T.normal, {
            strong: {
              start: /^__|\*\*/,
              middle:
                /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
              endAst: /\*\*(?!\*)/g,
              endUnd: /__(?!_)/g,
            },
            em: {
              start: /^_|\*/,
              middle:
                /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
              endAst: /\*(?!\*)/g,
              endUnd: /_(?!_)/g,
            },
            link: d(/^!?\[(label)\]\((.*?)\)/)
              .replace('label', T._label)
              .getRegex(),
            reflink: d(/^!?\[(label)\]\s*\[([^\]]*)\]/)
              .replace('label', T._label)
              .getRegex(),
          })),
          (T.gfm = v({}, T.normal, {
            escape: d(T.escape).replace('])', '~|])').getRegex(),
            _extended_email:
              /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
            url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
            _backpedal:
              /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
            del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
            text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/,
          })),
          (T.gfm.url = d(T.gfm.url, 'i')
            .replace('email', T.gfm._extended_email)
            .getRegex()),
          (T.breaks = v({}, T.gfm, {
            br: d(T.br).replace('{2,}', '*').getRegex(),
            text: d(T.gfm.text)
              .replace('\\b_', '\\b_| {2,}\\n')
              .replace(/\{2,\}/g, '*')
              .getRegex(),
          }));
        var O = (function () {
            function e(e) {
              (this.tokens = []),
                (this.tokens.links = Object.create(null)),
                (this.options = e || t.defaults),
                (this.options.tokenizer = this.options.tokenizer || new S()),
                (this.tokenizer = this.options.tokenizer),
                (this.tokenizer.options = this.options),
                (this.tokenizer.lexer = this),
                (this.inlineQueue = []),
                (this.state = { inLink: !1, inRawBlock: !1, top: !0 });
              var u = { block: $.normal, inline: T.normal };
              this.options.pedantic
                ? ((u.block = $.pedantic), (u.inline = T.pedantic))
                : this.options.gfm &&
                ((u.block = $.gfm),
                  this.options.breaks
                    ? (u.inline = T.breaks)
                    : (u.inline = T.gfm)),
                (this.tokenizer.rules = u);
            }
            (e.lex = function (t, u) {
              return new e(u).lex(t);
            }),
              (e.lexInline = function (t, u) {
                return new e(u).inlineTokens(t);
              });
            var n,
              r,
              i = e.prototype;
            return (
              (i.lex = function (e) {
                var t;
                for (
                  e = e.replace(/\r\n|\r/g, '\n'),
                    this.blockTokens(e, this.tokens);
                  (t = this.inlineQueue.shift());

                )
                  this.inlineTokens(t.src, t.tokens);
                return this.tokens;
              }),
                (i.blockTokens = function (e, t) {
                  var u,
                    n,
                    r,
                    i,
                    s = this;
                  for (
                    void 0 === t && (t = []),
                      e = this.options.pedantic
                        ? e.replace(/\t/g, '    ').replace(/^ +$/gm, '')
                        : e.replace(/^( *)(\t+)/gm, function (e, t, u) {
                          return t + '    '.repeat(u.length);
                        });
                    e;

                  )
                    if (
                      !(
                        this.options.extensions &&
                        this.options.extensions.block &&
                        this.options.extensions.block.some(function (n) {
                          return (
                            !!(u = n.call({ lexer: s }, e, t)) &&
                            ((e = e.substring(u.raw.length)), t.push(u), !0)
                          );
                        })
                      )
                    )
                      if ((u = this.tokenizer.space(e)))
                        (e = e.substring(u.raw.length)),
                          1 === u.raw.length && t.length > 0
                            ? (t[t.length - 1].raw += '\n')
                            : t.push(u);
                      else if ((u = this.tokenizer.code(e)))
                        (e = e.substring(u.raw.length)),
                          !(n = t[t.length - 1]) ||
                          ('paragraph' !== n.type && 'text' !== n.type)
                            ? t.push(u)
                            : ((n.raw += '\n' + u.raw),
                              (n.text += '\n' + u.text),
                              (this.inlineQueue[this.inlineQueue.length - 1].src =
                                n.text));
                      else if ((u = this.tokenizer.fences(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.heading(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.hr(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.blockquote(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.list(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.html(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.def(e)))
                        (e = e.substring(u.raw.length)),
                          !(n = t[t.length - 1]) ||
                          ('paragraph' !== n.type && 'text' !== n.type)
                            ? this.tokens.links[u.tag] ||
                            (this.tokens.links[u.tag] = {
                              href: u.href,
                              title: u.title,
                            })
                            : ((n.raw += '\n' + u.raw),
                              (n.text += '\n' + u.raw),
                              (this.inlineQueue[this.inlineQueue.length - 1].src =
                                n.text));
                      else if ((u = this.tokenizer.table(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.lheading(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if (
                        ((r = e),
                        this.options.extensions &&
                        this.options.extensions.startBlock &&
                        (function () {
                          var t = 1 / 0,
                            u = e.slice(1),
                            n = void 0;
                          s.options.extensions.startBlock.forEach(function (e) {
                            'number' ==
                            typeof (n = e.call({ lexer: this }, u)) &&
                            n >= 0 &&
                            (t = Math.min(t, n));
                          }),
                          t < 1 / 0 && t >= 0 && (r = e.substring(0, t + 1));
                        })(),
                        this.state.top && (u = this.tokenizer.paragraph(r)))
                      )
                        (n = t[t.length - 1]),
                          i && 'paragraph' === n.type
                            ? ((n.raw += '\n' + u.raw),
                              (n.text += '\n' + u.text),
                              this.inlineQueue.pop(),
                              (this.inlineQueue[this.inlineQueue.length - 1].src =
                                n.text))
                            : t.push(u),
                          (i = r.length !== e.length),
                          (e = e.substring(u.raw.length));
                      else if ((u = this.tokenizer.text(e)))
                        (e = e.substring(u.raw.length)),
                          (n = t[t.length - 1]) && 'text' === n.type
                            ? ((n.raw += '\n' + u.raw),
                              (n.text += '\n' + u.text),
                              this.inlineQueue.pop(),
                              (this.inlineQueue[this.inlineQueue.length - 1].src =
                                n.text))
                            : t.push(u);
                      else if (e) {
                        var a = 'Infinite loop on byte: ' + e.charCodeAt(0);
                        if (this.options.silent) {
                          console.error(a);
                          break;
                        }
                        throw new Error(a);
                      }
                  return (this.state.top = !0), t;
                }),
                (i.inline = function (e, t) {
                  return (
                    void 0 === t && (t = []),
                      this.inlineQueue.push({ src: e, tokens: t }),
                      t
                  );
                }),
                (i.inlineTokens = function (e, t) {
                  var u,
                    n,
                    r,
                    i = this;
                  void 0 === t && (t = []);
                  var s,
                    a,
                    l,
                    o = e;
                  if (this.tokens.links) {
                    var D = Object.keys(this.tokens.links);
                    if (D.length > 0)
                      for (
                        ;
                        null !=
                        (s = this.tokenizer.rules.inline.reflinkSearch.exec(o));

                      )
                        D.includes(s[0].slice(s[0].lastIndexOf('[') + 1, -1)) &&
                        (o =
                          o.slice(0, s.index) +
                          '[' +
                          _('a', s[0].length - 2) +
                          ']' +
                          o.slice(
                            this.tokenizer.rules.inline.reflinkSearch.lastIndex
                          ));
                  }
                  for (
                    ;
                    null != (s = this.tokenizer.rules.inline.blockSkip.exec(o));

                  )
                    o =
                      o.slice(0, s.index) +
                      '[' +
                      _('a', s[0].length - 2) +
                      ']' +
                      o.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
                  for (
                    ;
                    null != (s = this.tokenizer.rules.inline.escapedEmSt.exec(o));

                  )
                    (o =
                      o.slice(0, s.index + s[0].length - 2) +
                      '++' +
                      o.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex)),
                      this.tokenizer.rules.inline.escapedEmSt.lastIndex--;
                  for (; e; )
                    if (
                      (a || (l = ''),
                        (a = !1),
                        !(
                          this.options.extensions &&
                          this.options.extensions.inline &&
                          this.options.extensions.inline.some(function (n) {
                            return (
                              !!(u = n.call({ lexer: i }, e, t)) &&
                              ((e = e.substring(u.raw.length)), t.push(u), !0)
                            );
                          })
                        ))
                    )
                      if ((u = this.tokenizer.escape(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.tag(e)))
                        (e = e.substring(u.raw.length)),
                          (n = t[t.length - 1]) &&
                          'text' === u.type &&
                          'text' === n.type
                            ? ((n.raw += u.raw), (n.text += u.text))
                            : t.push(u);
                      else if ((u = this.tokenizer.link(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.reflink(e, this.tokens.links)))
                        (e = e.substring(u.raw.length)),
                          (n = t[t.length - 1]) &&
                          'text' === u.type &&
                          'text' === n.type
                            ? ((n.raw += u.raw), (n.text += u.text))
                            : t.push(u);
                      else if ((u = this.tokenizer.emStrong(e, o, l)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.codespan(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.br(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.del(e)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if ((u = this.tokenizer.autolink(e, I)))
                        (e = e.substring(u.raw.length)), t.push(u);
                      else if (
                        this.state.inLink ||
                        !(u = this.tokenizer.url(e, I))
                      ) {
                        if (
                          ((r = e),
                          this.options.extensions &&
                          this.options.extensions.startInline &&
                          (function () {
                            var t = 1 / 0,
                              u = e.slice(1),
                              n = void 0;
                            i.options.extensions.startInline.forEach(function (
                              e
                            ) {
                              'number' ==
                              typeof (n = e.call({ lexer: this }, u)) &&
                              n >= 0 &&
                              (t = Math.min(t, n));
                            }),
                            t < 1 / 0 &&
                            t >= 0 &&
                            (r = e.substring(0, t + 1));
                          })(),
                            (u = this.tokenizer.inlineText(r, R)))
                        )
                          (e = e.substring(u.raw.length)),
                          '_' !== u.raw.slice(-1) && (l = u.raw.slice(-1)),
                            (a = !0),
                            (n = t[t.length - 1]) && 'text' === n.type
                              ? ((n.raw += u.raw), (n.text += u.text))
                              : t.push(u);
                        else if (e) {
                          var c = 'Infinite loop on byte: ' + e.charCodeAt(0);
                          if (this.options.silent) {
                            console.error(c);
                            break;
                          }
                          throw new Error(c);
                        }
                      } else (e = e.substring(u.raw.length)), t.push(u);
                  return t;
                }),
                (n = e),
                (r = [
                  {
                    key: 'rules',
                    get: function () {
                      return { block: $, inline: T };
                    },
                  },
                ]),
              null && u(n.prototype, null),
              r && u(n, r),
                Object.defineProperty(n, 'prototype', { writable: !1 }),
                e
            );
          })(),
          q = (function () {
            function e(e) {
              this.options = e || t.defaults;
            }
            var u = e.prototype;
            return (
              (u.code = function (e, t, u) {
                var n = (t || '').match(/\S*/)[0];
                if (this.options.highlight) {
                  var r = this.options.highlight(e, n);
                  null != r && r !== e && ((u = !0), (e = r));
                }
                return (
                  (e = e.replace(/\n$/, '') + '\n'),
                    n
                      ? '<pre><code class="' +
                      this.options.langPrefix +
                      h(n) +
                      '">' +
                      (u ? e : h(e, !0)) +
                      '</code></pre>\n'
                      : '<pre><code>' + (u ? e : h(e, !0)) + '</code></pre>\n'
                );
              }),
                (u.blockquote = function (e) {
                  return '<blockquote>\n' + e + '</blockquote>\n';
                }),
                (u.html = function (e) {
                  return e;
                }),
                (u.heading = function (e, t, u, n) {
                  return this.options.headerIds
                    ? '<h' +
                    t +
                    ' id="' +
                    (this.options.headerPrefix + n.slug(u)) +
                    '">' +
                    e +
                    '</h' +
                    t +
                    '>\n'
                    : '<h' + t + '>' + e + '</h' + t + '>\n';
                }),
                (u.hr = function () {
                  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
                }),
                (u.list = function (e, t, u) {
                  var n = t ? 'ol' : 'ul';
                  return (
                    '<' +
                    n +
                    (t && 1 !== u ? ' start="' + u + '"' : '') +
                    '>\n' +
                    e +
                    '</' +
                    n +
                    '>\n'
                  );
                }),
                (u.listitem = function (e) {
                  return '<li>' + e + '</li>\n';
                }),
                (u.checkbox = function (e) {
                  return (
                    '<input ' +
                    (e ? 'checked="" ' : '') +
                    'disabled="" type="checkbox"' +
                    (this.options.xhtml ? ' /' : '') +
                    '> '
                  );
                }),
                (u.paragraph = function (e) {
                  return '<p>' + e + '</p>\n';
                }),
                (u.table = function (e, t) {
                  return (
                    t && (t = '<tbody>' + t + '</tbody>'),
                    '<table>\n<thead>\n' + e + '</thead>\n' + t + '</table>\n'
                  );
                }),
                (u.tablerow = function (e) {
                  return '<tr>\n' + e + '</tr>\n';
                }),
                (u.tablecell = function (e, t) {
                  var u = t.header ? 'th' : 'td';
                  return (
                    (t.align
                      ? '<' + u + ' align="' + t.align + '">'
                      : '<' + u + '>') +
                    e +
                    '</' +
                    u +
                    '>\n'
                  );
                }),
                (u.strong = function (e) {
                  return '<strong>' + e + '</strong>';
                }),
                (u.em = function (e) {
                  return '<em>' + e + '</em>';
                }),
                (u.codespan = function (e) {
                  return '<code>' + e + '</code>';
                }),
                (u.br = function () {
                  return this.options.xhtml ? '<br/>' : '<br>';
                }),
                (u.del = function (e) {
                  return '<del>' + e + '</del>';
                }),
                (u.link = function (e, t, u) {
                  if (
                    null ===
                    (e = C(this.options.sanitize, this.options.baseUrl, e))
                  )
                    return u;
                  var n = '<a href="' + e + '"';
                  return t && (n += ' title="' + t + '"'), n + '>' + u + '</a>';
                }),
                (u.image = function (e, t, u) {
                  if (
                    null ===
                    (e = C(this.options.sanitize, this.options.baseUrl, e))
                  )
                    return u;
                  var n = '<img src="' + e + '" alt="' + u + '"';
                  return (
                    t && (n += ' title="' + t + '"'),
                    n + (this.options.xhtml ? '/>' : '>')
                  );
                }),
                (u.text = function (e) {
                  return e;
                }),
                e
            );
          })(),
          L = (function () {
            function e() {}
            var t = e.prototype;
            return (
              (t.strong = function (e) {
                return e;
              }),
                (t.em = function (e) {
                  return e;
                }),
                (t.codespan = function (e) {
                  return e;
                }),
                (t.del = function (e) {
                  return e;
                }),
                (t.html = function (e) {
                  return e;
                }),
                (t.text = function (e) {
                  return e;
                }),
                (t.link = function (e, t, u) {
                  return '' + u;
                }),
                (t.image = function (e, t, u) {
                  return '' + u;
                }),
                (t.br = function () {
                  return '';
                }),
                e
            );
          })(),
          P = (function () {
            function e() {
              this.seen = {};
            }
            var t = e.prototype;
            return (
              (t.serialize = function (e) {
                return e
                  .toLowerCase()
                  .trim()
                  .replace(/<[!\/a-z].*?>/gi, '')
                  .replace(
                    /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
                    ''
                  )
                  .replace(/\s/g, '-');
              }),
                (t.getNextSafeSlug = function (e, t) {
                  var u = e,
                    n = 0;
                  if (this.seen.hasOwnProperty(u)) {
                    n = this.seen[e];
                    do {
                      u = e + '-' + ++n;
                    } while (this.seen.hasOwnProperty(u));
                  }
                  return t || ((this.seen[e] = n), (this.seen[u] = 0)), u;
                }),
                (t.slug = function (e, t) {
                  void 0 === t && (t = {});
                  var u = this.serialize(e);
                  return this.getNextSafeSlug(u, t.dryrun);
                }),
                e
            );
          })(),
          U = (function () {
            function e(e) {
              (this.options = e || t.defaults),
                (this.options.renderer = this.options.renderer || new q()),
                (this.renderer = this.options.renderer),
                (this.renderer.options = this.options),
                (this.textRenderer = new L()),
                (this.slugger = new P());
            }
            (e.parse = function (t, u) {
              return new e(u).parse(t);
            }),
              (e.parseInline = function (t, u) {
                return new e(u).parseInline(t);
              });
            var u = e.prototype;
            return (
              (u.parse = function (e, t) {
                void 0 === t && (t = !0);
                var u,
                  n,
                  r,
                  i,
                  s,
                  a,
                  l,
                  o,
                  D,
                  c,
                  h,
                  p,
                  g,
                  d,
                  F,
                  A,
                  C,
                  k,
                  E,
                  m = '',
                  x = e.length;
                for (u = 0; u < x; u++)
                  if (
                    ((c = e[u]),
                    !(
                      this.options.extensions &&
                      this.options.extensions.renderers &&
                      this.options.extensions.renderers[c.type]
                    ) ||
                    (!1 ===
                      (E = this.options.extensions.renderers[c.type].call(
                        { parser: this },
                        c
                      )) &&
                      [
                        'space',
                        'hr',
                        'heading',
                        'code',
                        'table',
                        'blockquote',
                        'list',
                        'html',
                        'paragraph',
                        'text',
                      ].includes(c.type)))
                  )
                    switch (c.type) {
                      case 'space':
                        continue;
                      case 'hr':
                        m += this.renderer.hr();
                        continue;
                      case 'heading':
                        m += this.renderer.heading(
                          this.parseInline(c.tokens),
                          c.depth,
                          f(this.parseInline(c.tokens, this.textRenderer)),
                          this.slugger
                        );
                        continue;
                      case 'code':
                        m += this.renderer.code(c.text, c.lang, c.escaped);
                        continue;
                      case 'table':
                        for (
                          o = '', l = '', i = c.header.length, n = 0;
                          n < i;
                          n++
                        )
                          l += this.renderer.tablecell(
                            this.parseInline(c.header[n].tokens),
                            { header: !0, align: c.align[n] }
                          );
                        for (
                          o += this.renderer.tablerow(l),
                            D = '',
                            i = c.rows.length,
                            n = 0;
                          n < i;
                          n++
                        ) {
                          for (
                            l = '', s = (a = c.rows[n]).length, r = 0;
                            r < s;
                            r++
                          )
                            l += this.renderer.tablecell(
                              this.parseInline(a[r].tokens),
                              { header: !1, align: c.align[r] }
                            );
                          D += this.renderer.tablerow(l);
                        }
                        m += this.renderer.table(o, D);
                        continue;
                      case 'blockquote':
                        (D = this.parse(c.tokens)),
                          (m += this.renderer.blockquote(D));
                        continue;
                      case 'list':
                        for (
                          h = c.ordered,
                            p = c.start,
                            g = c.loose,
                            i = c.items.length,
                            D = '',
                            n = 0;
                          n < i;
                          n++
                        )
                          (A = (F = c.items[n]).checked),
                            (C = F.task),
                            (d = ''),
                          F.task &&
                          ((k = this.renderer.checkbox(A)),
                            g
                              ? F.tokens.length > 0 &&
                              'paragraph' === F.tokens[0].type
                                ? ((F.tokens[0].text =
                                  k + ' ' + F.tokens[0].text),
                                F.tokens[0].tokens &&
                                F.tokens[0].tokens.length > 0 &&
                                'text' === F.tokens[0].tokens[0].type &&
                                (F.tokens[0].tokens[0].text =
                                  k + ' ' + F.tokens[0].tokens[0].text))
                                : F.tokens.unshift({ type: 'text', text: k })
                              : (d += k)),
                            (d += this.parse(F.tokens, g)),
                            (D += this.renderer.listitem(d, C, A));
                        m += this.renderer.list(D, h, p);
                        continue;
                      case 'html':
                        m += this.renderer.html(c.text);
                        continue;
                      case 'paragraph':
                        m += this.renderer.paragraph(
                          this.parseInline(c.tokens)
                        );
                        continue;
                      case 'text':
                        for (
                          D = c.tokens ? this.parseInline(c.tokens) : c.text;
                          u + 1 < x && 'text' === e[u + 1].type;

                        )
                          D +=
                            '\n' +
                            ((c = e[++u]).tokens
                              ? this.parseInline(c.tokens)
                              : c.text);
                        m += t ? this.renderer.paragraph(D) : D;
                        continue;
                      default:
                        var b =
                          'Token with "' + c.type + '" type was not found.';
                        if (this.options.silent) return void console.error(b);
                        throw new Error(b);
                    }
                  else m += E || '';
                return m;
              }),
                (u.parseInline = function (e, t) {
                  t = t || this.renderer;
                  var u,
                    n,
                    r,
                    i = '',
                    s = e.length;
                  for (u = 0; u < s; u++)
                    if (
                      ((n = e[u]),
                      !(
                        this.options.extensions &&
                        this.options.extensions.renderers &&
                        this.options.extensions.renderers[n.type]
                      ) ||
                      (!1 ===
                        (r = this.options.extensions.renderers[n.type].call(
                          { parser: this },
                          n
                        )) &&
                        [
                          'escape',
                          'html',
                          'link',
                          'image',
                          'strong',
                          'em',
                          'codespan',
                          'br',
                          'del',
                          'text',
                        ].includes(n.type)))
                    )
                      switch (n.type) {
                        case 'escape':
                        case 'text':
                          i += t.text(n.text);
                          break;
                        case 'html':
                          i += t.html(n.text);
                          break;
                        case 'link':
                          i += t.link(
                            n.href,
                            n.title,
                            this.parseInline(n.tokens, t)
                          );
                          break;
                        case 'image':
                          i += t.image(n.href, n.title, n.text);
                          break;
                        case 'strong':
                          i += t.strong(this.parseInline(n.tokens, t));
                          break;
                        case 'em':
                          i += t.em(this.parseInline(n.tokens, t));
                          break;
                        case 'codespan':
                          i += t.codespan(n.text);
                          break;
                        case 'br':
                          i += t.br();
                          break;
                        case 'del':
                          i += t.del(this.parseInline(n.tokens, t));
                          break;
                        default:
                          var a =
                            'Token with "' + n.type + '" type was not found.';
                          if (this.options.silent) return void console.error(a);
                          throw new Error(a);
                      }
                    else i += r || '';
                  return i;
                }),
                e
            );
          })();
        function M(e, t, u) {
          if (null == e)
            throw new Error('marked(): input parameter is undefined or null');
          if ('string' != typeof e)
            throw new Error(
              'marked(): input parameter is of type ' +
              Object.prototype.toString.call(e) +
              ', string expected'
            );
          if (
            ('function' == typeof t && ((u = t), (t = null)),
              y((t = v({}, M.defaults, t || {}))),
              u)
          ) {
            var n,
              r = t.highlight;
            try {
              n = O.lex(e, t);
            } catch (e) {
              return u(e);
            }
            var i = function (e) {
              var i;
              if (!e)
                try {
                  t.walkTokens && M.walkTokens(n, t.walkTokens),
                    (i = U.parse(n, t));
                } catch (t) {
                  e = t;
                }
              return (t.highlight = r), e ? u(e) : u(null, i);
            };
            if (!r || r.length < 3) return i();
            if ((delete t.highlight, !n.length)) return i();
            var s = 0;
            return (
              M.walkTokens(n, function (e) {
                'code' === e.type &&
                (s++,
                  setTimeout(function () {
                    r(e.text, e.lang, function (t, u) {
                      if (t) return i(t);
                      null != u &&
                      u !== e.text &&
                      ((e.text = u), (e.escaped = !0)),
                      0 == --s && i();
                    });
                  }, 0));
              }),
                void (0 === s && i())
            );
          }
          function a(e) {
            if (
              ((e.message +=
                '\nPlease report this to https://github.com/markedjs/marked.'),
                t.silent)
            )
              return (
                '<p>An error occurred:</p><pre>' +
                h(e.message + '', !0) +
                '</pre>'
              );
            throw e;
          }
          try {
            var l = O.lex(e, t);
            if (t.walkTokens) {
              if (t.async)
                return Promise.all(M.walkTokens(l, t.walkTokens))
                  .then(function () {
                    return U.parse(l, t);
                  })
                  .catch(a);
              M.walkTokens(l, t.walkTokens);
            }
            return U.parse(l, t);
          } catch (e) {
            a(e);
          }
        }
        (M.options = M.setOptions =
          function (e) {
            var u;
            return v(M.defaults, e), (u = M.defaults), (t.defaults = u), M;
          }),
          (M.getDefaults = i),
          (M.defaults = t.defaults),
          (M.use = function () {
            for (
              var e = M.defaults.extensions || {
                  renderers: {},
                  childTokens: {},
                },
                t = arguments.length,
                u = new Array(t),
                n = 0;
              n < t;
              n++
            )
              u[n] = arguments[n];
            u.forEach(function (t) {
              var u = v({}, t);
              if (
                ((u.async = M.defaults.async || u.async),
                t.extensions &&
                (t.extensions.forEach(function (t) {
                  if (!t.name) throw new Error('extension name required');
                  if (t.renderer) {
                    var u = e.renderers[t.name];
                    e.renderers[t.name] = u
                      ? function () {
                        for (
                          var e = arguments.length, n = new Array(e), r = 0;
                          r < e;
                          r++
                        )
                          n[r] = arguments[r];
                        var i = t.renderer.apply(this, n);
                        return !1 === i && (i = u.apply(this, n)), i;
                      }
                      : t.renderer;
                  }
                  if (t.tokenizer) {
                    if (
                      !t.level ||
                      ('block' !== t.level && 'inline' !== t.level)
                    )
                      throw new Error(
                        "extension level must be 'block' or 'inline'"
                      );
                    e[t.level]
                      ? e[t.level].unshift(t.tokenizer)
                      : (e[t.level] = [t.tokenizer]),
                    t.start &&
                    ('block' === t.level
                      ? e.startBlock
                        ? e.startBlock.push(t.start)
                        : (e.startBlock = [t.start])
                      : 'inline' === t.level &&
                      (e.startInline
                        ? e.startInline.push(t.start)
                        : (e.startInline = [t.start])));
                  }
                  t.childTokens && (e.childTokens[t.name] = t.childTokens);
                }),
                  (u.extensions = e)),
                t.renderer &&
                (function () {
                  var e = M.defaults.renderer || new q(),
                    n = function (u) {
                      var n = e[u];
                      e[u] = function () {
                        for (
                          var r = arguments.length, i = new Array(r), s = 0;
                          s < r;
                          s++
                        )
                          i[s] = arguments[s];
                        var a = t.renderer[u].apply(e, i);
                        return !1 === a && (a = n.apply(e, i)), a;
                      };
                    };
                  for (var r in t.renderer) n(r);
                  u.renderer = e;
                })(),
                t.tokenizer &&
                (function () {
                  var e = M.defaults.tokenizer || new S(),
                    n = function (u) {
                      var n = e[u];
                      e[u] = function () {
                        for (
                          var r = arguments.length, i = new Array(r), s = 0;
                          s < r;
                          s++
                        )
                          i[s] = arguments[s];
                        var a = t.tokenizer[u].apply(e, i);
                        return !1 === a && (a = n.apply(e, i)), a;
                      };
                    };
                  for (var r in t.tokenizer) n(r);
                  u.tokenizer = e;
                })(),
                  t.walkTokens)
              ) {
                var n = M.defaults.walkTokens;
                u.walkTokens = function (e) {
                  var u = [];
                  return (
                    u.push(t.walkTokens.call(this, e)),
                    n && (u = u.concat(n.call(this, e))),
                      u
                  );
                };
              }
              M.setOptions(u);
            });
          }),
          (M.walkTokens = function (e, t) {
            for (
              var u,
                n = [],
                i = function () {
                  var e = u.value;
                  switch (((n = n.concat(t.call(M, e))), e.type)) {
                    case 'table':
                      for (var i, s = r(e.header); !(i = s()).done; ) {
                        var a = i.value;
                        n = n.concat(M.walkTokens(a.tokens, t));
                      }
                      for (var l, o = r(e.rows); !(l = o()).done; )
                        for (var D, c = r(l.value); !(D = c()).done; ) {
                          var h = D.value;
                          n = n.concat(M.walkTokens(h.tokens, t));
                        }
                      break;
                    case 'list':
                      n = n.concat(M.walkTokens(e.items, t));
                      break;
                    default:
                      M.defaults.extensions &&
                      M.defaults.extensions.childTokens &&
                      M.defaults.extensions.childTokens[e.type]
                        ? M.defaults.extensions.childTokens[e.type].forEach(
                          function (u) {
                            n = n.concat(M.walkTokens(e[u], t));
                          }
                        )
                        : e.tokens && (n = n.concat(M.walkTokens(e.tokens, t)));
                  }
                },
                s = r(e);
              !(u = s()).done;

            )
              i();
            return n;
          }),
          (M.parseInline = function (e, t) {
            if (null == e)
              throw new Error(
                'marked.parseInline(): input parameter is undefined or null'
              );
            if ('string' != typeof e)
              throw new Error(
                'marked.parseInline(): input parameter is of type ' +
                Object.prototype.toString.call(e) +
                ', string expected'
              );
            y((t = v({}, M.defaults, t || {})));
            try {
              var u = O.lexInline(e, t);
              return (
                t.walkTokens && M.walkTokens(u, t.walkTokens),
                  U.parseInline(u, t)
              );
            } catch (e) {
              if (
                ((e.message +=
                  '\nPlease report this to https://github.com/markedjs/marked.'),
                  t.silent)
              )
                return (
                  '<p>An error occurred:</p><pre>' +
                  h(e.message + '', !0) +
                  '</pre>'
                );
              throw e;
            }
          }),
          (M.Parser = U),
          (M.parser = U.parse),
          (M.Renderer = q),
          (M.TextRenderer = L),
          (M.Lexer = O),
          (M.lexer = O.lex),
          (M.Tokenizer = S),
          (M.Slugger = P),
          (M.parse = M);
        var Z = M.options,
          j = M.setOptions,
          N = M.use,
          Q = M.walkTokens,
          H = M.parseInline,
          J = M,
          X = U.parse,
          G = O.lex;
        (t.Lexer = O),
          (t.Parser = U),
          (t.Renderer = q),
          (t.Slugger = P),
          (t.TextRenderer = L),
          (t.Tokenizer = S),
          (t.getDefaults = i),
          (t.lexer = G),
          (t.marked = M),
          (t.options = Z),
          (t.parse = J),
          (t.parseInline = H),
          (t.parser = X),
          (t.setOptions = j),
          (t.use = N),
          (t.walkTokens = Q);
      },
    },
    t = {};
  function u(n) {
    var r = t[n];
    if (void 0 !== r) return r.exports;
    var i = (t[n] = { exports: {} });
    return e[n](i, i.exports, u), i.exports;
  }
  (() => {
    const e = u(826),
      t = u(839),
      n = u(314),
      r = u(119);
    !(function () {
      console.log('-> The Tampermonkey script has been loaded');
      const u = window.location.host;
      (0, e.watchIfTableIsMounted)(
        (e) => (
          (0, n.loadStylesheet)(),
            (0, n.createTableHeader)(e, 'Notes'),
            (0, n.createTableHeader)(e, 'Edit'),
            (0, t.createDataTableObserver)(e, () =>
              (0, r.updateDataTableRows)(u, e)
            ),
            () => {
              (0, t.cleanup)();
            }
        )
      );
    })();
  })();
})();


````