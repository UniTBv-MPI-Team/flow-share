import request from 'supertest';
import app from '../../src/server';

describe('Groups Integration', () => {
    let authCookie: string;
    let groupId: number;

    const adminUser = {
        username: 'testuser_groups_admin',
        emailAddress: 'groups_admin@test.com',
        password: 'Password123!'
    };

    const regularUser = {
        username: 'testuser_groups_member',
        emailAddress: 'groups_member@test.com',
        password: 'Password123!'
    };

    beforeAll(async () => {
        await request(app).post('/auth/register').send(adminUser);
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ credentials: adminUser.username, password: adminUser.password });
        const cookieHeader = loginRes.headers['set-cookie'];
        authCookie = Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader;

        await request(app).post('/auth/register').send(regularUser);
    });

    it('authenticated user can create a group', async () => {
        const res = await request(app)
            .post('/api/group')
            .set('Cookie', authCookie)
            .send({ name: 'Test Group', description: 'Integration test group' });
        expect(res.status).toBe(201);
        groupId = res.body.group.id;
    });

    it('creator is automatically admin', async () => {
        const res = await request(app)
            .get(`/api/group/${groupId}`)
            .set('Cookie', authCookie);
        expect(res.status).toBe(200);
        const creator = res.body.members?.find((m: any) => m.user.username === adminUser.username);
        expect(creator?.isAdmin).toBe(true);
    });

    it('unauthenticated user cannot access group', async () => {
        const res = await request(app).get(`/api/group/${groupId}`);
        expect(res.status).toBe(401);
    });

    it('admin can add a member', async () => {
        const res = await request(app)
            .post('/api/group-member')
            .set('Cookie', authCookie)
            .send({ groupId, username: regularUser.username });
        expect(res.status).toBe(201);
    });

    it('cannot add existing member again', async () => {
        const res = await request(app)
            .post('/api/group-member')
            .set('Cookie', authCookie)
            .send({ groupId, username: regularUser.username });
        expect(res.status).toBe(409);
    });

    it('non-admin cannot delete group', async () => {
        const loginRes = await request(app)
            .post('/auth/login')
            .send({ credentials: regularUser.username, password: regularUser.password });
        const cookieHeader = loginRes.headers['set-cookie'];
        const memberCookie = Array.isArray(cookieHeader) ? cookieHeader[0] : cookieHeader;

        const res = await request(app)
            .delete(`/api/group/${groupId}`)
            .set('Cookie', memberCookie);
        expect(res.status).toBe(403);
    });
});
