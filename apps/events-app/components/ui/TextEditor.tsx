import dynamic from "next/dynamic";
import { useState } from "react";

const ReactQuillNoSSR = dynamic(() => import('react-quill'), { ssr: false });

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = ({ value, onChange }) => {
  const [editorHeight, setEditorHeight] = useState('300px');

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const initialY = e.clientY;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = `${parseInt(editorHeight) + e.clientY - initialY}px`;
      // if (parseInt(newHeight) >= 300) {
      //   return;
      // }

      // if (parseInt(newHeight) <= 50) {
      //   return;
      // }
      setEditorHeight(newHeight);
      console.log("initialY:", initialY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };



    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ size: [] }],
      [{ font: [] }],
      [{ align: ["right", "center", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      [{ color: ["red", "#785412"] }],
      [{ background: ["red", "#785412"] }]
    ]
  }

  const formats = [
    "header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "link", "color", "image", "background", "align", "size", "font"
  ]
  return (
    <div className="w-full flex flex-col gap-2 relative">
      <div
        className="resize-handle"
        onMouseDown={handleMouseDown}
        style={{ cursor: 'nwse-resize', width: '10px', height: '10px', background: '#ccc', position: 'absolute', right: 0, bottom: 0 }}
      />
      <ReactQuillNoSSR
        className={"w-full flex flex-col gap-2"}
        style={{ height: editorHeight, resize: 'none' }}
        placeholder={"Enter Description"}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default TextEditor;
