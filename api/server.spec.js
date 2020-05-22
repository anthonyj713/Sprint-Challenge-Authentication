const supertest = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig.js');

afterEach(async () => {
    await db('users').truncate();
});

describe('server', () => {
    test('can run the tests', () => {
        expect(true).toBeTruthy();
    });

    describe('POST /api/auth/register', () => {
        let user1 = {
            "username": "test1",
            "password": "helloworld"
        }
        test('should return http status code 201 OK when user is created', () => {
            return (
                supertest(server)
                .post('/api/auth/register')
                .send(user1)
                .expect(201)
            )
        });

        let user2 = {
            "username": "test2",
            "password": "",
        }
        test('returns error code 400 when password is empty', () => {
           return (
               supertest(server)
               .post('/api/auth/register')
               .send(user2)
               .expect(400)
           )
        })
    })

    describe('POST /api/auth/login', () => {
        let user3 = {
            "username": "test3",
            "password": "pw3",
        }
        test('returns error code 500 when user doesnt exist in database', () => {
           return (
               supertest(server)
               .post('/api/auth/login')
               .send(user3)
               .expect(500)
           )
        });
        let user4 = {
            "username":  '',
            "password": "pw4",
        }
        test('returns error code 400 when user field is empty', () => {
           return (
               supertest(server)
               .post('/api/auth/login')
               .send(user4)
               .expect(400)
           )
        });
    })






    
})