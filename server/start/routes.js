'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.group(() => {

// ----- Users -----
  // register
  Route
    .post('auth/register', 'UserController.register')
    .middleware(['verifyCaptchaV3', 'profanityFilterUser'])
    .validator('RegisterUser')
  
  // confirm email address
  Route
    .get('auth/register/confirm/:token', 'UserController.confirmEmail')

  // request password reset
  Route
    .post('auth/password/email', 'UserController.sendPasswordResetEmail')
    .middleware('verifyCaptchaV3')
    .validator('PasswordResetEmail')
  
  // confirm password reset
  Route
    .post('auth/password/reset', 'UserController.resetPassword')
    .middleware('verifyCaptchaV3')
    .validator('PasswordReset')

  // login
  Route
    .post('auth/login', 'UserController.login')
    .middleware('verifyCaptchaV3')
    .validator('LoginUser')

// ----- Gunbuilds -----
  // get all
  Route
    .get('gunbuilds', 'GunbuildController.index')

  // get all for logged in user
  Route
    .get('gunbuilds/mine', 'GunbuildController.indexMine')
    .middleware(['auth'])

  // get all by gun
  Route
    .get('gunbuilds/indexbygun/:id', 'GunbuildController.indexByGun')
    .middleware(['findGun'])

  // get one
  Route
    .get('gunbuilds/:id', 'GunbuildController.show')
    .middleware(['findGunbuild'])

  // create one
  Route
    .post('gunbuilds', 'GunbuildController.create')
    .middleware(['auth', 'profanityFilterGunbuild'])
    .validator('Gunbuild')

  // update one
  Route
    .patch('gunbuilds/:id', 'GunbuildController.update')
    .middleware(['auth', 'findGunbuild', 'profanityFilterGunbuild'])
    .validator('Gunbuild')

  // delete one
  Route
    .delete('gunbuilds/:id', 'GunbuildController.delete')
    .middleware(['auth', 'findGunbuild'])

  // vote
  Route
    .patch('gunbuilds/:id/vote', 'GunbuildController.vote')
    .middleware(['verifyCaptchaV2', 'findGunbuild']) // add captcha verification middleware

// ----- Attachments -----
  // get all
  Route
    .get('attachments', 'AttachmentController.index')

// ----- Guns -----
  // get all
  Route
    .get('guns', 'GunController.index')

})
  .prefix('api')
  