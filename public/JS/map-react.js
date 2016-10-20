import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Input} from 'react-materialize'
var ReactTestUtils = require('react-addons-test-utils');

//credit to Professor Bell from GMU's SWE-432

var FoodListItems = React.createClass({
    render: function() {
        var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});
// var itemsHash = {};
// var idxCount = 0;
var FoodListApp = React.createClass({
    getInitialState: function() {
        return {items: [], text: '', tag: ''};
    },
    onChange: function(e) {
        this.setState({text: e.target.value});
    },
    onTagChange: function(e) {
        this.setState({tag: e.target.value});
    },
    handleAdd: function() {
        // console.log(checkLoggedIn());
        // if(!checkLoggedIn()){
        //     alert("You must be signed in to add a FoodShare!");
        //     return;
        // }
        // e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
        // itemsHash[count] = this.state.text;
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
        // addUpdateMarker(this.state.text, this.state.tag);
    },
    handleAddHelper: function(){
        // commented out for now because firebase posting shouldn't be allowed without login
        return this.handleAdd();
    },
    updateInput: function(text, tag) {
        this.setState({items: this.state.items, text: text, tag: tag});
    },
    handleDelete: function() {
        var deleteItem = deleteMarker();
        console.log(deleteItem);
        delete this.state.items[deleteItem];
    },
    submission: function(e) {
        // this.handleAdd(e);
        e.preventDefault();
    },
    render: function() {
        return (
            <div>
            <FoodListItems items={this.state.items} />
        <form onSubmit={this.submission}>
        <Input id="foodInfo" className="col s6" placeholder="Enter food info" type="text" onChange={this.onChange} value={this.state.text} />
        <Input id="foodTag" className="col s6" placeholder="Enter tag" type="text" onChange={this.onTagChange} value={this.state.tag} />

        <Button type="button" className="addBtn" onClick={this.handleAdd}>Add</Button>
            <Button type="button" className="delBtn" onClick={this.handleDelete}>Delete</Button>
        </form>
        </div>
        );
    }
});

var foodList = ReactDOM.render(<FoodListApp />, document.getElementById('list-container'));

getFoodList(foodList);

describe('FoodListApp', function() {
    var foodListAppComponent, element;
    beforeEach(function () {
        element = React.createElement(FoodListApp);
    });
    it("Has an add button", function () {
        foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"addBtn");
        expect(button).not.toBeUndefined();
        expect(button.innerHTML).toBe("<!-- react-text: 9 -->Add<!-- /react-text -->");
    });
    it("Has a delete button", function () {
        foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
        var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"delBtn");
        expect(button).not.toBeUndefined();
        expect(button.innerHTML).toBe("<!-- react-text: 11 -->Delete<!-- /react-text -->");
    });
    it("Has a foodList component", function() {
        foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
        expect(function () {
            ReactTestUtils.findRenderedComponentWithType(foodListAppComponent, FoodListItems);
        }).not.toThrow();
    });
    describe("Add foodShare button", function() {
        beforeEach(function () {
            // var methods = FoodListApp.prototype.__reactAutoBindMap;
            spyOn(FoodListApp.prototype, 'handleAdd').and.callThrough();
            foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
        });
        it("Adds items to the list when Add is clicked", function() {
            var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"addBtn");
            // foodListAppComponent.setState({tag: "sampleTag"});
            // $('#foodInfo').val("exampleFood");
            // $('#foodTag').val("exampleTag");
            ReactTestUtils.Simulate.click(addButton);
            expect(foodListAppComponent.handleAdd).toHaveBeenCalled();
            // expect(foodListAppComponent.state.items[0]).toBe("exampleFood");;
        });
    });
    // describe("Delete foodShare button", function() {
    //     beforeEach(function () {
    //         var methods = FoodListApp.prototype.__reactAutoBindMap;
    //         var methodSpy = spyOn(methods, 'handleAdd').and.callThrough();
    //         foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
    //     });
    //     it("Adds items to the list when Add is clicked", function() {
    //         var delButton = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"delBtn");
    //         // foodListAppComponent.setState({tag: "sampleTag"});
    //         // $('#foodInfo').val("exampleFood");
    //         // $('#foodTag').val("exampleTag");
    //         ReactTestUtils.Simulate.click(addButton);
    //         expect(methodSpy).toHaveBeenCalled();
    //         // expect(foodListAppComponent.state.items[0]).toBe("exampleFood");;
    //     });
    // });

});