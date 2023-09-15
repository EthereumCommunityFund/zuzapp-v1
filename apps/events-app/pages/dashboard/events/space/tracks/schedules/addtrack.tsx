import AddTrackForm from "@/components/tracks/AddTrackForm";
import Container from "@/components/ui/Container";
import EditionForm from "@/components/ui/EditionForm";

export default function AddTrack() {
  return (
    <EditionForm>
      <AddTrackForm onTrackSubmit={function (values: { image: string; name: string; description: string; }): void {
        throw new Error("Function not implemented.");
      }} />
    </EditionForm>
  )
}