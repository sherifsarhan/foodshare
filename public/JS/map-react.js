import React from 'react'
import ReactDOM from 'react-dom'
import {Button, Input, Row} from 'react-materialize'
var ReactTestUtils = require('react-addons-test-utils');

var fireRef = firebase.database().ref('foodshare');
fireRef.on("child_added", function(v){
    createFood(v.val().food, v.val().img, v.val().lat, v.val().lng, v.key, v.val().uid);
});

// var signedIn;
// var uid;
// //get user info if they're signed in
// firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//         // User is signed in.
//         uid = user.uid;
//         signedIn = true;
//     } else {
//         // No user is signed in.
//         uid = null;
//         signedIn = false;
//     }
// });

var currentlyRevealedParent;
$('#foodItems').on('click', ".activator", function () {
    // only one food item description should be open at time
    //Is a foodshare description currently open?
    if(currentlyRevealedParent){
        //Yes there is, hide it please.
        $(currentlyRevealedParent).find('i.material-icons.right').filter(function () {
            return $(this).text() == 'close';
        }).trigger('click');
    }
    //Set this current foodshare description as the one that's visible
    //check if an image has been clicked or not
    var foodMarker;
    if($(this).is("img")){
        currentlyRevealedParent = $(this).parent().siblings('div.card-reveal').children()[0];
        foodMarker = markersTest[$(this).parent().parent().parent().data('key')];
    }
    else if($(this).is("span")){
        currentlyRevealedParent = $(this).parent().parent().siblings('div.card-reveal').children()[0];
        foodMarker = markersTest[$(this).parent().parent().parent().data('key')];
    }
    else{
        currentlyRevealedParent = $(this).siblings('div.card-reveal').children()[0];
        foodMarker = markersTest[$(this).parent().parent().data('key')];
    }

    pos = {
        lat:    foodMarker.lat,
        lng:    foodMarker.lng
    };
    map.setCenter(pos);
});

$('#foodItems').on('click', '.dropdown-button', function() {
    //delete the selectedMarker
    $.ajax({url: "/foodDelete",
        type: 'DELETE',
        data: { key: $(this).data('activates')}});
    $(this).parent().parent().parent().remove();
});

function createFood(text, img, lat, lng, key, foodUID)
{
    //TODO: CHECK TO SEE IF USER IS LOGGED IN, ONLY ALLOW DELETE BUTTON TO SHOW UP ON USER'S OWN SHARES
    //TODO: OTHERWISE, SHOW THE REPORT BUTTON

    var foodDiv;
    if(foodUID = uid) foodDiv = '#myfoodItems';
    else foodDiv = '#foodItems';

    var contentButtonHTML;
    if(signedIn) {
        contentButtonHTML = '<a class="dropdown-button btn red right" href="#" data-activates='+key+'>Delete'+
            '<i class="material-icons right">delete</i></a>';
    }
    else{
        contentButtonHTML = '<a class="dropdown-button btn teal accent-3 right" href="#" data-activates='+key+'>Delete'+
            '<i class="material-icons right">Report</i></a>';
    }

    if(img)
    {
        $(foodDiv).prepend(
            '<div id="foodItem" data-key='+key+' class="foodItem">' +
                '<div class="card">'+
                    '<div data-lat='+lat+' data-lng='+lng+' data-key='+key+' class="card-image waves-effect waves-block waves-light">'+
                        '<img class="activator" src="'+img+'">'+
                    '</div>'+
                    '<div class="card-content">'+
                        contentButtonHTML+
                        '<span class="card-title chip activator grey-text text-darken-4">'+text+'</span>'+
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
    else{
        $(foodDiv).prepend(
            '<div id="foodItem" data-key='+key+' class="foodItem">' +
                '<div class="card">'+
                    '<div class="card-content">'+
                        contentButtonHTML+
                        '<ul id='+key+' class="dropdown-content">'+
                            '<li><a href="#!">one</a></li>'+
                        '</ul>'+
                        '<span class="card-title chip activator grey-text text-darken-4">'+text+'</span>'+
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
        // if(!signedIn){
        //     alert("You must be signed in to add a FoodShare!");
        //     return;
        // }
        // e.preventDefault(); // This is, by default, submit button by form. Make sure it isn't submitted.
        //check to see if a location has been selected and that text has been added to the food form
        if(!latLng || this.state.text == ''){
            console.log("Please either select a location or enter in the food text");
            return;
        }

        // var nextItems = this.state.items.concat([{text: this.state.text, id: Date.now()}]);
        var nextText = '';
        // this.setState({items: nextItems, text: nextText});
        addUpdateMarker(this.state.text, this.state.tag, this.state.img);
        this.setState({text: '', tag: '', imgPreview: false, img: null});
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
        $('#foodForm').trigger("reset");
    },
    handleImageChange: function(image) {
        this.setState({img: image, imgPreview: true})
    },
    render: function() {
        return (
            <div>
            <FoodListItems items={this.state.items} />
        <form id="foodForm" onSubmit={this.submission}>
        <Input id="foodInfo" className="col s6" placeholder="Enter food info" type="text" onChange={this.onChange} value={this.state.text} />
        <Input id="foodTag" className="col s6" placeholder="Enter tag" type="text" onChange={this.onTagChange} value={this.state.tag} />

        <ImageUpload handleImageChange={this.handleImageChange} imgPreview={this.state.imgPreview}></ImageUpload>

        <Row>
            <Button type="submit" className="col s12 addBtn light-green accent-4" onClick={this.handleAdd}>Add</Button>
            {/*<Button type="submit" className="col s6 delBtn" onClick={this.handleDelete}>Delete</Button>*/}
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
            // $('#getFile').val(this.state.file.filename);

        } else {
            // $imagePreview = (<div className="previewText">Please select an Image for Preview</div>);
            // $('#getFile').val("");
            // $('#getFile').reset();
        }

        return (
            <div className="previewComponent">
                {/*<form id="foodForm" encType="multipart/form-data" onSubmit={(e)=>this._handleSubmit(e)}>*/}
                    <input id="getFile" className="fileInput" type="file" title=" " name="foodText" onChange={(e)=>this._handleImageChange(e)} />
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

//the add and delete buttons have a problem.
//when clicked, they stay focused, and don't blur again. this fixes it.
$(".btn").mouseup(function(){
    $(this).blur();
});

$(document).ready(function() {
    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );
});


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