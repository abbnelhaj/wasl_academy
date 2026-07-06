import { n as IconSymbol } from "./icons.js";
import { ComponentPropsWithRef, ReactElement } from "react";
/**
* @public
*/
interface IconProps {
  symbol: IconSymbol;
}
/**
* Renders the icon for the given `symbol` from the lazy `icons` map.
*
* While the icon chunk loads, a fallback svg with the exact same shell as every generated
* icon (`data-sanity-icon`, `width`/`height` of `1em`, the shared `viewBox`, and the spread
* props) is rendered, so the icon slot reserves its final size and responds to the same
* styling from the first paint – the way an `<img>` with intrinsic dimensions behaves while
* its `src` is still downloading.
*
* @public
*/
declare function Icon(props: IconProps & ComponentPropsWithRef<"svg">): ReactElement | null;
export { Icon, IconProps };
//# sourceMappingURL=icon.d.ts.map