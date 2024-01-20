// import { ScheduleDetailstype } from '@/types';

// const CalendarGrid = ({ sessionsGroupedByDate }: ScheduleDetailstype) => {
//   const renderCalendarCells = () => {
//     const cells = [];
//     // Assuming 30 days in a month for simplicity
//     for (let day = 1; day <= 30; day++) {
//       const dateKey = `2024-01-${day.toString().padStart(2, '0')}`; // Format as needed
//       const sessionsForDay = sessionsGroupedByDate[dateKey] || [];

//       cells.push(
//         <div key={day} className="flex flex-col border p-2">
//           <div className="font-bold text-lg">{day}</div>
//           {sessionsForDay.map((session, idx) => (
//             <div key={idx} className="mt-2 bg-blue-100 p-2 rounded">
//               {session.title}
//               {/* Add more session details here as needed */}
//             </div>
//           ))}
//         </div>
//       );
//     }
//     return cells;
//   };

//   return <div className="grid grid-cols-7 gap-4 mt-4">{renderCalendarCells()}</div>;
// };

// export default CalendarGrid;
