const expect = require('chai').expect
const replacePage = require('../utils/common').replacePage

const baseUrl = 'https://m1.lukkav.com/art/type/id/8/page/$$.html'

describe('utils', () => {
  it('url replace', () => {
    expect(replacePage(baseUrl, 1)).to.be.equal('https://m1.lukkav.com/art/type/id/8/page/1.html')
  })
})
