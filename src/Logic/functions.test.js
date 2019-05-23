let functions = require('./functions.js');

describe('User name input should be defined and not empty.', () => {
    test('User name input should be defined', () => {
        expect(functions.testUserName('name')).toBeDefined();
    });
    test('User name input should be a string', () => {
        expect(typeof(functions.testUserName('name'))).toBe('string');
    });
    test('Empty user name input returns a request to input name', () => {
        expect(functions.testUserName('')).toBe('Please enter your name.')
    });
    test('Entered user name returns accepted message.', () => {
        expect(functions.testUserName('name')).toBe('Name accepted.');
    });
});

describe('Email input only accepts a defined string with an @ symbol.', () => {
    test('Email input should be defined', () => {
        expect(functions.testEmailValidity('asdf')).toBeDefined();
    });
    test('Email input should be a string', () => {
        expect(typeof(functions.testEmailValidity('name@email.com'))).toBe('string');
    });
    test('Empty email input returns a request to input address', () => {
        expect(functions.testEmailValidity('')).toBe('Please enter your email address.');
    })
    test('Email input without @ symbol returns invalid message', () => {
        expect(functions.testEmailValidity('name')).toBe('Invalid email address.');
    });
    test('Valid email input returns the email address', () => {
        expect(functions.testEmailValidity('name@email.com')).toBe('name@email.com');
    });
});

describe('Password input is required and must be 8 characters long.', () => {
    test('Password input should be defined', () => {
        expect(functions.testPassword('asdf')).toBeDefined();
    });
    test('Empty password input returns a request to input password', () => {
        expect(functions.testPassword('')).toBe('Please enter a password.');
    });
    test('A password with length of 7 characters should return a request for longer password', () => {
        expect(functions.testPassword('1234567')).toBe('Please enter a password that is at least 8 characters long.');
    });
    test('Password input includes at least one number.', () => {
        expect(functions.testPassword('password')).toBe('Your password must include at least one number.');
    });
    test('Password must include at least one symbol.', () => {
        expect(functions.testPassword('password7')).toBe('Your password must include one of the following symbols: !?@$#');
    })
    test('Valid password returns acceptance', () => {
        expect (functions.testPassword('password7!')).toBe('Password accepted');
    });
});


