const puppeteer = require('puppeteer');
const sessionFactory = require('./factories/sessionFactory');
const userFactory = require('./factories/userFactory');

let page;
let browser;

beforeEach(async () => {
    browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        args: ['--no-sandbox'],
    })
    page = await browser.newPage();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await browser.close();
});

test('Brand logo is Blogster', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);
    expect(text).toBe('Blogster');
});

test('Clicking login should do oauth flow', async () => {
    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in it should show logout button', async () => {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig });

    await page.goto('http://localhost:3000/blogs');
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
    expect(text).toBe('Logout');
    await page.click('a[href="/auth/logout"]');
});