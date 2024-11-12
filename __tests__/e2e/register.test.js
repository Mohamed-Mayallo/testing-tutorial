const qs = require('querystring');
const { User } = require('../../models/user');

describe('RegisterController', () => {
  it('should create user and redirect to the success page', async () => {
    const input = { name: 'test', email: 'test@test.com', password: '12345678' };

    // page is a global variable coming from using Puppeteer as a preset for Jest
    await page.goto('http://localhost:3004/');

    // page.type(selector, text)
    await page.type('#register-form .name-input', input.name);
    await page.type('#register-form .email-input', input.email);
    await page.type('#register-form .password-input', input.password);
    await page.click('#register-form .submit-button');

    // Waits until the browser is fully redirected
    await page.waitForNavigation();

    const currentUrl = page.url();
    const pageContent = await page.evaluate(() => document.body.innerText);
    const users = await User.find();

    expect(currentUrl).toBe('http://localhost:3004/success');
    expect(pageContent).toContain('User is registered successfully');
    expect(users.length).toBe(1);
    expect(users[0]._id).toBeDefined();
    expect(users[0].email).toEqual(input.email);
  });

  it('should redirect to the error page if user already exists', async () => {
    const anotherUser = new User({ name: 'test', email: 'test@test.com', password: '12345678' });
    await anotherUser.save();

    const input = { name: 'test', email: 'test@test.com', password: '12345678' };

    await page.goto('http://localhost:3004/');

    await page.type('#register-form .name-input', input.name);
    await page.type('#register-form .email-input', input.email);
    await page.type('#register-form .password-input', input.password);
    await page.click('#register-form .submit-button');

    await page.waitForNavigation();

    const currentUrl = page.url();
    const pageContent = await page.evaluate(() => document.body.innerText);
    const users = await User.find({ email: 'test@test.com' });

    expect(currentUrl).toBe(
      `http://localhost:3004/error?${qs.stringify({ msg: 'Duplicated email' })}`
    );
    expect(pageContent).toContain('Duplicated email');
    expect(users.length).toBe(1);
    expect(users[0].email).toEqual(anotherUser.email);
  });
});
