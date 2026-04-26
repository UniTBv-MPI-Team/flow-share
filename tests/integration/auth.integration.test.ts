import request from 'supertest';
import app from '../../src/server';

describe('Auth Integration', () => {
    const validUser = {
        username: 'testuser_auth',
        emailAddress: 'auth@test.com',
        password: 'Password123!'
    };

    it('registers a new user successfully', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(validUser);
        expect(res.status).toBe(302);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rejects duplicate username', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send(validUser);
        expect(res.status).toBe(400);
    });

    it('rejects missing fields on register', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({ username: 'onlyusername' });
        expect(res.status).toBe(400);
    });

    it('logs in with valid credentials', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ credentials: validUser.username, password: validUser.password });
        expect(res.status).toBe(302);
        expect(res.headers['set-cookie']).toBeDefined();
    });

    it('rejects wrong password', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({ credentials: validUser.username, password: 'wrongpass' });
        expect(res.status).toBe(401);
    });

    it('blocks protected route without token', async () => {
        const res = await request(app).get('/api/group');
        expect(res.status).toBe(401);
    });
});
