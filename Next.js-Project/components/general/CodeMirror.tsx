import React, { useEffect } from "react";
import { UnControlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/markdown/markdown";

interface MyProps {
  value: string;
  onChange: (text: string) => void;
  className: string;
}

export default (props: React.PropsWithChildren<MyProps>) => {
  let instance: CodeMirror.Editor;

  useEffect(() => {
    instance.setSize("100%", "800px");
  }, []);

  return (
    <div id="editor">
      <style jsx>{`
        div {
          font-size: 150%;
        }
      `}</style>
      <CodeMirror
        {...props}
        className={props.className}
        editorDidMount={(editor) => {
          instance = editor;
        }}
        value={props.value}
        options={{ theme: "zenburn", mode: "markdown" }}
        onChange={(editor, data, value) => props.onChange(value)}
        autoCursor={false}
      />
    </div>
  );
};
