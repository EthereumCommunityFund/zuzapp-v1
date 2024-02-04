import { Label } from '@/components/ui/label';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { usePublishedEvents } from '@/hooks/usePublishedEvents';
import { useEffect, useState, useRef } from 'react';
import { EventSpaceDetailsType } from '@/types';
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/buttons/Button';
import { on } from 'events';

let _offsetX = 0
let _offsetY = 0

export const getformatColor = (format: string) => {
    const colors = ['bg-red-500', 'bg-red-800', 'bg-lime-500', 'bg-lime-800', 'bg-yellow-500', 'bg-blue-800']

    let sum = 0
    for (let i = 0; i < format.length; i++) {
        sum = format.charCodeAt(i) + sum
    }

    return colors[Math.abs(sum) % colors.length]
}


function EventCalendar() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const currMonth = new Date().getMonth()
    const currYear = new Date().getFullYear()
    const years = [currYear - 1, currYear, currYear + 1]

    const monthBarRef = useRef<HTMLDivElement>(null)
    const eventBarRef = useRef<HTMLDivElement>(null)
    const touchStart = useRef(false)
    const touchStartX = useRef(0)
    const touchStartY = useRef(0)
    const touchStartScrollLeft = useRef(0)
    const touchStartScrollTop = useRef(0)


    const { eventSpaces, isLoading, isError } = usePublishedEvents();
    const [groupedEvents, setGroupEvents] = useState<EventSpaceDetailsType[][]>(months.map(i => []))
    const [typefilter, setTypeFilter] = useState<null | string>(null)
    const [types, setTypes] = useState<string[]>([])
    const [yearFilter, setYearFilter] = useState<number>(currYear)

    const slideToCurrMonth = (toBegin?: boolean) => {
        const scrollBar1 = monthBarRef.current
        const scrollBar2 = eventBarRef.current

        const targetColumnIndex = toBegin ? 0 : currMonth
        const offset = (targetColumnIndex) * 180

        if (scrollBar2?.scrollLeft === 0) {
            scrollBar1!.scrollLeft = offset
            scrollBar2!.scrollLeft = offset

        } else {
            scrollBar1!.scrollLeft = offset
            scrollBar2!.scrollLeft = offset
        }
    }

    const SyncingScrollWithEventBar = (e: any) => {
        const offset = eventBarRef.current!.scrollLeft
        const target = monthBarRef.current!
        if (target?.scrollLeft !== offset) {
            target!.scrollLeft = offset
        }
    }

    const SyncingScrollWithMonthBar = (e: any) => {
        const offset = monthBarRef.current!.scrollLeft
        const target = eventBarRef.current!
        if (target?.scrollLeft !== offset) {
            target!.scrollLeft = offset
        }
    }

    const handleMousedown = (e: any) => {
        // save the initial mouse position
        e.preventDefault()
        touchStart.current = true
        touchStartX.current = e.clientX
        touchStartY.current = e.clientY
        touchStartScrollLeft.current = eventBarRef.current!.scrollLeft
        touchStartScrollTop.current = eventBarRef.current!.scrollTop
    }

    const handleMouseup = (e: any) => {
        // reset the offset values
        e.preventDefault()
        touchStart.current = false

        setTimeout(() => {
            _offsetX = 0
            _offsetY = 0
        }, 300)
    }

    const handleMousemove = (e: any) => {
        // calculate the new scroll position
        e.preventDefault()
        if (touchStart.current) {
            const offsetX = e.clientX - touchStartX.current
            const offsetY = e.clientY - touchStartY.current
            eventBarRef.current!.scrollLeft = touchStartScrollLeft.current - offsetX
            eventBarRef.current!.scrollTop = touchStartScrollTop.current - offsetY

            _offsetX = offsetX
            _offsetY = offsetY
        }
    }

    useEffect(() => {
        if (!!eventBarRef.current && !!monthBarRef.current) {
            eventBarRef.current!.addEventListener('scroll', SyncingScrollWithEventBar, false)
            monthBarRef.current!.addEventListener('scroll', SyncingScrollWithMonthBar, false)

            eventBarRef.current.addEventListener('mousedown', handleMousedown, false)
            eventBarRef.current.addEventListener('mouseup', handleMouseup, false)
            eventBarRef.current.addEventListener('mousemove', handleMousemove, false)
            eventBarRef.current.addEventListener('mouseleave', handleMouseup, false)

            slideToCurrMonth()
        }


        return () => {
            eventBarRef.current?.removeEventListener('scroll', SyncingScrollWithEventBar, false)
            monthBarRef.current?.removeEventListener('scroll', SyncingScrollWithMonthBar, false)

            eventBarRef.current?.removeEventListener('mousedown', handleMousedown, false)
            eventBarRef.current?.removeEventListener('mouseup', handleMouseup, false)
            eventBarRef.current?.removeEventListener('mousemove', handleMousemove, false)
            eventBarRef.current?.removeEventListener('mouseleave', handleMouseup, false)
        }
    }, [monthBarRef, eventBarRef])

    useEffect(() => {
        let _groupedEvents: EventSpaceDetailsType[][] = months.map(i => [])
        let _types: Set<string> = new Set()
        if (!!eventSpaces && eventSpaces?.length) {
            eventSpaces.forEach((e) => {
                const eventYear = new Date(e.start_date).getFullYear()
                const eventMonth = new Date(e.start_date).getMonth()
                if (eventYear === yearFilter) {
                    _groupedEvents[eventMonth].push(e)
                }

                if (e.event_type && e.event_type.length) {
                    e.event_type.forEach((t) => {
                        _types.add(t)
                    })
                }
            })

            setGroupEvents(_groupedEvents)
            setTypes(Array.from(_types))
        }
    }, [eventSpaces, yearFilter])

    return (<div>
        <div className="md:w-5/6 w-[95%] mx-auto">
            <Label className="text-2xl md:text-4xl">Calendar</Label>
            <div className='flex flex-row flex-wrap mt-5'>
                <div onClick={() => setTypeFilter(null)}
                    className={`flex cursor-pointer mb-4 mr-4 select-none items-center text-xs ${!typefilter ? 'text-white' : 'text-white/60'} bg-white/10 rounded-xl py-2 px-3 w-fit font-normal`}>
                    All
                </div>
                {
                    types.map((type, index) => {
                        return <div key={type} onClick={() => setTypeFilter(type)}
                            className={`flex cursor-pointer mb-4 mr-4 select-none items-center text-xs ${typefilter === type ? 'text-white' : 'text-white/60'} bg-white/10 rounded-xl py-2 px-3 w-fit font-normal`}>
                            <i className={`w-3 h-3 ${getformatColor(type)} border-rad rounded-full mr-1`} />
                            {type}
                        </div>
                    })
                }
            </div>
            <YearSelector opts={years} selected={yearFilter} onChange={year => { setYearFilter(year); slideToCurrMonth(year !== currYear) }} />
        </div>
        <div className="md:w-5/6 mx-auto flex overflow-auto flex-row flex-nowrap hide-scroll-bar select-none" ref={monthBarRef}>
            {
                months.map((month, index) => {
                    return <div key={month} className="month-item">
                        <div className={`py-1 px-4 rounded text-xl ${currMonth == index && yearFilter === currYear ? 'text-white bg-emerald-700 font-semibold' : 'text-white/60'}`}>
                            {month}
                        </div>
                    </div>
                })
            }
        </div>
        <div className="bg-black items-start cursor-move md:w-5/6 mx-auto flex overflow-auto flex-row flex-nowrap hide-scroll-bar calendar-event-bar" ref={eventBarRef}>
                {
                    months.map((month, i) => {
                        return <div key={month} className="month-column">
                            {
                                groupedEvents[i].map((event, index) => {
                                    if (typefilter) {
                                        return !!event.event_type && event.event_type.includes(typefilter) ? <EventItem event={event} key={event.id} /> : null
                                    }

                                    return <EventItem event={event} key={event.id} />
                                })
                            }
                        </div>
                    })
                }
            </div>
    </div>)
}

