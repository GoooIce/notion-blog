import React from 'react';
import components from '../../components/dynamic';

// function applyTags(tags = [], children, noPTag = false, key) {
//   let child = children

//   for (const tag of tags) {
//     const props: { [key: string]: any } = { key }
//     let tagName = tag[0]

//     if (noPTag && tagName === 'p') tagName = React.Fragment
//     if (tagName === 'c') tagName = 'code'
//     if (tagName === '_') {
//       tagName = 'span'
//       props.className = 'underline'
//     }
//     if (tagName === 'a') {
//       props.href = tag[1]
//     }
//     if (tagName === 'e') {
//       tagName = components.Equation
//       props.displayMode = false
//       child = tag[1]
//     }

//     child = React.createElement(components[tagName] || tagName, props, child)
//   }
//   return child
// }

function richText(richText: {}, key): React.ReactNode {
  let color = 'color_default';

  if (richText['annotations']?.color) {
    color = `color_${richText['annotations'].color}`;
  }

  let child = React.createElement(
    'span',
    { className: color, key: `${key}-span` },
    richText[richText['type']].content
  );

  if (richText['annotations']?.bold) {
    child = React.createElement(
      'strong',
      { className: '', key: `${key}-strong` },
      child
    );
  }

  if (richText['annotations']?.italic) {
    child = React.createElement(
      'i',
      { className: '', key: `${key}-italic` },
      child
    );
  }

  if (richText['annotations']?.strikethrough) {
    child = React.createElement(
      's',
      { className: '', key: `${key}-strikethrough` },
      child
    );
  }

  if (richText['annotations']?.underline) {
    child = React.createElement(
      'em',
      { className: '', key: `${key}-underline` },
      child
    );
  }

  if (richText['annotations']?.code) {
    child = React.createElement(
      'code',
      { className: '', key: `${key}-code` },
      child
    );
  }

  return child;
}

export function textBlock(text: any[] = [], noPTag = false, mainKey: any) {
  const children: React.ReactNode[] = [];
  let key = 0;

  for (const textItem of text) {
    key++;
    children.push(richText(textItem, key));
  }
  return React.createElement(
    noPTag ? React.Fragment : components.p,
    { key: mainKey },
    ...children
  );
}
