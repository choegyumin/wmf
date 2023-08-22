import setInnerHTML from './setInnerHTML.js';

function getKey(element: ChildNode): string | null {
  return element instanceof Element ? element.getAttribute('key') : null;
}

function patchAttributes(oldNode: Element, newNode: Element): void {
  const oldAttributes = [...oldNode.attributes];
  const newAtributes = [...newNode.attributes];

  for (const { name } of oldAttributes) {
    if (newNode.hasAttribute(name)) continue;
    oldNode.removeAttribute(name);
  }
  for (const { name, value } of newAtributes) {
    if (oldNode.getAttribute(name) === value) continue;
    oldNode.setAttribute(name, value);
  }
}

function insertNode<T extends ChildNode>(parent: ParentNode, node: T, prevNode: ChildNode | null): T {
  if (prevNode != null) {
    if (prevNode.nextSibling !== node) prevNode.after(node);
  } else {
    if (parent.lastChild !== node) parent.append(node);
  }
  return node;
}

function createNode<T extends ChildNode>(parent: ParentNode, node: T): T {
  parent.append(node);
  return node;
}

function removeNode(node: ChildNode): null {
  node.remove();
  return null;
}

function patchTextNode<T extends Text>(oldNode: T, newNode: T): T {
  if (oldNode.nodeValue !== newNode.nodeValue) oldNode.nodeValue = newNode.nodeValue;
  return oldNode;
}

function patchElementNode<T extends Element>(oldNode: T, newNode: T): T {
  patchAttributes(oldNode, newNode);
  updateNodeList(oldNode, [...newNode.childNodes]);
  return oldNode;
}

function replaceNode<T extends ChildNode>(oldNode: ChildNode, newNode: T): T {
  if (oldNode !== newNode) {
    oldNode.after(newNode);
    oldNode.remove();
  }
  return newNode;
}

function updateNode<T extends ChildNode>(oldNode: T, newNode: T): T {
  if (oldNode instanceof Text && newNode instanceof Text) {
    return patchTextNode(oldNode, newNode);
  }
  if (oldNode instanceof Element && newNode instanceof Element && oldNode.nodeName === newNode.nodeName) {
    return patchElementNode(oldNode, newNode);
  }
  return replaceNode<T>(oldNode, newNode);
}

function updateNodeList(parent: ParentNode, nodeList: ChildNode[] | NodeListOf<ChildNode>): void {
  const oldNodes = [...parent.childNodes];
  const newNodes = [...nodeList];

  let lastNode: ChildNode | null = null;

  while (newNodes.length > 0) {
    const oldNode = oldNodes[0];
    const newNode = newNodes[0];

    const oldNodeKey = getKey(oldNode);
    const newNodeKey = getKey(newNode);

    lastNode =
      (() => {
        // Remove old node
        if (oldNode != null && newNode == null) {
          oldNodes.shift();
          return removeNode(oldNode);
        }

        // Create new node
        if (oldNode == null && newNode != null) {
          newNodes.shift();
          return createNode(parent, newNode);
        }

        // Update matched node
        if (newNodeKey != null && oldNodeKey === newNodeKey) {
          oldNodes.shift();
          newNodes.shift();
          return updateNode(oldNode, newNode);
        }

        // Update matched node and Move it
        const matchedIndex = newNodeKey != null ? oldNodes.findIndex((el) => getKey(el) === newNodeKey) : -1;
        if (matchedIndex !== -1) {
          const [metchedNode] = oldNodes.splice(matchedIndex, 1);
          newNodes.shift();
          const updatedNode = updateNode(metchedNode, newNode);
          insertNode(parent, updatedNode, lastNode);
          return updatedNode;
        }

        // Insert non-matched node
        if (newNodeKey != null || (oldNodeKey != null && newNodeKey == null)) {
          newNodes.shift();
          insertNode(parent, newNode, lastNode);
          return newNode;
        }

        // Just update node, If none of the conditions apply.
        oldNodes.shift();
        newNodes.shift();
        return updateNode(oldNode, newNode);
      })() ?? lastNode;
  }

  while (oldNodes.length > 0) {
    const oldNode = oldNodes.shift()!;
    // Remove unprocessed old nodes
    removeNode(oldNode);
  }
}

export default function updateChildNodes(element: ParentNode, html: string): void {
  const newNodes = (() => {
    const temp = document.createDocumentFragment();
    setInnerHTML(temp, html);
    return [...temp.childNodes];
  })();

  updateNodeList(element, newNodes);
}
