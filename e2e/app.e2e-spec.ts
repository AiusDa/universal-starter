import { UniversalStarterPage } from './app.po';

describe('universal-starter App', () => {
  let page: UniversalStarterPage;

  beforeEach(() => {
    page = new UniversalStarterPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
