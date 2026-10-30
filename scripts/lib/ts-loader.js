/**
 * 測試用：在 Node 裡直接載入 App 的 TypeScript 模組（不需要打包）。
 * 用專案的 TypeScript 轉成 CommonJS，處理 @/ 路徑；只適合沒有用到畫面元件的模組。
 */
const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const ROOT = path.join(__dirname, '..', '..');
const SRC = path.join(ROOT, 'src');
const cache = new Map();

function resolveFile(base) {
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function requireTs(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const source = fs.readFileSync(file, 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: file,
  }).outputText;
  const module = { exports: {} };
  cache.set(file, module);
  const localRequire = (request) => {
    let target = null;
    if (request.startsWith('@/')) target = resolveFile(path.join(SRC, request.slice(2)));
    else if (request.startsWith('.')) target = resolveFile(path.join(path.dirname(file), request));
    if (target) return requireTs(target);
    return require(require.resolve(request, { paths: [ROOT] }));
  };
  new Function('module', 'exports', 'require', '__dirname', js)(
    module,
    module.exports,
    localRequire,
    path.dirname(file),
  );
  return module.exports;
}

/** 載入 src 底下的模組，例如 loadModule('lib/exam-paper') */
function loadModule(name) {
  const file = resolveFile(path.join(SRC, name));
  if (!file) throw new Error(`找不到模組 ${name}`);
  return requireTs(file);
}

module.exports = { loadModule };
