import { verifyEmail } from './verifyEmail';
import { Middleware } from 'koa';
import { Provider } from 'oidc-provider';
import { abortInteraction } from './abortInteraction';
import { confirmInteraction } from './confirmInteraction';
import { interaction } from './interaction';
import { login } from './login';
import { register, checkRegister } from './register';
import { multiFactorAuth } from './multiFactorAuth';
import { registerForm } from './registerForm';


export default (oidc: Provider): { [key: string]: Middleware } => ({
  // OIDC Resolve  
  interaction: interaction(oidc),

  // Login
  login: login(oidc),
  multiFactorAuth: multiFactorAuth(oidc),
  confirmInteraction: confirmInteraction(oidc),
  abortInteraction: abortInteraction(oidc),

  // Register
  register: register(oidc),
  checkRegister:checkRegister(oidc),
  registerForm: registerForm(oidc),
  verifyEmail: verifyEmail(oidc),
});
