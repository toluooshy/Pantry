declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

declare module "react-native-htmlview";
declare module "html-to-text";
declare const onBuffer;
declare const onError;
