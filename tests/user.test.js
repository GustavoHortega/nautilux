jest.mock('../models', () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn()
    }
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn()
}));

jest.mock('../auth', () => ({
    generateToken: jest.fn(() => 'test-jwt-token')
}));

const { User } = require('../models');
const bcrypt = require('bcrypt');
const { generateToken } = require('../auth');
const { createUser, loginUser } = require('../services/user');

describe('User service', () => {
    beforeEach(() => jest.clearAllMocks());

    test('creates a user with a hashed password and omits the password from the result', async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue('hashed-password');
        User.create.mockResolvedValue({
            toObject: () => ({
                _id: 'user-id',
                nickname: 'gustavo',
                email: 'gustavo@example.com',
                password: 'hashed-password'
            })
        });

        const result = await createUser({
            nickname: 'gustavo',
            email: 'gustavo@example.com',
            password: 'StrongPass1!'
        });

        expect(bcrypt.hash).toHaveBeenCalledWith('StrongPass1!', 10);
        expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
            password: 'hashed-password'
        }));
        expect(result).not.toHaveProperty('password');
    });

    test('rejects a weak password', async () => {
        await expect(createUser({
            nickname: 'gustavo',
            email: 'gustavo@example.com',
            password: 'weak'
        })).rejects.toThrow('Password must contain at least 8 characters');
        expect(User.create).not.toHaveBeenCalled();
    });

    test('rejects an existing email', async () => {
        User.findOne
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce({ _id: 'existing-user' });

        await expect(createUser({
            nickname: 'gustavo',
            email: 'gustavo@example.com',
            password: 'StrongPass1!'
        })).rejects.toThrow('This user already exists');
    });

    test('returns a JWT when credentials are valid', async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-id',
                password: 'hashed-password'
            })
        });
        bcrypt.compare.mockResolvedValue(true);

        await expect(loginUser('gustavo@example.com', 'StrongPass1!'))
            .resolves.toBe('test-jwt-token');

        expect(generateToken).toHaveBeenCalledWith({ userId: 'user-id' });
    });

    test('rejects invalid credentials', async () => {
        User.findOne.mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        await expect(loginUser('wrong@example.com', 'wrong'))
            .rejects.toThrow('Invalid email or password.');
    });
});
