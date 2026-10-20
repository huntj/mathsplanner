// MathLive's <math-field> element, for JSX.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "math-field": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        class?: string | undefined;
        "read-only"?: string | undefined;
      };
    }
  }
}
