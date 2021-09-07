import React from 'react';
import Swal, { fire } from 'sweetalert2';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// get typed helpers
import '@testing-library/jest-dom'
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';

 
jest.mock('../../../actions/auth', () => ( {
    startLogin: jest.fn(),
    startRegister: jest.fn(),
}))

jest.mock('sweetalert2', () => ( {
    fire: jest.fn()
}))

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );
store.dispatch = jest.fn();


//Global wrapper - the state doesn't change
const wrapper = mount(
    <Provider store={ store }>
        <LoginScreen />
    </Provider>
)


describe(' <LoginScreen /> tests', () => {

    // Using mocks: Always clear mocks before exectution test
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should show correctly', () => {
        
        expect( wrapper ).toMatchSnapshot();
    })

    test('should call login dispatch', () => {

        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'maria@test.com', 
            }
        });

        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '123456', 
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault(){}
        })

        expect( startLogin ).toHaveBeenCalledWith('maria@test.com', '123456')
        
    })
    
    
    test('No register if the passwords does not match', () => {
      
        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456', 
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '1234567', 
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });

        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith( 'Error', 'Passwords does not match', 'error' )
    })

    test('Register if the passwords match', () => {
        
      
        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '123456', 
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '123456', 
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault(){}
        });

       
        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegister ).toHaveBeenCalledWith('maria@test.com', '123456', 'Maria');
    })
    
})
