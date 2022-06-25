/**
 * Return full height of an element including border, padding and margin.
 *
 * See: https://stackoverflow.com/questions/10787782/full-height-of-a-html-element-div-including-border-padding-and-margin
 */
export function getElementAbsoluteHeight(el: string | Element): number {
  // Get the DOM Node if you pass in a string
  if (typeof el === "string") {
    el = document.querySelector(el) as Element;
  }
  // el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin =
    parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil((el as Element).getBoundingClientRect().height + margin);
}
