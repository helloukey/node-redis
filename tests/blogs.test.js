const Page = require('./helpers/page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
});

afterEach(() => {
    page.close();
});

describe('When logged in', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('Should see blogs from', async () => {
        const label = await page.getContentsOf('form label');
        expect(label).toBe('Blog Title');
    });

    describe('Using valid inputs', async () => {
        beforeEach(async () => {
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('form button');
        });

        test('Should show confirmation screen', async () => {
            const text = await page.getContentsOf('h5');
            expect(text).toBe('Please confirm your entries');
        });

        test('Should show saved blog', async () => {
            await page.click('button.green');
            await page.waitFor('.card');
            
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');

            expect(title).toBe('My Title');
            expect(content).toBe('My Content');
        });
    })

    describe('Using invalid inputs', async () => {
        beforeEach(async () => {
            await page.click('form button');
        });

        test('Should show form input errors', async () => {
            const titleError = await page.getContentsOf('.title .red-text');
            const contentError = await page.getContentsOf('.content .red-text');

            expect(titleError).toBe('You must provide a value');
            expect(contentError).toBe('You must provide a value');
        })
    });
});

describe('User not logged in', async () => {
    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
        },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'T',
                content: 'C'
            }
        }
    ];

    test('Blog actions are prohibited', async () => {
        const results = await page.execRequests(actions);
    
        for (const result of results) {
            expect(result).toEqual({error: 'You must log in!'});
        }
    })

});