import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';
import { messages } from '../../helpers/calendar-messages-ES';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { AddNewFab } from '../ui/AddNewFab';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { DeleteEventFab } from '../ui/DeleteEventFab';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment) // or globalizeLocalizer


export const CalendarScreen = () => {

    const dispatch = useDispatch();

    const { events, activeEvent } = useSelector(state => state.calendar)
    const { uid } = useSelector( state => state.auth );

    const [lastView, setlastView] = useState(  localStorage.getItem('lastView') || 'month' )

    useEffect(() => {
        dispatch( eventStartLoading() )
    }, [dispatch])

    const onDoubleClick = (e) => {

       dispatch( uiOpenModal() );
    }

    const onSelectEvent = (e) => {

        dispatch( eventSetActive(e) );
    }

    const onViewChange = (e) => {
        setlastView(e)
        localStorage.setItem('lastView', e)
    }
    // TODO: al tocar un slot vacio colocar las fechas correspondientes al slot en el formulario
    const onSelectSlot = ( e ) => {

        dispatch( eventClearActiveEvent() )
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {
        
        const style = {
            backgroundColor :  (uid === event.user._id) ? '#367cf7' : '#465650',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
           <Navbar />
           <Calendar
                localizer={ localizer }
                events={ events }
                messages={ messages }
                startAccessor="start"
                endAccessor="end"          
                eventPropGetter ={ eventStyleGetter } 
                onDoubleClickEvent = { onDoubleClick }
                onSelectEvent = { onSelectEvent }
                onSelectSlot= { onSelectSlot }
                selectable= { true }
                onView = { onViewChange }
                view = { lastView }
                components= {{ 
                    event: CalendarEvent 
                }}
            />
           
           
           <AddNewFab />
            {
               ( activeEvent ) && <DeleteEventFab />

            }
           
           
           <CalendarModal />


        </div>
    )
}
