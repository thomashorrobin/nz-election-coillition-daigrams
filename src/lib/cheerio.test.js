var Cheerio = require('./cheerio');

describe('Response Management', () => {
    it('response thats not json should throw error', async () => {
        const res = new Response('<html><body><h1>Some heading</h1></body></html>');
        let err;
        try {
            await Cheerio.extractTextFromResponse(res)
        } catch (error) {
            err = error;
        } finally {
            expect(err.message).toBe('Unexpected token < in JSON at position 0');
        }
    })
    it('valid response should resolve', async () => {
        const res = new Response(JSON.stringify({ parse: { text: { '*': 'some text' } } }));
        await Cheerio.extractTextFromResponse(res).then(text => {
            expect(text).toBe('some text');
        });
    })
    it('invalid response should reject', async () => {
        const res = new Response(JSON.stringify({ parse: { text: { 'wrong': 'some text' } } }));
        await expect(Cheerio.extractTextFromResponse(res)).rejects.toThrow('Wikipedia API response was not JSON');
    })
});

export {}
