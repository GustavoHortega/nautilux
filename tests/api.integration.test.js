jest.mock('../services', () => ({
    createUser: jest.fn(),
    loginUser: jest.fn(),
    addTechnology: jest.fn(),
    updateTechnology: jest.fn(),
    deleteTechnology: jest.fn(),
    checkServiceStatus: jest.fn(),
    checkVulnerability: jest.fn()
}));

jest.mock('../models', () => ({
    User: { findById: jest.fn() }
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const services = require('../services');
const { User } = require('../models');

process.env.JWT_SECRET = 'integration-test-secret';
process.env.JWT_EXPIRES_IN = '1h';

const token = jwt.sign({ userId: 'user-123' }, process.env.JWT_SECRET);

describe('HTTP API integration', () => {
    beforeEach(() => jest.clearAllMocks());

    test('POST /v1/users/create delegates user creation and returns the user', async () => {
        services.createUser.mockResolvedValue({
            _id: 'user-123',
            nickname: 'gustavo',
            email: 'gustavo@example.com'
        });

        const response = await request(app)
            .post('/v1/users/create')
            .send({
                user: {
                    nickname: 'gustavo',
                    email: 'gustavo@example.com',
                    password: 'StrongPass1!'
                }
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe('gustavo@example.com');
    });

    test('POST /v1/users/login returns a token', async () => {
        services.loginUser.mockResolvedValue('signed-token');

        const response = await request(app)
            .post('/v1/users/login')
            .send({ email: 'gustavo@example.com', password: 'StrongPass1!' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true, token: 'signed-token' });
    });

    test('GET /v1/users/me requires authentication', async () => {
        const response = await request(app).get('/v1/users/me');

        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test('GET /v1/users/me returns the authenticated user without password', async () => {
        User.findById.mockReturnValue({
            select: jest.fn().mockResolvedValue({
                _id: 'user-123',
                nickname: 'gustavo',
                email: 'gustavo@example.com'
            })
        });

        const response = await request(app)
            .get('/v1/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe('gustavo@example.com');
    });

    test('POST /v1/users/me/technologies creates a technology for the authenticated user', async () => {
        services.addTechnology.mockResolvedValue({
            _id: 'technology-1',
            name: 'express',
            ecosystem: 'npm',
            version: '4.18.2'
        });

        const response = await request(app)
            .post('/v1/users/me/technologies')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'express', ecosystem: 'npm', version: '4.18.2' });

        expect(response.status).toBe(200);
        expect(services.addTechnology).toHaveBeenCalledWith('user-123', expect.objectContaining({
            name: 'express'
        }));
    });


    test('PATCH /v1/users/me/technologies/:id updates a registered technology', async () => {
        services.updateTechnology.mockResolvedValue({
            _id: 'technology-1',
            name: 'express',
            ecosystem: 'npm',
            version: '4.19.0'
        });

        const response = await request(app)
            .patch('/v1/users/me/technologies/technology-1')
            .set('Authorization', `Bearer ${token}`)
            .send({ version: '4.19.0' });

        expect(response.status).toBe(200);
        expect(services.updateTechnology).toHaveBeenCalledWith(
            'user-123',
            'technology-1',
            { version: '4.19.0' }
        );
    });

    test('DELETE /v1/users/me/technologies/:id removes a registered technology', async () => {
        services.deleteTechnology.mockResolvedValue(true);

        const response = await request(app)
            .delete('/v1/users/me/technologies/technology-1')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(services.deleteTechnology).toHaveBeenCalledWith(
            'user-123',
            'technology-1'
        );
    });

    test('POST /v1/vulnerabilities queries the vulnerability service', async () => {
        services.checkVulnerability.mockResolvedValue([{ osvId: 'OSV-1' }]);

        const response = await request(app)
            .post('/v1/vulnerabilities')
            .send({ package: { name: 'express', ecosystem: 'npm' } });

        expect(response.status).toBe(200);
        expect(response.body.vulnerabilities).toEqual([{ osvId: 'OSV-1' }]);
    });

    test('GET /v1/status/nautilux returns the API health status', async () => {
        const response = await request(app).get('/v1/status/nautilux');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });
});
