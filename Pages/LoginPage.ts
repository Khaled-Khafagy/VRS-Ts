import { Page,Locator } from "@playwright/test";

export class LoginPage {
    readonly page:Page;
    readonly loginButton
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly continueButton: Locator;
    readonly errorMessage: Locator;

    constructor (page :Page) {

        this.page = page;
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.usernameInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });


        
    }
    async navigate(){
        await this.page.goto ('http://xm.pre.idp.vodafone.com/iam/oic/authorize?ui_locales=en_US&service_id=xm_preprod&acr_values=urn%3Avodafone%3Aloa%3Asilver&scope=openid%20email%20phone%20profile%20offline_access&claims=eyJ1c2VyaW5mbyI6eyJjb3VudHJ5IjpudWxsLCJzdGF0ZV9wcm92aW5jZSI6bnVsbCwiY3JlYXRlZF9kYXRlIjpudWxsfX0%3D&response_type=code&state=a7ccc9ea-27c4-480e-8a3b-da10500f7bb3&redirect_uri=https%3A%2F%2Fhub.stagingref.external.nonprod.id-euc1.aws.cps.vodafone.com%2Foidc%2Freturn&nonce=e3f12723-6ef6-4eff-847f-d21b707e5363&flow=&client_id=IdHub#/login')
    }
    async login(username: string, password : string){
        await this.usernameInput.fill (username);
        await this.passwordInput.fill (password);
        await this.continueButton.click();
    }
    async getErrorMessaege(){
        return this.errorMessage.textContent();
    };












}