/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PlatformComponentsPage from './platform.page-object';
import { PlatformDeleteDialog } from './platform.page-object';
import PlatformUpdatePage from './platform-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Platform e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let platformUpdatePage: PlatformUpdatePage;
  let platformComponentsPage: PlatformComponentsPage;
  let platformDeleteDialog: PlatformDeleteDialog;

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

  it('should load Platforms', async () => {
    await navBarPage.getEntityPage('platform');
    platformComponentsPage = new PlatformComponentsPage();
    expect(await platformComponentsPage.getTitle().getText()).to.match(/Platforms/);
  });

  it('should load create Platform page', async () => {
    await platformComponentsPage.clickOnCreateButton();
    platformUpdatePage = new PlatformUpdatePage();
    expect(await platformUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Platform/);
    await platformUpdatePage.cancel();
  });

  it('should create and save Platforms', async () => {
    async function createPlatform() {
      await platformComponentsPage.clickOnCreateButton();
      await platformUpdatePage.setNameInput('name');
      expect(await platformUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(platformUpdatePage.getSaveButton());
      await platformUpdatePage.save();
      await waitUntilHidden(platformUpdatePage.getSaveButton());
      expect(await platformUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createPlatform();
    await platformComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await platformComponentsPage.countDeleteButtons();
    await createPlatform();

    await platformComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await platformComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Platform', async () => {
    await platformComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await platformComponentsPage.countDeleteButtons();
    await platformComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    platformDeleteDialog = new PlatformDeleteDialog();
    expect(await platformDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gameInfopediaApp.platform.delete.question/);
    await platformDeleteDialog.clickOnConfirmButton();

    await platformComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await platformComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
