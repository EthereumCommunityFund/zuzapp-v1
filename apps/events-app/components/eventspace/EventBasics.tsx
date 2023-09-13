import SectionInputForm from '../ui/SectionInputForm';
import TextEditor from '../ui/TextEditor';
import EventSpaceLabel from '../ui/labels/event-space-label';
import InputFieldLabel from '../ui/labels/input-field-label';

interface EventBasicsProps {
  name: string;
  startDate: number;
  endDate: number;
}
export default function EventBasics({ name }: EventBasicsProps) {
  return (
    <>
      <EventSpaceLabel name="Event Basics" />
      <div>
        <SectionInputForm title={'Event Space Name'} defaultValue={name} inputType={'input'} />
      </div>
      <div>
        <div className="flex gap-[30px]">
          <SectionInputForm title={'Start Date'} defaultValue={'00-00-0000'} inputType={'calendar'} />
          <SectionInputForm title={'End Date'} defaultValue={'00-00-0000'} inputType={'calendar'} />
        </div>
      </div>
      <SectionInputForm title={'Event Tagline'} defaultValue={'Collest Web3 Events'} inputType={'input'} description={'This will be the short tagline below your event title'} />
      <div>
        <div className="flex flex-col gap-[10px]">
          <InputFieldLabel name="Event Description" />
          <TextEditor
            value={''}
            onChange={function (value: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        </div>
      </div>
    </>
  );
}
