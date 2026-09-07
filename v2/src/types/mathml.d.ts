import type { AriaAttributes, Key, ReactNode } from "react";

type MathMLBaseProps = {
  children?: ReactNode;
  key?: Key | null;
};

type MathMLMathProps = MathMLBaseProps & {
  "aria-hidden"?: AriaAttributes["aria-hidden"];
  display?: "block" | "inline";
};

type MathMLSpaceProps = MathMLBaseProps & {
  width?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      math: MathMLMathProps;
      mrow: MathMLBaseProps;
      mi: MathMLBaseProps;
      mn: MathMLBaseProps;
      mo: MathMLBaseProps;
      mspace: MathMLSpaceProps;
      msup: MathMLBaseProps;
    }
  }
}
