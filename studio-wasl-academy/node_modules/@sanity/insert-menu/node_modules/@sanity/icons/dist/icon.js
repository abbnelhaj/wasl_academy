import { icons } from "./icons.js";
import { Suspense } from "react";
import { jsx } from "react/jsx-runtime";
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
function Icon(props) {
	let { symbol, ...restProps } = props, IconComponent = icons[symbol];
	return IconComponent ? /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("svg", {
			"data-sanity-icon": symbol,
			width: "1em",
			height: "1em",
			viewBox: "0 0 25 25",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			...restProps
		}),
		children: /* @__PURE__ */ jsx(IconComponent, { ...restProps })
	}) : null;
}
export { Icon };

//# sourceMappingURL=icon.js.map