// Tests for structure/html
QUnit.test("#Testing the LoginPage title is correct.", function(assert){
    assert.ok($(document).attr('title').indexOf("Connect Four Online Login Page")!=-1,"Checking that the page title is: \"Connect Four Online Login Page\".");
});

QUnit.test("#Unit test 2 testing div element presence", function(assert){
    // console.log("Number of divs " + $("div").length)
    assert.ok($("div").length>8, "checking that an element of type div has been added");
});

QUnit.test("#Unit test 3 testing main class type", function(assert){
    assert.equal($(".main")[0].tagName, "DIV", "checking that the \'main\' class element is a div");
});

QUnit.test("#Unit test 4 testing h1 element presence", function(assert){
    assert.ok($("h1").length>1, "checking that an element of type h1 has been added");
});

QUnit.test("#Unit test 5 testing light class type", function(assert){
    assert.equal($(".light")[0].tagName, "DIV", "checking that the \'light\' class element is a div");
});

QUnit.test("#Unit test 6 testing button element presence", function(assert){
    console.log("Number of buttons " + $("button").length)
    assert.ok($("button").length>4, "checking that an element of type button has been added");
});

QUnit.test("#Unit test 7 testing button text", function(assert){
    assert.ok($("button").text().indexOf("Burn!")!=-1, "checking that the button has the text 'Burn!'");
});
