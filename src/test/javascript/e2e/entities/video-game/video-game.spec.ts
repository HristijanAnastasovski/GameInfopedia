/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import VideoGameComponentsPage from './video-game.page-object';
import { VideoGameDeleteDialog } from './video-game.page-object';
import VideoGameUpdatePage from './video-game-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';
import path from 'path';

const expect = chai.expect;

describe('VideoGame e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let videoGameUpdatePage: VideoGameUpdatePage;
  let videoGameComponentsPage: VideoGameComponentsPage;
  let videoGameDeleteDialog: VideoGameDeleteDialog;
  const fileToUpload = '../../../../../../src/main/webapp/static/images/logo-jhipster.png';
  const absolutePath = path.resolve(__dirname, fileToUpload);

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

  it('should load VideoGames', async () => {
    await navBarPage.getEntityPage('video-game');
    videoGameComponentsPage = new VideoGameComponentsPage();
    expect(await videoGameComponentsPage.getTitle().getText()).to.match(/Video Games/);
  });

  it('should load create VideoGame page', async () => {
    await videoGameComponentsPage.clickOnCreateButton();
    videoGameUpdatePage = new VideoGameUpdatePage();
    expect(await videoGameUpdatePage.getPageTitle().getText()).to.match(/Create or edit a VideoGame/);
    await videoGameUpdatePage.cancel();
  });

  it('should create and save VideoGames', async () => {
    async function createVideoGame() {
      await videoGameComponentsPage.clickOnCreateButton();
      await videoGameUpdatePage.setTitleInput('title');
      expect(await videoGameUpdatePage.getTitleInput()).to.match(/title/);
      await videoGameUpdatePage.setReleasedateInput('01-01-2001');
      expect(await videoGameUpdatePage.getReleasedateInput()).to.eq('2001-01-01');
      await videoGameUpdatePage.setPriceInput('5');
      expect(await videoGameUpdatePage.getPriceInput()).to.eq('5');
      await videoGameUpdatePage.setImageInput(absolutePath);
      await videoGameUpdatePage.setDescriptionInput('description');
      expect(await videoGameUpdatePage.getDescriptionInput()).to.match(/description/);
      await videoGameUpdatePage.setAverageRatingInput('5');
      expect(await videoGameUpdatePage.getAverageRatingInput()).to.eq('5');
      await videoGameUpdatePage.setMinimumStorageRequiredInput('5');
      expect(await videoGameUpdatePage.getMinimumStorageRequiredInput()).to.eq('5');
      await videoGameUpdatePage.setMinimumRAMRequiredInput('5');
      expect(await videoGameUpdatePage.getMinimumRAMRequiredInput()).to.eq('5');
      await videoGameUpdatePage.publisherSelectLastOption();
      await videoGameUpdatePage.minimumCPURequiredSelectLastOption();
      await videoGameUpdatePage.minimumGPURequiredSelectLastOption();
      // videoGameUpdatePage.platformsSelectLastOption();
      // videoGameUpdatePage.genresSelectLastOption();
      await waitUntilDisplayed(videoGameUpdatePage.getSaveButton());
      await videoGameUpdatePage.save();
      await waitUntilHidden(videoGameUpdatePage.getSaveButton());
      expect(await videoGameUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createVideoGame();
    await videoGameComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await videoGameComponentsPage.countDeleteButtons();
    await createVideoGame();

    await videoGameComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await videoGameComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last VideoGame', async () => {
    await videoGameComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await videoGameComponentsPage.countDeleteButtons();
    await videoGameComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    videoGameDeleteDialog = new VideoGameDeleteDialog();
    expect(await videoGameDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/gameInfopediaApp.videoGame.delete.question/);
    await videoGameDeleteDialog.clickOnConfirmButton();

    await videoGameComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await videoGameComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
