QUnit.test("Test test.", function(assert) {
  assert.ok(1 == "1", "Passed!");
});

QUnit.test("Test the factory function with register details.", function(assert) {

    var result = factory.create("registerUser", "testUser", "testPassword", "testEmail");
    assert.deepEqual(result, {_id: "testUser", Username: "testUser", Email:  "testEmail", Password: "testPassword", Online: false, Wins: 0})
});

QUnit.test("Test the factory function with login details.", function(assert) {

    var result = factory.create("loginUser", "testUser", "testPassword");
    assert.deepEqual(result, {_id: "testUser", Username: "testUser", Password: "testPassword"})
});

QUnit.test("Testing title of the testing page is correct.", function(assert) {
    assert.ok($(document).attr('title').indexOf("Solar System Quiz Tests Page")!=-1,"checking that the page title is Solar System Quiz Tests Page");
});

