import { element, by, ElementFinder } from 'protractor';

export default class VideoGameUpdatePage {
  pageTitle: ElementFinder = element(by.id('gameInfopediaApp.videoGame.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  titleInput: ElementFinder = element(by.css('input#video-game-title'));
  releasedateInput: ElementFinder = element(by.css('input#video-game-releasedate'));
  priceInput: ElementFinder = element(by.css('input#video-game-price'));
  imageInput: ElementFinder = element(by.css('input#file_image'));
  descriptionInput: ElementFinder = element(by.css('textarea#video-game-description'));
  averageRatingInput: ElementFinder = element(by.css('input#video-game-averageRating'));
  minimumStorageRequiredInput: ElementFinder = element(by.css('input#video-game-minimumStorageRequired'));
  minimumRAMRequiredInput: ElementFinder = element(by.css('input#video-game-minimumRAMRequired'));
  publisherSelect: ElementFinder = element(by.css('select#video-game-publisher'));
  minimumCPURequiredSelect: ElementFinder = element(by.css('select#video-game-minimumCPURequired'));
  minimumGPURequiredSelect: ElementFinder = element(by.css('select#video-game-minimumGPURequired'));
  platformsSelect: ElementFinder = element(by.css('select#video-game-platforms'));
  genresSelect: ElementFinder = element(by.css('select#video-game-genres'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTitleInput(title) {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput() {
    return this.titleInput.getAttribute('value');
  }

  async setReleasedateInput(releasedate) {
    await this.releasedateInput.sendKeys(releasedate);
  }

  async getReleasedateInput() {
    return this.releasedateInput.getAttribute('value');
  }

  async setPriceInput(price) {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput() {
    return this.priceInput.getAttribute('value');
  }

  async setImageInput(image) {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput() {
    return this.imageInput.getAttribute('value');
  }

  async setDescriptionInput(description) {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput() {
    return this.descriptionInput.getAttribute('value');
  }

  async setAverageRatingInput(averageRating) {
    await this.averageRatingInput.sendKeys(averageRating);
  }

  async getAverageRatingInput() {
    return this.averageRatingInput.getAttribute('value');
  }

  async setMinimumStorageRequiredInput(minimumStorageRequired) {
    await this.minimumStorageRequiredInput.sendKeys(minimumStorageRequired);
  }

  async getMinimumStorageRequiredInput() {
    return this.minimumStorageRequiredInput.getAttribute('value');
  }

  async setMinimumRAMRequiredInput(minimumRAMRequired) {
    await this.minimumRAMRequiredInput.sendKeys(minimumRAMRequired);
  }

  async getMinimumRAMRequiredInput() {
    return this.minimumRAMRequiredInput.getAttribute('value');
  }

  async publisherSelectLastOption() {
    await this.publisherSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async publisherSelectOption(option) {
    await this.publisherSelect.sendKeys(option);
  }

  getPublisherSelect() {
    return this.publisherSelect;
  }

  async getPublisherSelectedOption() {
    return this.publisherSelect.element(by.css('option:checked')).getText();
  }

  async minimumCPURequiredSelectLastOption() {
    await this.minimumCPURequiredSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async minimumCPURequiredSelectOption(option) {
    await this.minimumCPURequiredSelect.sendKeys(option);
  }

  getMinimumCPURequiredSelect() {
    return this.minimumCPURequiredSelect;
  }

  async getMinimumCPURequiredSelectedOption() {
    return this.minimumCPURequiredSelect.element(by.css('option:checked')).getText();
  }

  async minimumGPURequiredSelectLastOption() {
    await this.minimumGPURequiredSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async minimumGPURequiredSelectOption(option) {
    await this.minimumGPURequiredSelect.sendKeys(option);
  }

  getMinimumGPURequiredSelect() {
    return this.minimumGPURequiredSelect;
  }

  async getMinimumGPURequiredSelectedOption() {
    return this.minimumGPURequiredSelect.element(by.css('option:checked')).getText();
  }

  async platformsSelectLastOption() {
    await this.platformsSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async platformsSelectOption(option) {
    await this.platformsSelect.sendKeys(option);
  }

  getPlatformsSelect() {
    return this.platformsSelect;
  }

  async getPlatformsSelectedOption() {
    return this.platformsSelect.element(by.css('option:checked')).getText();
  }

  async genresSelectLastOption() {
    await this.genresSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async genresSelectOption(option) {
    await this.genresSelect.sendKeys(option);
  }

  getGenresSelect() {
    return this.genresSelect;
  }

  async getGenresSelectedOption() {
    return this.genresSelect.element(by.css('option:checked')).getText();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }
}
