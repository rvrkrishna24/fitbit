/**
 * Created by bandlamx on 12/15/2014.
 */
var HtmlReporter = require('protractor-html-screenshot-reporter');
var protractor = require('protractor');
var reporter=new HtmlReporter({
  baseDirectory: './protractor-result', // a location to store screen shots.
  docTitle: 'Protractor tests Reporter',
  docName:    'protractor-tests-report.html'
});

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'jasmine',

  capabilities: { 'browserName': 'chrome' },

    //specs: ['test/e2e/*.js'],
  specs: ['test/e2e/*.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    isVerbose: false
  },
  allScriptsTimeout: 40000,
 // baseUrl: 'http://testcust-fossil.s3-website-us-west-2.amazonaws.com/app/#/fossil',  
  baseUrl: 'http://localhost:3000/#/login',
  params: {
    user: [  
	  {
        'email': 'noneaccount.nanda@gmail.com',
        'password': 'nanda'
	  }      
    ]
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(reporter);    
	browser.manage().window().maximize();
    user = (browser.params.user[0]);
    browser.ignoreSynchronization=true;
    browser.get(browser.baseUrl);
    browser.waitForAngular();
	browser.sleep(20000);
	browser.driver.findElement(by.id("signInUrl")).click();
    browser.manage().timeouts().implicitlyWait(10000);

    var email = browser.driver.findElement(by.css('form input[type="text"]'));
    var password = browser.driver.findElement(by.css('form input[type="password"]'));
    var signIn = browser.driver.findElement(by.css('input[type="submit"]'));

    email.sendKeys(user.email);
    password.sendKeys(user.password);
    signIn.click().then(function() {
        //browser.get("http://testcust-fossil.s3-website-us-west-2.amazonaws.com/app/#/fossil/home");
        browser.get("http://localhost:3000/#/home");
    });
  }
};