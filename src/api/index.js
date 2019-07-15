const urls = {
  login: {
    Login: '/login',
    Logout: '/auth/logout',
    ForgePassword: '/auth/forge-password',
    Register: '/auth/register',
    twoStepCode: '/auth/2step-code',
    SendSms: '/account/sms',
    SendSmsErr: '/account/sms_err',
    UserInfo: '/user/info'
  },
  manage: {
    user: '/user',
    role: '/role',
    service: '/service',
    permission: '/permission',
    permissionNoPager: '/permission/no-pager',
    orgTree: '/org/tree'
  }
}

const LoginAPI = {}
for (const index in urls.login) {
  LoginAPI[index] = process.env.VUE_APP_BACKEND_URL + urls.login[index]
}

const ManageAPI = {}
for (const index in urls.manage) {
  ManageAPI[index] = process.env.VUE_APP_BACKEND_URL + urls.manage[index]
}
export { LoginAPI, ManageAPI }
