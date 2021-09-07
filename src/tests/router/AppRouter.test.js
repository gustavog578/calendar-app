import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';


import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// get typed helpers
import '@testing-library/jest-dom'
import { AppRouter } from '../../router/AppRouter';

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

// If the state doesn't have initial values 
// it could not to destructure when it run the test

//store.dispatch = jest.fn();

describe('<AppRouter /> tests', () => {

    test('should show Wait...', () => {

        const initState = {
            auth: {
                checking: true
            }
        };

        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        
        expect( wrapper ).toMatchSnapshot(); 
        // o similar
        // expect( wrapper ).find('h5').exists() ).toBe( true )       
        
    })

    test('should show the public path', () => {

        const initState = {
            auth: {
                checking: false,
                uid: null
            }
        };

        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        
        expect( wrapper ).toMatchSnapshot(); 
        expect( wrapper.find('.login-container').exists() ).toBe( true )       
        
    })
    
    test('should show the private path', () => {

        const initState = {
            ui: {
                modalOpen: false
            },
            auth: {
                checking: false,
                uid: '123',
                name: 'Juan'
            },
            calendar: {
                events: []
            }    
        };

        const store = mockStore( initState );

        const wrapper = mount(
            <Provider store={ store }>
                <AppRouter />
            </Provider>
        );
        
        expect( wrapper ).toMatchSnapshot(); 
        expect( wrapper.find('.calendar-screen').exists() ).toBe( true )       
        
    })
    
})
