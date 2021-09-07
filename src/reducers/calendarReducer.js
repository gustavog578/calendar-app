import { types } from '../types/types';

/*
 {
            id: 'jhjhfghjfh',
            title: 'Cumpleaños del jefe',
            start: moment().toDate(),
            end: moment().add(2, 'hours').toDate(),
            notes: 'Comprar la torta',
            user : {
                _id : 123,
                name: 'Gustavo'
            }
        }

*/

const initialState = {
     events: [] ,
     activeEvent: null    
};

export const CalendarReducer = ( state = initialState, action) => {
   

    switch (action.type) {
        
        case types.eventSetActive:
            return {
                ...state,
                activeEvent : action.payload
            }
        case types.eventAddNew:
            return {
                ...state,
                events: [
                    ...state.events,
                    action.payload
                ]
            }

        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null
            }    
        
        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    e => ( e.id === action.payload.id ) ? action.payload : e
                )
            } 
        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    e => ( e.id !== state.activeEvent.id )
                ),
                activeEvent: null
            }   
         
        case types.eventsLoaded:
            return {
                ...state,
                events: [ ...action.payload]

            }    
        case types.eventLogout: 
            return {
                ...{ initialState }
            }   
            
            
        default:
            return state;
    }
}