export default EventCalendar


function EventItem({ event }: { event: EventSpaceDetailsType }) {
    const formatTime = (start_date: Date, end_date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const startYear = new Date(start_date).getFullYear()
        const startMonth = months[new Date(start_date).getMonth()]
        const startDate = new Date(start_date).getDate()

        const endYear = new Date(end_date).getFullYear()
        const endMonth = months[new Date(end_date).getMonth()]
        const endDate = new Date(end_date).getDate()

        return `${startMonth} ${startDate} ${startYear !== endYear ? (',' + startYear) : ''} - ${endMonth} ${endDate}, ${endYear}`
    }

    return <Link className='block calendar-event-item bg-zinc-800' href={`/dashboard/eventview/about?event_space_id=${event.id}`}>
        <div className='text-xs mb-2 font-medium text-white/60'>{formatTime(event.start_date, event.end_date)}</div>
        <div className='rounded event-post mb-2'>
            <Image src={event.image_url} alt={event.name} width={160} height={160} />
        </div>
        <div className='text-white/60 text-sm font-semibold mb-2 wekit-box'>{event.name}</div>


        {!!event.eventspacelocation && !!event.eventspacelocation.length &&
            <div className='mb-2 flex flex-row flex-nowrap flex-grow-0'>
                <svg className="flex flex-shrink-0 mr-1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7.99999 1.33334C6.5855 1.33334 5.22895 1.89524 4.22875 2.89543C3.22856 3.89563 2.66666 5.25218 2.66666 6.66667C2.66666 10.2667 7.36666 14.3333 7.56666 14.5067C7.68741 14.61 7.84109 14.6667 7.99999 14.6667C8.15889 14.6667 8.31257 14.61 8.43332 14.5067C8.66666 14.3333 13.3333 10.2667 13.3333 6.66667C13.3333 5.25218 12.7714 3.89563 11.7712 2.89543C10.771 1.89524 9.41448 1.33334 7.99999 1.33334ZM7.99999 13.1C6.57999 11.7667 3.99999 8.89334 3.99999 6.66667C3.99999 5.6058 4.42142 4.58839 5.17156 3.83824C5.92171 3.0881 6.93912 2.66667 7.99999 2.66667C9.06086 2.66667 10.0783 3.0881 10.8284 3.83824C11.5786 4.58839 12 5.6058 12 6.66667C12 8.89334 9.41999 11.7733 7.99999 13.1ZM7.99999 4C7.47257 4 6.957 4.1564 6.51847 4.44942C6.07994 4.74243 5.73814 5.15891 5.53631 5.64618C5.33448 6.13345 5.28167 6.66963 5.38456 7.18691C5.48746 7.70419 5.74143 8.17935 6.11437 8.55229C6.48731 8.92523 6.96247 9.1792 7.47975 9.2821C7.99703 9.38499 8.53321 9.33218 9.02048 9.13035C9.50775 8.92851 9.92422 8.58672 10.2172 8.14819C10.5103 7.70966 10.6667 7.19409 10.6667 6.66667C10.6667 5.95943 10.3857 5.28115 9.88561 4.78105C9.38551 4.28095 8.70723 4 7.99999 4ZM7.99999 8C7.73628 8 7.4785 7.9218 7.25923 7.7753C7.03996 7.62879 6.86907 7.42055 6.76815 7.17691C6.66723 6.93328 6.64083 6.66519 6.69228 6.40655C6.74372 6.14791 6.87071 5.91033 7.05718 5.72386C7.24365 5.53739 7.48123 5.4104 7.73987 5.35896C7.99851 5.30751 8.2666 5.33391 8.51023 5.43483C8.75387 5.53575 8.96211 5.70664 9.10862 5.92591C9.25512 6.14517 9.33332 6.40296 9.33332 6.66667C9.33332 7.02029 9.19285 7.35943 8.9428 7.60948C8.69275 7.85953 8.35361 8 7.99999 8Z" fill="rgb(255 255 255 / 0.6)" />
                </svg>
                <div className='wekit-box text-xs text-white/60'>
                    {event.eventspacelocation[0].name}
                </div>
            </div>
        }

        {!!event.event_type && !!event.event_type.length &&
            <>
                {
                    event.event_type.map((type, index) => {
                        return <div key={type} className={`mb-2 flex flex-row flex-nowrap flex-grow-0 items-center`}>
                            <i className={`w-2 h-2 ${getformatColor(type)} border-rad rounded-full ml-1 mr-2`} />
                            <div className='wekit-box text-xs text-white/60'>
                                {type}
                            </div>
                        </div>
                    })
                }
            </>
        }
    </Link>
}

export function YearSelector({ opts, selected, onChange }: { opts: number[], selected: number, onChange?: (year: number) => void }) {
    return <>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className='text-lg outline-0 flex items-center'>
                {selected}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H11L7.5 10.5L4 6Z" fill="currentColor"></path></svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="flex top-[10px] flex-col items-center self-stretch bg-[#383B3B] rounded-[10px] border border-white/10 backdrop-blur-[20px] mt-4 mr-4 z-50">

                <DropdownMenu.Separator className="stroke stroke-white/10" />
                <div className="flex pt-1.5 pb-3 px-1.5 flex-col items-center gap-[14px] self-stretch">
                    {opts.map((item: number, index: number) => {
                        return (
                            <DropdownMenu.Item
                                key={index}
                                className="outline-0 w-full cursor-pointer shadow-none rounded-[40px] px-3.5 bg-[#383B3B] border-none hover:bg-[#ffffff10] duration-200 text-textSecondary hover:text-textSecondary"
                                onClick={() => {
                                    onChange && onChange(item)
                                }}
                            >{item}</DropdownMenu.Item>

                        );
                    })}
                </div>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </>
}