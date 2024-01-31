interface RenderHTMLStringProps {
  htmlString: string;
}

export default function RenderHTMLString({ htmlString }: RenderHTMLStringProps): JSX.Element {
  const removeStyleAttribute = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const elementsWithStyle = doc.querySelectorAll('*[style]');

    elementsWithStyle.forEach((element) => {
      element.removeAttribute('style');
    });

    return doc.body.innerHTML;
  };

  const sanitizedHTML = removeStyleAttribute(htmlString);

  return <div className="text-white" dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
}
