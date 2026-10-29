// MathLive's <math-field> element, for JSX.
type Props = import("react").DetailedHTMLProps<
  import("react").HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace -- JSX elements are typed in React's JSX namespace.
  namespace JSX {
    interface IntrinsicElements {
      "math-field": Props & {
        class?: string | undefined;
        "read-only"?: string | undefined;
      };
    }
  }
}

export {};
