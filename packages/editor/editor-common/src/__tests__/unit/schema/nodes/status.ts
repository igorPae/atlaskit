import { name } from '../../../../../package.json';
import { schema, toDOM, fromHTML } from '../../../../../test-helpers';
import { status } from '../../../../../src';

describe(`${name}/schema status node`, () => {
  describe('parse html', () => {
    it('converts to status PM node', () => {
      const doc = fromHTML('<span data-node-type="status" />', schema);
      const node = doc.firstChild!.firstChild!;
      expect(node.type.spec).toEqual(status);
    });

    it('gets attributes from html', () => {
      const color = 'blue';
      const localId = '6c5e5301-1311-42e2-aa80-1b7557140b3d';
      const doc = fromHTML(
        `
        <span
          data-node-type="status"
          data-color="${color}"
          data-local-id="${localId}"
        >
          In progress
        </span>
      `,
        schema,
      );
      const node = doc.firstChild!.firstChild!;
      expect(node.attrs.color).toEqual(color);
      expect(node.attrs.localId).toEqual(localId);
      expect(node.attrs.text).toEqual('In progress');
    });
  });

  describe('encode html', () => {
    it('converts html status attributes to node attributes', () => {
      const attrs = {
        text: 'In progress',
        color: 'blue',
        localId: '3fba07fc-0458-449c-bba9-04d5555164ea',
      };
      const node = schema.nodes.status.create(attrs);
      const dom = toDOM(node, schema).firstChild! as HTMLElement;
      expect(dom.getAttribute('data-node-type')).toEqual('status');
      expect(dom.textContent).toEqual(attrs.text);
      expect(dom.getAttribute('data-color')).toEqual(attrs.color);
      expect(dom.getAttribute('data-local-id')).toEqual(attrs.localId);
    });

    it('encodes and decodes to the same node', () => {
      const attrs = {
        text: 'In progress',
        color: 'blue',
        localId: '3fba07fc-0458-449c-bba9-04d5555164ea',
      };
      const node = schema.nodes.status.create(attrs);
      const dom = toDOM(node, schema).firstChild as HTMLElement;
      const parsedNode = fromHTML(dom.outerHTML, schema).firstChild!
        .firstChild!;
      expect(parsedNode).toEqual(node);
    });
  });
});
