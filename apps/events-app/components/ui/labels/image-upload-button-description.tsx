interface IImageUploadButtonDescription {
  name: string;
}
export default function ImageUploadButtonDescription(
  props: IImageUploadButtonDescription
) {
  const { name } = props;
  return (
    <div className="opacity-70 h-3 font-normal text-[10px] leading-3">
      {name}
    </div>
  );
}
