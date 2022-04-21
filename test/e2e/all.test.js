import userTests from './user'
import requestTests from './request'
import commentTests from './comment'

/*
1. User 'Customer' should register with a valid { name, email, password, phone }
2. User 'MOD' should register with a valid { name, email, password, phone }
3. Users should login with their credentials
4. Customer creates a Request
5. Mod adds a comment
6. Customer accepts the comment
7. MOD fulfills the request
8. Payment is done
9. MOD takes his money
*/
describe('User:', userTests)
describe('Request:', requestTests)
describe('Comment:', commentTests)