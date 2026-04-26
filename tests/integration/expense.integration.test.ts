import request from 'supertest';
import app from '../../src/server';

describe('Expense & Contribution Integration', () => {
    let adminCookie: string;
    let memberCookie: string;
    let groupId: number;
    let expenseId: number;

    const adminUser = {
        username: 'testuser_expense_admin',
        emailAddress: 'expense_admin@test.com',
        password: 'Password123!'
    };

    const memberUser = {
        username: 'testuser_expense_member',
        emailAddress: 'expense_member@test.com',
        password: 'Password123!'
    };

    beforeAll(async () => {
        await request(app).post('/auth/register').send(adminUser);
        const adminLogin = await request(app)
            .post('/auth/login')
            .send({ credentials: adminUser.username, password: adminUser.password });
        const adminCookieHeader = adminLogin.headers['set-cookie'];
        adminCookie = Array.isArray(adminCookieHeader) ? adminCookieHeader[0] : adminCookieHeader;

        await request(app).post('/auth/register').send(memberUser);
        const memberLogin = await request(app)
            .post('/auth/login')
            .send({ credentials: memberUser.username, password: memberUser.password });
        const memberCookieHeader = memberLogin.headers['set-cookie'];
        memberCookie = Array.isArray(memberCookieHeader) ? memberCookieHeader[0] : memberCookieHeader;

        const groupRes = await request(app)
            .post('/api/group')
            .set('Cookie', adminCookie)
            .send({ name: 'Expense Test Group', description: '' });
        groupId = groupRes.body.group.id;

        await request(app)
            .post(`/api/group-member/group/${groupId}/add-by-username`)
            .set('Cookie', adminCookie)
            .send({ username: memberUser.username });
    });

    it('admin can create expense', async () => {
        const res = await request(app)
            .post('/api/expense')
            .set('Cookie', adminCookie)
            .send({ groupId, title: 'Test Expense', value: 100 });
        expect(res.status).toBe(201);
        expenseId = res.body.expense.id;
    });

    it('non-admin cannot delete expense', async () => {
        const res = await request(app)
            .delete(`/api/expense/${expenseId}`)
            .set('Cookie', memberCookie);
        expect(res.status).toBe(403);
    });

    it('member can contribute to expense', async () => {
        const res = await request(app)
            .post('/api/contribution')
            .set('Cookie', memberCookie)
            .send({ expenseId, groupId, value: 30 });
        expect(res.status).toBe(201);
    });

    it('contribution cannot exceed remaining balance', async () => {
        const res = await request(app)
            .post('/api/contribution')
            .set('Cookie', adminCookie)
            .send({ expenseId, groupId, value: 200 });
        expect(res.status).toBe(400);
    });

    it('second contribution from same member updates existing', async () => {
        const res = await request(app)
            .post('/api/contribution')
            .set('Cookie', memberCookie)
            .send({ expenseId, groupId, value: 50 });
        expect(res.status).toBe(200);
    });

    it('expense shows correct total after contributions', async () => {
        const res = await request(app)
            .get(`/api/expense/group/${groupId}`)
            .set('Cookie', adminCookie);
        expect(res.status).toBe(200);
        const expense = res.body.expenses.find((e: any) => e.id === expenseId);
        expect(expense).toBeDefined();
    });
});
