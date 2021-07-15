export const isScrollable = (element: HTMLElement) => {
    return (element === document.scrollingElement && element.scrollHeight > element.clientHeight) ||
        (element.scrollHeight > element.clientHeight && ["scroll", "auto"].indexOf(getComputedStyle(element).overflowY) >= 0);

}

export const getScrollParent = (node: Node & ParentNode | null): Node & ParentNode | null => {
    if (node == null) {
        return null;
    }
    const htmlElement = node as HTMLElement;

    if (isScrollable(htmlElement)) {
        return node;
    } else {
        return getScrollParent(node.parentNode);
    }
}
