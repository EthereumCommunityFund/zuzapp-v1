import ButtonWithDescription from "@/components/templates/ButtonWithDescription";

interface IProps {
  type: string,
  name: string,
}

export default function EventSpaceDashboard (props: IProps) {
  const { type, name } = props;

  return (
    <div className="flex flex-col p-10 items-center gap-[10px] self-stretch">
      {
        type === "new" ? (
          <ButtonWithDescription name="New" />
        ) : (
          <>
            <ButtonWithDescription name="Event Visibility"/>
            <ButtonWithDescription name="Event Space Details"/>
          </>
        )
      }
      <ButtonWithDescription name="Open Settings"/>
    </div>
  )
}