const Page = require('./helpers/page');

let page;

beforeEach(async ()=>{
    page = await Page.build();
    await page.goto('http://127.0.0.1:3000');
});

afterEach(async()=>{
    await page.close();
})

test('The header has the correct text', async ()=> {
    const logoText = await page.getContentsOf('a.brand-logo');
    expect(logoText).toEqual('Blogster')
})

test('clicking login starts oauth flow', async ()=> {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts.google.com/)
})

test('when logged in, the log out button shows up', async() => {
    await page.login();
    const text = await page.getContentsOf('a[href="/auth/logout"]');
    expect(text).toEqual('Logout');
})