QUnit.test( "Test test.", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.module("LoginPage tests.");
QUnit.test("Testing the LoginPage title is correct.", function(assert) {
    assert.ok($(document).attr("title").indexOf("Connect Four Online Login Page")!=-1,"Checking that the page title is: \"Connect Four Online Login Page\".");
});

QUnit.module("HomePage tests.");
QUnit.test("Testing the HomePage title is correct.", function(assert) {
    assert.ok($(document).attr("title").indexOf("Connect Four Online Home Page")!=-1,"Checking that the page title is: \"Connect Four Online Home Page\".");
});

QUnit.module("HowToPlayPage tests.");
QUnit.test("Testing the HowToPlayPage title is correct.", function(assert) {
    assert.ok($(document).attr("title").indexOf("Connect Four Online How To Play Page")!=-1,"Checking that the page title is: \"Connect Four Online How To Play Page\".");
});
