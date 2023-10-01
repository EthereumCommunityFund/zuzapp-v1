interface RenderHTMLStringProps {
  htmlString: string;
  height: string;
}

export default function RenderHTMLString({ htmlString, height }: RenderHTMLStringProps): JSX.Element {
  return <div className={`h-[${height}px] overflow-y-auto`} dangerouslySetInnerHTML={{ __html: htmlString }} />;
}