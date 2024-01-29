const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(async () => {
    await page.close();
});

test('Brand logo is Blogster', async () => {
    const text = await page.getContentsOf('a.brand-logo');
    expect(text).toBe('Blogster');
});

test('Clicking login should do oauth flow', async () => {
    await page.click('.right a');
    const url = page.url();
    expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in it should show logout button', async () => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toBe('Logout');
    await page.click('a[href="/auth/logout"]');
});