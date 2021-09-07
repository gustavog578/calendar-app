import { fetchWithoutToken, fetchWithToken } from "../../helpers/fetch"

describe('Tests in helpers', () => {

    let token = '';

    test('Fetch without token should work', async() => {

        const resp = await fetchWithoutToken('auth', { email: 'email2@test.com', password: '123456' }, 'POST');

        expect( resp instanceof Response).toBe( true )

        const body = await resp.json();
        expect( body.ok ).toBe( true )

        token = body.token;
        
    })

     test('Fetch without token should work', async() => {

        const resp = await fetchWithToken('events/6130a0faf28a2e755f657856', {}, 'DELETE');
        const body = await resp.json();
        
        expect( body.msg ).toBe( 'No token available');

    })
    
    
})
