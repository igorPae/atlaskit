import DefaultExport from '../..';
import EmojiPicker from '../../components/picker/EmojiPicker';
import { name } from '../../../package.json';
import { expect } from 'chai';

describe(name, () => {
  describe('exports', () => {
    it('should not export a base component', () => {
      expect(DefaultExport).to.equal(EmojiPicker);
    });
  });
});
