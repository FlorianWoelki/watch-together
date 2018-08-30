const chai = require('chai');
const http = require('http');

describe('YT Player API', () => {
    it('should return 200 if yt iframe api is available', (done) => {
        http.get('http://www.youtube.com/iframe_api', (response) => {
            chai.expect(response.statusCode).to.equal(200);
            done();
        });
    });
});