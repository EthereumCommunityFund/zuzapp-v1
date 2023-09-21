export default function UserFacingTrack() {
  return (
    <div className="flex flex-col p-4 rounded-2xl">
      <div className="flex gap-4">
        <div className="flex flex-col gap-1 rounded-[10px] p-2.5">
          <span className="font-bold">8</span>
          <span className="font-bold">Oct.</span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex gap-2.5">
            <span>RECURRING</span>
            <span>TRACK/THEME</span>
          </div>
          <span className="font-semibold">Autonomous World's Assembly</span>
          <div className="flex gap-2.5">
            <span>November</span>
            <span>00:00 AM - 00:00 PM</span>
          </div>
          <div className="flex gap-[3px]">

          </div>
        </div>
      </div>
    </div>
  )
}