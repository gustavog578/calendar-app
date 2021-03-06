import { authReducer } from "../../reducers/authReducer"
import { types } from "../../types/types";

describe('authReducer.js tests', () => {

    const initState = { 
        checking: true
    }
    
    test('should return a deafult state', () => {

        const action = {};  
        
        const state = authReducer( initState, action );

        expect( state ).toEqual( initState );
        
    })

    test('should authenticate the user', () => {

        const action = {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Tavo'
            }
        }
        const state = authReducer( initState, action);

        expect( state ).toEqual({ checking: false, uid: '123', name: 'Tavo' })
        
    })
    
    
    
})
