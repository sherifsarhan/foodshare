import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Input, Row} from 'react-materialize'
var ReactTestUtils = require('react-addons-test-utils');

var fireRef = firebase.database().ref('foodshare');
fireRef.on("child_added", function(v){
    if(v.val().img) createFood(v.val().food, v.val().img, v.val().lat, v.val().lng);
});


$('#foodItems').on('click', "#selectCardImage", function () {
    //only one food item description should be open at time
    var closeButtonParent = $(this).find('div.card-content').child;
    $('i.material-icons.right').filter(function () {
        return $(this).text() == 'close' && $(this).parent() != closeButtonParent;
    }).trigger('click');
    pos = {
        lat: $(this).data('lat'),
        lng: $(this).data('lng')
    };
    map.setCenter(pos);
});

function createFood(text, img, lat, lng)
{
    if(img)
    {
        $('#foodItems').prepend(
            '<div id="foodItem" class="foodItem">' +
                '<div class="card">'+
                    '<div id="selectCardImage" data-lat='+lat+' data-lng='+lng+' class="card-image waves-effect waves-block waves-light">'+
                        '<img class="activator" src="'+img+'">'+
                    '</div>'+
                    '<div class="card-content">'+
                        '<span class="card-title activator grey-text text-darken-4">'+text+'<i class="material-icons right">more_vert</i></span>'+
                        '<p><a href="#">This is a link</a></p>'+
                    '</div>'+
                    '<div class="card-reveal">'+
                        '<span class="card-title grey-text text-darken-4">'+text+'<i class="material-icons right">close</i></span>'+
                        '<p>Here is some more information about this product that is only revealed once clicked on.</p>'+
                    '</div>'+
                '</div>'+
            '</div>'
        );
        // console.log("added img");
    }
    else
        $('#foodItems').prepend(
    '<div id="foodItem" class="foodItem">' +
        '<div class="card">'+
            '<div class="card-content">'+
                '<span class="card-title activator grey-text text-darken-4">'+text+'<i class="material-icons right">more_vert</i></span>'+
                '<p><a href="#">This is a link</a></p>'+
            '</div>'+
            '<div class="card-reveal">'+
                '<span class="card-title grey-text text-darken-4">'+text+'<i class="material-icons right">close</i></span>'+
                '<p>Here is some more information about this product that is only revealed once clicked on.</p>'+
            '</div>'+
        '</div>'+
    '</div>'
        );
}
$('#newItemForm').submit(function(e)
{
    e.preventDefault();
    var formData = new FormData($("#newItemForm")[0]);
    console.log(formData);
    $.ajax({
        type: "POST",
        url: "/food",
        data: formData,processData: false,
        contentType: false

    });
});

//credit to Professor Bell from GMU's SWE-432
var FoodListItems = React.createClass({
    render: function() {
        var createItem = function(item) {
            return <li key={item.id}>{item.text}</li>;
        };
        return <ul>{this.props.items.map(createItem)}</ul>;
    }
});

var FoodListApp = React.createClass({
    getInitialState: function() {
        return {items: [], text: '', tag: '', img: '', imgPreview: false};
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
        var nextText = '';
        this.setState({items: nextItems, text: nextText});
        addUpdateMarker(this.state.text, this.state.tag, this.state.img);
        this.setState({tag: '', imgPreview: false});
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
        e.preventDefault();
    },
    handleImageChange: function(image) {
        this.setState({img: image, imgPreview: true})
    },
    render: function() {
        return (
            <div>
            <FoodListItems items={this.state.items} />
        <form onSubmit={this.submission}>
        <Input id="foodInfo" className="col s6" placeholder="Enter food info" type="text" onChange={this.onChange} value={this.state.text} />
        <Input id="foodTag" className="col s6" placeholder="Enter tag" type="text" onChange={this.onTagChange} value={this.state.tag} />

        <ImageUpload handleImageChange={this.handleImageChange} imgPreview={this.state.imgPreview}></ImageUpload>

        <Row>
            <Button type="submit" className="col s6 addBtn" onClick={this.handleAdd}>Add</Button>
            <Button type="submit" className="col s6 delBtn" onClick={this.handleDelete}>Delete</Button>
        </Row>
        </form>
        </div>
        );
    }
});

//credit: http://codepen.io/hartzis/pen/VvNGZP?editors=0110
class ImageUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {file: '',
            imagePreviewUrl: '',
            foodText: 'test'
        };
    }

    _handleSubmit(e) {
        e.preventDefault();
        // food: do something with -> this.state.file
        // console.log('handle uploading-', this.state.file);
        var formData = new FormData();
        formData.append('img', this.state.file, this.state.file.name);
        formData.append('foodText',this.state.foodText);
        // console.log(formData);
        $.ajax({
            url: "/food",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false
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
            this.props.handleImageChange(this.state.file);
        };

        reader.readAsDataURL(file);

    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (this.props.imgPreview) {
            $imagePreview = (<img style={{width: "100%",height: "100%",display: "block", margin: "auto"}}
                                  src={imagePreviewUrl} />);
            $('#getFile').val(this.state.file.filename);

        } else {
            $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
            $('#getFile').val("");
        }

        return (
            <div className="previewComponent">
                {/*<form id="foodForm" encType="multipart/form-data" onSubmit={(e)=>this._handleSubmit(e)}>*/}
                    <input id="getFile" className="fileInput" type="file" name="foodText" onChange={(e)=>this._handleImageChange(e)} />
                    {/*<button className="submitButton" type="submit" onClick={(e)=>this._handleSubmit(e)}>Upload Image</button>*/}
                {/*</form>*/}
                <div className="imgPreview foodItem">
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
//         foodListAppComponent = ReactTestUtils.renderInfoodcument(element);
//         var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"addBtn");
//         expect(button).not.toBeUndefined();
//         expect(button.innerHTML).toBe("<!-- react-text: 9 -->Add<!-- /react-text -->");
//     });
//     it("Has a delete button", function () {
//         foodListAppComponent = ReactTestUtils.renderInfoodcument(element);
//         var button = ReactTestUtils.findRenderedDOMComponentWithClass(foodListAppComponent,"delBtn");
//         expect(button).not.toBeUndefined();
//         expect(button.innerHTML).toBe("<!-- react-text: 11 -->Delete<!-- /react-text -->");
//     });
//     it("Has a foodList component", function() {
//         foodListAppComponent = ReactTestUtils.renderInfoodcument(element);
//         expect(function () {
//             ReactTestUtils.findRenderedComponentWithType(foodListAppComponent, FoodListItems);
//         }).not.toThrow();
//     });
//     describe("Add foodShare button", function() {
//         beforeEach(function () {
//             // var methods = FoodListApp.prototype.__reactAutoBindMap;
//             spyOn(FoodListApp.prototype, 'handleAdd').and.callThrough();
//             foodListAppComponent = ReactTestUtils.renderInfoodcument(element);
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
//     //         foodListAppComponent = ReactTestUtils.renderInfoodcument(element);
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