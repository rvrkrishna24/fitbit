describe("portal dashboard page", function () {
  var pageLoaded = false;
  
  it("should have the sign in link",function($window){
      //var elems = element(by.css('#signInUrl'));
      //expect(elems.getText()).toContain("Login");
  });
  it("should contain the brand name in url",function(){
    browser.waitForAngular();
    expect(browser.getCurrentUrl()).toContain("login");
  });
});
