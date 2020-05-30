/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import GenreComponentsPage from './genre.page-object';
import { GenreDeleteDialog } from './genre.page-object';
import GenreUpdatePage from './genre-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Genre e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let genreUpdatePage: GenreUpdatePage;
  let genreComponentsPage: GenreComponentsPage;
  let genreDeleteDialog: GenreDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Genres', async () => {
    await navBarPage.getEntityPage('genre');
    genreComponentsPage = new GenreComponentsPage();
    expect(await genreComponentsPage.getTitle().getText()).to.match(/Genres/);
  });

  it('should load create Genre page', async () => {
    await genreComponentsPage.clickOnCreateButton();
    genreUpdatePage = new GenreUpdatePage();
    expect(await genreUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Genre/);
    await genreUpdatePage.cancel();
  });

  it('should create and save Genres', async () => {
    async function createGenre() {
      await genreComponentsPage.clickOnCreateButton();
      await genreUpdatePage.setNameInput('name');
      expect(await genreUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(genreUpdatePage.getSaveButton());
      await genreUpdatePage.save();
      await waitUntilHidden(genreUpdatePage.getSaveButton());
      expect(await genreUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createGenre();
    await genreComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await genreComponentsPage.countDeleteButtons();
    await createGenre();

    await genreComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await genreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Genre', async () => {
    await genreComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await genreComponentsPage.countDeleteButtons();
    await genreComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    genreDeleteDialog = new GenreDeleteDialog();
    expect(await genreDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gameInfopediaApp.genre.delete.question/);
    await genreDeleteDialog.clickOnConfirmButton();

    await genreComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await genreComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
