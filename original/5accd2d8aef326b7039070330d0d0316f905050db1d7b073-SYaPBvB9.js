import { a as e } from "./2ca6c54251d6542cb4c1de60673c38c8c09b48cd19fa0b27-DsoJFEEM.js";
console.assert("__eap_only__");
function t(t, n, r) {
  switch (t.kind) {
    case "line":
      return r ? n.paper : n.ink;
    case "eyes":
      return n.ink;
    case "filledMark":
      return r ? n.ink : (n.marksFill ?? n.paper);
    case "spot":
    case "fixed":
      return e(t.hex) ? t.hex : n.ink;
  }
}
export { t };
