import { OppPage } from './app.po';

describe('opp App', () => {
  let page: OppPage;

  beforeEach(() => {
    page = new OppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
