import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';


import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// get typed helpers
import '@testing-library/jest-dom'
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

// Mock de la funcion eventStartDelete
jest.mock('../../../actions/events', () =>( {
    eventStartDelete: jest.fn()
}))

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );
store.dispatch = jest.fn();

const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFab />
    </Provider>
)


describe('Component <DeleteEventFab /> tests', () => {

    test('should show yourself correctly', () => {

        expect( wrapper ).toMatchSnapshot();
    })

    test('should call eventStartDelete on click', () => {

        wrapper.find('.fab-danger').simulate('click');
        // Cuando se dispara una accion que contiene otra accion dentro
        // realizamos el mock entero a eventStartDelete

        expect( eventStartDelete ).toHaveBeenCalled();

    })
    
    
    
})
