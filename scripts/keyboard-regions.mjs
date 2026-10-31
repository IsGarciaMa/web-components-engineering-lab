/** Añade acceso de teclado a regiones estáticas que pueden tener scroll. */
export function markKeyboardRegions(node) {
  if (node.type === 'element' && ['pre', 'table'].includes(node.tagName)) {
    node.properties ??= {};
    node.properties.tabIndex = 0;
  }
  for (const child of node.children ?? []) markKeyboardRegions(child);
}
export const keyboardRegions = {
  name: 'lab-keyboard-regions',
  element: {
    filter: ['pre', 'table'],
    visit(node, context) {
      context.setProperty(node, 'tabIndex', 0);
    },
  },
};
export const keyboardCode = {
  name: 'lab-keyboard-code',
  hooks: {
    postprocessRenderedBlock: ({ renderData }) =>
      markKeyboardRegions(renderData.blockAst),
  },
};
