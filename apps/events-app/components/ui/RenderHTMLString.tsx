interface RenderHTMLStringProps {
  htmlString: string;
  height?: string;
}

export default function RenderHTMLString({ htmlString, height }: RenderHTMLStringProps): JSX.Element {
  const removeStyleAttribute = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('*[style]');

    elementsWithStyle.forEach((element) => {
      element.removeAttribute('style');
    });

    return doc.body.innerHTML;
  };
  const sanitizedHTML = removeStyleAttribute(htmlString);

  return height ? (
    <div className={`md:h-[500px] h-[80vh] overflow-y-auto text-white`} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  ) : (
    <div className={`overflow-y-auto text-white md:w-full`} dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
}
