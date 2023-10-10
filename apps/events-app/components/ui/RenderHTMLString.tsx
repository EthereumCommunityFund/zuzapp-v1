interface RenderHTMLStringProps {
  htmlString: string;
  height?: string;
}

export default function RenderHTMLString({ htmlString, height }: RenderHTMLStringProps): JSX.Element {
  return (
    height ? (
      <div className={`md:h-[500px] h-[80vh] overflow-y-auto text-white`} dangerouslySetInnerHTML={{ __html: htmlString }} />
    ) : (
      <div className={`overflow-y-auto text-white md:w-full`} dangerouslySetInnerHTML={{ __html: htmlString }} />
    )
  );
}