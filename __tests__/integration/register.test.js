const qs = require('querystring');
const request = require('supertest');
const { User } = require('../../models/user');
const getTestingApp = require('../config/setup.integration');

describe('RegisterController', () => {
  it('should create user and redirect to the success page', async () => {
    const input = { name: 'test', email: 'test@test.com', password: '12345678' };
    const res = await request(getTestingApp()).post('/register').send(input);

    const users = await User.find();

    expect(res.status).toEqual(302);
    expect(res.headers.location).toEqual('/success');
    expect(users.length).toBe(1);
    expect(users[0]._id).toBeDefined();
    expect(users[0].email).toEqual(input.email);
  });

  it('should redirect to the error page if user already exists', async () => {
    const anotherUser = new User({ name: 'test', email: 'test@test.com', password: '12345678' });
    await anotherUser.save();

    const input = { name: 'test', email: 'test@test.com', password: '12345678' };
    const res = await request(getTestingApp()).post('/register').send(input);

    const users = await User.find({ email: 'test@test.com' });

    expect(res.status).toEqual(302);
    expect(res.headers.location).toEqual(`/error?${qs.stringify({ msg: 'Duplicated email' })}`);
    expect(users.length).toBe(1);
    expect(users[0].email).toEqual(anotherUser.email);
  });
});
