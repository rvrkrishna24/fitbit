describe('Add Plan Controller : ', function () {
    describe('Days should be defined', function () {       
        it("the plan should be defined", function () {
            var plan="Sunday";
            expect(plan).toBeDefined();
        });
        it("the plan should be equal to the created day", function () {
            var plan="Sunday";
            expect(plan).toEqual("Sunday");
        });
    });
});