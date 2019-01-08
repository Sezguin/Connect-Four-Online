/* //<<Uncomment to run tests on Login Page.

QUnit.test("Testing title of the testing page is correct.", function(assert) {
    assert.ok($(document).attr('title').indexOf("Solar System Quiz Login Page")!=-1,"checking that the page title is Solar System Quiz Login Page");
});

QUnit.test("Checking that a header elemtn exists.", function(assert) {
    assert.ok($("h1").length > 1, "Checking <h1> exists...");
});

QUnit.test("Testing the login button displays the login modal.", function(assert) {
    $("#loginButton").trigger("click");
    assert.ok($("#loginModal").show);

    // Do after test.
    $("#exitLogin").trigger("click");
});

QUnit.test("Testing the register button displays the registration modal.", function(assert) {
    $("#registerButton").trigger("click");
    assert.ok($("#registerModal").show);
    $("#exitRegister").trigger("click");
}); 

*/ //<<Uncomment to run tests on Login Page.