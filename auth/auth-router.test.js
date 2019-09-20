const request = require('supertest')

const server = require('../api/server.js')
const db = require('../database/dbConfig.js')

describe('auth-router.js', () => {
    beforeEach(async () => {
        await db('users').truncate();
    })

    it('register should return 201 status', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({ username: 'jose', password: '123'})
            .set("Accept", "application/json")

        expect(res.status).toBe(201)
    })

    it('register should encrypt the password into something different', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({ username: 'jose', password: '123'})

        expect(res.body.password).not.toBe('123')
    })

    it('login should return 200 status', async () => {
        await request(server)
            .post('/api/auth/register')
            .send({ username: 'jose', password: '123'})
        const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'jose', password: '123'})
            .set("Accept", "application/json")

        expect(res.status).toBe(200)
    })

    it('login should return a token on success', async () => {
        await request(server)
            .post('/api/auth/register')
            .send({ username: 'jose', password: '123'})
        const res = await request(server)
            .post('/api/auth/login')
            .send({ username: 'jose', password: '123'})
            .set("Accept", "application/json")

        expect(res.body.token).toBeTruthy()
    })
})