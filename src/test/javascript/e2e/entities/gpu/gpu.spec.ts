/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import GPUComponentsPage from './gpu.page-object';
import { GPUDeleteDialog } from './gpu.page-object';
import GPUUpdatePage from './gpu-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('GPU e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let gPUUpdatePage: GPUUpdatePage;
  let gPUComponentsPage: GPUComponentsPage;
  let gPUDeleteDialog: GPUDeleteDialog;

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

  it('should load GPUS', async () => {
    await navBarPage.getEntityPage('gpu');
    gPUComponentsPage = new GPUComponentsPage();
    expect(await gPUComponentsPage.getTitle().getText()).to.match(/GPUS/);
  });

  it('should load create GPU page', async () => {
    await gPUComponentsPage.clickOnCreateButton();
    gPUUpdatePage = new GPUUpdatePage();
    expect(await gPUUpdatePage.getPageTitle().getText()).to.match(/Create or edit a GPU/);
    await gPUUpdatePage.cancel();
  });

  it('should create and save GPUS', async () => {
    async function createGPU() {
      await gPUComponentsPage.clickOnCreateButton();
      await gPUUpdatePage.setNameInput('name');
      expect(await gPUUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(gPUUpdatePage.getSaveButton());
      await gPUUpdatePage.save();
      await waitUntilHidden(gPUUpdatePage.getSaveButton());
      expect(await gPUUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createGPU();
    await gPUComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await gPUComponentsPage.countDeleteButtons();
    await createGPU();

    await gPUComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await gPUComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last GPU', async () => {
    await gPUComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await gPUComponentsPage.countDeleteButtons();
    await gPUComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    gPUDeleteDialog = new GPUDeleteDialog();
    expect(await gPUDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gameInfopediaApp.gPU.delete.question/);
    await gPUDeleteDialog.clickOnConfirmButton();

    await gPUComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await gPUComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
