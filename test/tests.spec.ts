import { afterAll, beforeAll, beforeEach, it, describe } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { randomUUID } from 'node:crypto'

beforeAll(async () => {
  await app.ready()
})
afterAll(async () => {
  await app.close()
})

beforeEach(async () => {
  execSync('npm run knex -- migrate:rollback --all')
  execSync('npm run knex -- migrate:latest')
})

describe('Auth test', () => {
  it('should be able to sign in', async () => {
    await await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    await request(app.server)
      .post('/login')
      .send({
        email: 'mnsergio59@gmail.com',
        password: '1234',
      })
      .expect(200)
  })
})

describe('Users tests', () => {
  it('should be able to create an user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        user_id: randomUUID(),
        name: 'Matheus Nascimento Sergio',
        age: 90,
        email: 'mnsergio59@gmail.com',
        password: '1234',
      })
      .expect(201)
  })

  it('should be able to list users', async () => {
    await request(app.server).get('/users').expect(200)
  })
})

describe('Meals tests', () => {
  it('should be able to list meals', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    await request(app.server).get('/meals').set('Cookie', cookie).expect(200)
  })

  it('should be able to get a meal', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    const data = await request(app.server).get('/meals').set('Cookie', cookie)

    const mealId = data.body.meals[0].id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(200)
  })

  it('should be able to create a meal', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)
      .expect(201)
  })

  it('should be able to edit a meal', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    const data = await request(app.server).get('/meals').set('Cookie', cookie)

    const mealId = data.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .send({
        name: 'Bolo de laranja',
        description: 'Bolo de laranja com café',
        datetime: '2023-04-14T17:12:00-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)
      .expect(204)
  })

  it('should be able to delete a meal', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    const data = await request(app.server).get('/meals').set('Cookie', cookie)

    const mealId = data.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(204)
  })
})

describe('Metrics test', () => {
  it('should be able to get the diet metrics', async () => {
    await request(app.server).post('/users').send({
      user_id: randomUUID(),
      name: 'Matheus Nascimento Sergio',
      age: 90,
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const login = await request(app.server).post('/login').send({
      email: 'mnsergio59@gmail.com',
      password: '1234',
    })

    const cookie = login.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de milho',
        description: 'Bolo de milho com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de laranja',
        description: 'Bolo de laranja com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Bolo de côco',
        description: 'Bolo de côco com café',
        datetime: '2023-04-14T11:18:53-03:00',
        insideDiet: false,
      })
      .set('Cookie', cookie)

    await request(app.server)
      .post('/meals')
      .send({
        id: randomUUID(),
        user_id: cookie,
        name: 'Salada de tomate',
        description: 'Salada',
        datetime: '2023-04-15T11:18:53-03:00',
        insideDiet: true,
      })
      .set('Cookie', cookie)

    await request(app.server).get('/metrics').expect(200).set('Cookie', cookie)
  })
})
