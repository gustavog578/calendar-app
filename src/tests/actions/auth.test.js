import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

// get typed helpers
import '@testing-library/jest-dom'
import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';


// return an object, the function must have ()
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}))

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initState = {};
let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

let token = '';

describe('Auth actions Tests', () => {

    beforeEach( () => {
        store = mockStore( initState );
        //clean mocks inside cycle life
        jest.clearAllMocks()
    })

    test('startLogin should work ', async() => {

        await store.dispatch( startLogin('email2@test.com', '123456') )
        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
             payload: {
                 uid: expect.any(String),
                 name: expect.any(String)
             }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any(String));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    
        token = localStorage.setItem.mock.calls[0][1]; //is an Array of calls
        
    })
    
  

    test('startLogin should fail ', async() => {
        
        await store.dispatch( startLogin('email2@test.com', '12345678') )
        let actions = store.getActions();
        
        expect( actions ).toEqual( [] )
        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'Invalid password', 'error' )

        await store.dispatch( startLogin('email222@test.com', '12345678') )
        actions = store.getActions();

        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'The user is incorrect', 'error')

    })

    test('startRegister should work fine', async() => {
        // mock available only in this test
        // rebuild .json() 
        fetchModule.fetchWithoutToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '1234',
                    name: "Alberto",
                    token: 'ABC123'
                }
            }
        })) 

        await store.dispatch( startRegister('ema2@test.com', '123456', 'test') )
        let actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '1234',
                name: "Alberto"
            }
        } )
       
        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABC123');
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any(Number));
    

    })

    test('startChecking should works fine', async() => {

        fetchModule.fetchWithToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '1234',
                    name: "Alberto",
                    token: 'ABC123'
                }
            }
        })) 

        await store.dispatch( startChecking() );

        const actions = store.getActions();
        
        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '1234',
                name: "Alberto"
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABC123');
        
    })
    


})
