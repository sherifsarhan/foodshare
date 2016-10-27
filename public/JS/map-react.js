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
    componentDidMount: function(){
        getFoodList(this);
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
        addUpdateMarker(this.state.text, this.state.tag);
        this.setState({tag: ''});
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
        this.handleAdd(e);
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
        <ImageUpload></ImageUpload>
        </div>
        );
    }
});

//credit: http://codepen.io/hartzis/pen/VvNGZP?editors=0110
class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: '',imagePreviewUrl: ''};
    }

    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
        var formData = new FormData();
        formData.append('photo', this.state.file, this.state.file.name);
        console.log(formData);
        $.ajax({
            url: "http://localhost:5000/uploadPic",
            type: "POST",
            data: formData,
            contentType: 'multipart/form-data',
            processData: false
        });
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        };

        reader.readAsDataURL(file);
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} />);
        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
        }

        return (
            <div className="previewComponent">
                <form onSubmit={(e)=>this._handleSubmit(e)}>
                    <input className="fileInput" type="file" onChange={(e)=>this._handleImageChange(e)} />
                    <button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>
                </form>
                <div className="imgPreview">
                    {$imagePreview}
                </div>
            </div>
        )
    }
}

var foodList = ReactDOM.render(<FoodListApp />, document.getElementById('list-container'));


// describe('FoodListApp', function() {
//     var foodListAppComponent, element;
//     beforeEach(function () {
//         element = React.createElement(FoodListApp);
//     });
//     it("Has an add button", function () {
//         foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
//         var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"addBtn");
//         expect(button).not.toBeUndefined();
//         expect(button.innerHTML).toBe("<!-- react-text: 9 -->Add<!-- /react-text -->");
//     });
//     it("Has a delete button", function () {
//         foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
//         var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"delBtn");
//         expect(button).not.toBeUndefined();
//         expect(button.innerHTML).toBe("<!-- react-text: 11 -->Delete<!-- /react-text -->");
//     });
//     it("Has a foodList component", function() {
//         foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
//         expect(function () {
//             ReactTestUtils.findRenderedComponentWithType(foodListAppComponent, FoodListItems);
//         }).not.toThrow();
//     });
//     describe("Add foodShare button", function() {
//         beforeEach(function () {
//             // var methods = FoodListApp.prototype.__reactAutoBindMap;
//             spyOn(FoodListApp.prototype, 'handleAdd').and.callThrough();
//             foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
//         });
//         it("Adds items to the list when Add is clicked", function() {
//             var addButton = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"addBtn");
//             // foodListAppComponent.setState({tag: "sampleTag"});
//             // $('#foodInfo').val("exampleFood");
//             // $('#foodTag').val("exampleTag");
//             ReactTestUtils.Simulate.click(addButton);
//             expect(foodListAppComponent.handleAdd).toHaveBeenCalled();
//             // expect(foodListAppComponent.state.items[0]).toBe("exampleFood");;
//         });
//     });
//     // describe("Delete foodShare button", function() {
//     //     beforeEach(function () {
//     //         var methods = FoodListApp.prototype.__reactAutoBindMap;
//     //         var methodSpy = spyOn(methods, 'handleAdd').and.callThrough();
//     //         foodListAppComponent = ReactTestUtils.renderIntoDocument(element);
//     //     });
//     //     it("Adds items to the list when Add is clicked", function() {
//     //         var delButton = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"delBtn");
//     //         // foodListAppComponent.setState({tag: "sampleTag"});
//     //         // $('#foodInfo').val("exampleFood");
//     //         // $('#foodTag').val("exampleTag");
//     //         ReactTestUtils.Simulate.click(addButton);
//     //         expect(methodSpy).toHaveBeenCalled();
//     //         // expect(foodListAppComponent.state.items[0]).toBe("exampleFood");;
//     //     });
//     // });
//
// });