QUnit.test( "Test test.", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.module("LoginPage tests.");
QUnit.test("Testing the LoginPage title is correct.", function(assert) {
    assert.ok($(document).attr("title").indexOf("Solar System Quiz Login Page")!=-1,"Checking that the page title is: \"Solar System Quiz Login Page\".");
});

QUnit.module("HomePage tests.");
QUnit.test("Testing the HomePage title is correct.", function(assert) {
    assert.ok($(document).attr("title").indexOf("Solar System Quiz Home Page")!=-1,"Checking that the page title is: \"Solar System Quiz Home Page\".");
});
