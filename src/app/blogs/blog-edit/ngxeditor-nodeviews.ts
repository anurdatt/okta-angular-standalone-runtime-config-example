import { javascript } from '@codemirror/lang-javascript';
import { minimalSetup } from 'codemirror';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { CodeMirrorView } from 'prosemirror-codemirror-6';
import { EditorView } from 'prosemirror-view';

const nodeViews = {
  code_mirror: (
    node: ProseMirrorNode,
    view: EditorView,
    getPos: () => number | undefined
  ): CodeMirrorView => {
    return new CodeMirrorView({
      node,
      view,
      getPos,
      cmOptions: {
        extensions: [minimalSetup, javascript()],
      },
    });
  },
};

export default nodeViews;
