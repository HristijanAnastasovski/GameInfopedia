import { combineReducers } from 'redux';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import authentication, { AuthenticationState } from './authentication';
import applicationProfile, { ApplicationProfileState } from './application-profile';

import administration, { AdministrationState } from 'app/modules/administration/administration.reducer';
import userManagement, { UserManagementState } from 'app/modules/administration/user-management/user-management.reducer';
import register, { RegisterState } from 'app/modules/account/register/register.reducer';
import activate, { ActivateState } from 'app/modules/account/activate/activate.reducer';
import password, { PasswordState } from 'app/modules/account/password/password.reducer';
import settings, { SettingsState } from 'app/modules/account/settings/settings.reducer';
import passwordReset, { PasswordResetState } from 'app/modules/account/password-reset/password-reset.reducer';
// prettier-ignore
import genre, {
  GenreState
} from 'app/entities/genre/genre.reducer';
// prettier-ignore
import platform, {
  PlatformState
} from 'app/entities/platform/platform.reducer';
// prettier-ignore
import publisher, {
  PublisherState
} from 'app/entities/publisher/publisher.reducer';
// prettier-ignore
import videoGame, {
  VideoGameState
} from 'app/entities/video-game/video-game.reducer';
// prettier-ignore
import cPU, {
  CPUState
} from 'app/entities/cpu/cpu.reducer';
// prettier-ignore
import gPU, {
  GPUState
} from 'app/entities/gpu/gpu.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

export interface IRootState {
  readonly authentication: AuthenticationState;
  readonly applicationProfile: ApplicationProfileState;
  readonly administration: AdministrationState;
  readonly userManagement: UserManagementState;
  readonly register: RegisterState;
  readonly activate: ActivateState;
  readonly passwordReset: PasswordResetState;
  readonly password: PasswordState;
  readonly settings: SettingsState;
  readonly genre: GenreState;
  readonly platform: PlatformState;
  readonly publisher: PublisherState;
  readonly videoGame: VideoGameState;
  readonly cPU: CPUState;
  readonly gPU: GPUState;
  /* jhipster-needle-add-reducer-type - JHipster will add reducer type here */
  readonly loadingBar: any;
}

const rootReducer = combineReducers<IRootState>({
  authentication,
  applicationProfile,
  administration,
  userManagement,
  register,
  activate,
  passwordReset,
  password,
  settings,
  genre,
  platform,
  publisher,
  videoGame,
  cPU,
  gPU,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  loadingBar
});

export default rootReducer;
