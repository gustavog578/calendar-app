import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import moment from 'moment';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// get typed helpers

import '@testing-library/jest-dom'
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdate } from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';


jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
    
}))



// Mock de la funcion eventStartUpdate
jest.mock('../../../actions/events', () =>( {
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
    
}))


const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );


const now = moment().minutes(0).seconds(0).add(1,'hours'); //19:00
const nowPlus1 = now.clone().add(1, 'hours');

const initState = {
    calendar:  {
        events: [],
        activeEvent: {
            title: 'Hello world',
            notes: 'Some notes',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Tavo'
    },
    ui: {
        modalOpen: true
    }
};
const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider>
)

describe('<CalendarModal /> tests', () => {

    afterEach( () => {
        jest.clearAllMocks()
    })
    test('should show modal', () => {

       //Not to use snapshot, there's date, wich change constantly
        expect( wrapper.find('Modal').prop('isOpen') ).toBe( true );
        
    });

    test('should call update/close actions', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( eventStartUpdate ).toHaveBeenCalledWith( initState.calendar.activeEvent )
        expect( eventClearActiveEvent ).toHaveBeenCalled()
        
    })
    
    test('should show error if no title', () => {
        
        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( wrapper.find('input[name="title"]').hasClass('is-invalid') ).toBe( true );

    })

    test('should create a new event', () => {
        // if create a new event, the environment change
        const initState = {
            calendar:  {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '123',
                name: 'Tavo'
            },
            ui: {
                modalOpen: true
            }
        };
        const store = mockStore( initState );
        store.dispatch = jest.fn();
        
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider>
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'testing'
            }
        });

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( eventStartAddNew ).toHaveBeenCalledWith({ 
            end: expect.anything(),             
            start: expect.anything(), 
            title: 'testing',
            notes: '', 
        })

        expect( eventClearActiveEvent ).toHaveBeenCalled();
        
    })
    
    test('should validate dates ', () => {

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'testing'
            }
        });

        const today = new Date();

        act( () => {            
            wrapper.find('DateTimePicker').at(1).prop('onChange')(today);            
        })

        wrapper.find('form').simulate('submit', {
            preventDefault(){}
        });

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "La fecha fin debe ser mayor a la fecha de inicio", "error")
        
       
        
    })
            
    
})
