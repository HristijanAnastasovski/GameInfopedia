/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import CPUComponentsPage from './cpu.page-object';
import { CPUDeleteDialog } from './cpu.page-object';
import CPUUpdatePage from './cpu-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('CPU e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let cPUUpdatePage: CPUUpdatePage;
  let cPUComponentsPage: CPUComponentsPage;
  let cPUDeleteDialog: CPUDeleteDialog;

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

  it('should load CPUS', async () => {
    await navBarPage.getEntityPage('cpu');
    cPUComponentsPage = new CPUComponentsPage();
    expect(await cPUComponentsPage.getTitle().getText()).to.match(/CPUS/);
  });

  it('should load create CPU page', async () => {
    await cPUComponentsPage.clickOnCreateButton();
    cPUUpdatePage = new CPUUpdatePage();
    expect(await cPUUpdatePage.getPageTitle().getText()).to.match(/Create or edit a CPU/);
    await cPUUpdatePage.cancel();
  });

  it('should create and save CPUS', async () => {
    async function createCPU() {
      await cPUComponentsPage.clickOnCreateButton();
      await cPUUpdatePage.setNameInput('name');
      expect(await cPUUpdatePage.getNameInput()).to.match(/name/);
      await waitUntilDisplayed(cPUUpdatePage.getSaveButton());
      await cPUUpdatePage.save();
      await waitUntilHidden(cPUUpdatePage.getSaveButton());
      expect(await cPUUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createCPU();
    await cPUComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await cPUComponentsPage.countDeleteButtons();
    await createCPU();

    await cPUComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await cPUComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last CPU', async () => {
    await cPUComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await cPUComponentsPage.countDeleteButtons();
    await cPUComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    cPUDeleteDialog = new CPUDeleteDialog();
    expect(await cPUDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gameInfopediaApp.cPU.delete.question/);
    await cPUDeleteDialog.clickOnConfirmButton();

    await cPUComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await cPUComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
