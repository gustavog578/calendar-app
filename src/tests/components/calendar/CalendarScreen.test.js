import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';


import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// get typed helpers
import { act } from '@testing-library/react';
import '@testing-library/jest-dom'
import { CalendarScreen } from '../../../components/calendar/CalendarScreen';
import { messages } from '../../../helpers/calendar-messages-ES';
import { types } from '../../../types/types';
import { eventSetActive, eventStartLoading } from '../../../actions/events';




// Mock de la funcion eventSetActive
jest.mock('../../../actions/events', () =>( {
    eventSetActive: jest.fn(),
    eventStartLoading: jest.fn()
}))

Storage.prototype.setItem = jest.fn();

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {
    calendar:  {
        events: []
    },
    auth: {
        uid: '123',
        name: 'Tavo'
    },
    ui: {
        openModal: false
    }
};
const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <CalendarScreen />
    </Provider>
)




describe('<CalendarScreen /> tests', () => {

    test('should show correctly', () => {

        expect( wrapper ).toMatchSnapshot()
        
    })

    test('Calendar component interaction test  ', () => {

        const calendar = wrapper.find('Calendar');

        const calendarMessages = calendar.prop('messages');
        expect( calendarMessages ).toEqual( messages )

        calendar.prop('onDoubleClickEvent')();
        expect( store.dispatch ).toHaveBeenCalledWith({ type: types.uiOpenModal });

        calendar.prop('onSelectEvent')({ start: 'hola'});
        expect( eventSetActive ).toHaveBeenCalledWith( {start: 'hola'})

        act( () => {
            calendar.prop('onView')('week');
            expect( localStorage.setItem ).toHaveBeenCalledWith('lastView', 'week')
        })
        
        
    })
    
    
    
})