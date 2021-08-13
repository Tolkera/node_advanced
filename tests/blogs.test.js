const Page = require('./helpers/page');

let page;

beforeEach(async ()=>{
    page = await Page.build();
    await page.goto('http://127.0.0.1:3000');
});

afterEach(async()=>{
    await page.close();
})

describe('When logged in', async function () {
    beforeEach(async ()=>{
        await page.login();
        await page.click('#create-blog-trigger');
    });

    test('can see blog create form',async() => {
        const label = await page.getContentsOf('#create-form label');
        expect(label).toEqual('Blog Title');
    });

    describe('and using invalid inputs', async function () {
        beforeEach(async()=>{
            await page.click('#create-form button')
        })
        test('show an error message',async() => {
            const titleError = await page.getContentsOf('#create-form .title .error');
            const contentError = await page.getContentsOf('#create-form .content .error');

            expect(titleError).toEqual('You must provide a value');
            expect(contentError).toEqual('You must provide a value');

        })
    });
    describe('and using valid inputs', async () => {

        beforeEach(async()=>{
            await page.type('.title input', 'My Title');
            await page.type('.content input', 'My Content');
            await page.click('#create-form button')
        })

        test('submitting takes user to review screen', async ()=> {
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        })

        test('submitting then saving  adds blog to the index page', async ()=> {
            await page.click('#save-blog')
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card .card-title');
            const content = await page.getContentsOf('.card p');

            expect(title).toEqual('My Title');
            expect(content).toEqual('My Content');
        })
    })
});
describe('When not logged in', async () => {

    const actions = [
        {
            method: 'get',
            path: '/api/blogs'
            },
        {
            method: 'post',
            path: '/api/blogs',
            data: {
                title: 'Tilele',
                'content': "C"
            }
        }]
    test('blog related actions are prohibited', async ()=> {
        const results = await page.execRequests(actions);
        results.every(item => {
            expect(item).toEqual({"error": "You must log in!"})
        })
    })
})