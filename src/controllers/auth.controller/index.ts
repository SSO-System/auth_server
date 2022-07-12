import { Middleware } from 'koa';
import { Provider } from 'oidc-provider';
import { abortInteraction } from './abortInteraction';
import { checkSession } from './checkSession';
import { confirmInteraction } from './confirmInteraction';
import { interaction } from './interaction';
import { login } from './login';
import { register } from './register';
import { registerForm } from './registerForm';


export default (oidc: Provider): { [key: string]: Middleware } => ({
  login: login(oidc),
  register: register(oidc),
  confirmInteraction: confirmInteraction(oidc),
  abortInteraction: abortInteraction(oidc),
  interaction: interaction(oidc),
  checkSession: checkSession(oidc),
  registerForm: registerForm(oidc),
});
